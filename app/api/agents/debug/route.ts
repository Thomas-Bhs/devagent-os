import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { Client } from 'langsmith';
import { traceable } from 'langsmith/traceable';
import { trackTokens, calculateCost } from '@/app/lib/db/tokens';
import { checkRateLimit } from '@/app/lib/rateLimit';

const anthropic = createAnthropic();
const langsmithClient = new Client({
  apiKey: process.env.LANGSMITH_API_KEY,
});

export const maxDuration = 30;

export const POST = traceable(
  async (req: Request) => {
    try {
      const { messages, fileContent } = await req.json();

      // Rate limiting
      const { limited, message } = await checkRateLimit(req);
      if (limited) {
        return new Response(JSON.stringify({ error: message }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const trimmedMessages = messages.slice(-6);

      const baseSystem = `Tu es un expert en debugging React, Next.js, React Native, TypeScript.

      Règles :
      - Identifier la cause racine avant de proposer une solution
      - Code corrigé obligatoire avec explication de la différence
      - Mentionner les edge cases potentiels
      - Blocs markdown avec langage spécifié ex: \`\`\`typescript`;

      const system = fileContent
        ? `${baseSystem}\n\nFichier attaché (${fileContent.name}):\n\`\`\`\n${fileContent.content}\n\`\`\``
        : baseSystem;

      const result = streamText({
        model: anthropic('claude-sonnet-4-5'),
        system,
        messages: trimmedMessages,
        maxSteps: 3,
        maxTokens: 1000,
        onError: (error) => console.error('Debug agent error:', JSON.stringify(error)),
        tools: {
          analyzeError: tool({
            description: 'Analyse une erreur ou un bug et identifie la cause racine',
            parameters: z.object({
              error: z.string().describe("Le message d'erreur ou la description du bug"),
              code: z.string().optional().describe("Le code qui cause l'erreur"),
              context: z
                .string()
                .optional()
                .describe("Le contexte de l'erreur (stack trace, environnement...)"),
            }),
            execute: async ({ error, code, context }) => {
              return { error, code, context, timestamp: new Date().toISOString() };
            },
          }),
          suggestFix: tool({
            description: 'Propose une correction pour un bug identifié',
            parameters: z.object({
              bugDescription: z.string().describe('Description du bug à corriger'),
              currentCode: z.string().describe('Le code actuel avec le bug'),
              language: z.string().describe('Le langage : typescript, javascript, tsx...'),
            }),
            execute: async ({ bugDescription, currentCode, language }) => {
              return { bugDescription, currentCode, language, timestamp: new Date().toISOString() };
            },
          }),
          checkPerformance: tool({
            description: 'Analyse les problèmes de performance dans un code',
            parameters: z.object({
              code: z.string().describe('Le code à analyser'),
              context: z
                .string()
                .optional()
                .describe('Contexte : composant React, API route, hook...'),
            }),
            execute: async ({ code, context }) => {
              return { code, context, timestamp: new Date().toISOString() };
            },
          }),
        },
      });

      const response = result.toDataStreamResponse();

      result.usage.then((usage) => {
        if (usage) {
          trackTokens({
            agent: 'debug',
            model: 'claude-sonnet-4-5',
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
      console.error('Debug agent error:', error);
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
  { name: 'agent-debug-post', client: langsmithClient }
);
