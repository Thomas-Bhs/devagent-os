import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { Client } from 'langsmith';
import { traceable } from 'langsmith/traceable';
import { trackTokens, calculateCost } from '@/app/lib/db/tokens';
import { checkRateLimit } from '@/app/lib/rateLimit';
import { checkAgentAccess } from '@/app/lib/guards/agentGuard';

const anthropic = createAnthropic();
const langsmithClient = new Client({
  apiKey: process.env.LANGSMITH_API_KEY,
});

export const maxDuration = 30;

export const POST = traceable(
  async (req: Request) => {
    try {
      const { messages, fileContent } = await req.json();

      //agent access control
      const guard = await checkAgentAccess('qa');
      if (!guard.authorized) return guard.response!;

      const { limited, message } = await checkRateLimit(req);
      if (limited) {
        return new Response(JSON.stringify({ error: message }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const trimmedMessages = messages.slice(-6);

      const baseSystem = `Tu es un expert en tests React, Next.js, React Native, TypeScript.

      Règles :
      - Utiliser Jest + React Testing Library (web) ou React Native Testing Library (mobile)
      - Tester cas nominaux ET cas d'erreur obligatoirement
      - Nommer les tests de manière descriptive (describe/it)
      - Code de tests complet et fonctionnel obligatoire
      - Blocs markdown avec langage spécifié ex: \`\`\`typescript`;

      const system = fileContent
        ? `${baseSystem}\n\nFichier attaché (${fileContent.name}):\n\`\`\`\n${fileContent.content}\n\`\`\``
        : baseSystem;

      const result = streamText({
        model: anthropic('claude-haiku-4-5-20251001'),
        system,
        messages: trimmedMessages,
        maxSteps: 3,
        maxTokens: 2000,
        onError: (error) => console.error('QA agent error:', JSON.stringify(error)),
        tools: {
          generateTests: tool({
            description:
              "Génère des tests unitaires ou d'intégration pour un composant ou une fonction",
            parameters: z.object({
              code: z.string().describe('Le code à tester'),
              language: z.string().describe('Le langage : typescript, javascript, tsx...'),
              testType: z.enum(['unit', 'integration', 'e2e']).describe('Type de test'),
              platform: z
                .enum(['web', 'mobile'])
                .describe('web pour React/Next.js, mobile pour React Native'),
            }),
            execute: async ({ code, language, testType, platform }) => {
              return { code, language, testType, platform, timestamp: new Date().toISOString() };
            },
          }),
          analyzeTestCoverage: tool({
            description:
              "Analyse la couverture de tests d'un fichier et identifie les cas non testés",
            parameters: z.object({
              code: z.string().describe('Le code source'),
              existingTests: z.string().optional().describe('Les tests existants si disponibles'),
            }),
            execute: async ({ code, existingTests }) => {
              return { code, existingTests, timestamp: new Date().toISOString() };
            },
          }),
          suggestTestStrategy: tool({
            description: 'Propose une stratégie de tests adaptée au type de projet',
            parameters: z.object({
              projectType: z.enum(['web', 'mobile', 'api', 'fullstack']).describe('Type de projet'),
              features: z.array(z.string()).describe('Liste des features à tester'),
            }),
            execute: async ({ projectType, features }) => {
              return { projectType, features, timestamp: new Date().toISOString() };
            },
          }),
        },
      });

      const response = result.toDataStreamResponse();

      result.usage.then((usage) => {
        if (usage) {
          trackTokens({
            agent: 'qa',
            model: 'claude-haiku-4-5-20251001',
            promptTokens: usage.promptTokens,
            completionTokens: usage.completionTokens,
            totalTokens: usage.totalTokens,
            cost: calculateCost('claude-sonnet-4-5', usage.promptTokens, usage.completionTokens),
            conversationId: 'unknown',
          }).catch(console.error);
        }
      });

      return response;
    } catch (error) {
      console.error('QA agent error:', error);
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
  { name: 'agent-qa-post', client: langsmithClient }
);
