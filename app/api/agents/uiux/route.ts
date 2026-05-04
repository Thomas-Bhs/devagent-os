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

export const maxDuration = 60;

export const POST = traceable(
  async (req: Request) => {
    try {
      const { messages, fileContent } = await req.json();
      const trimmedMessages = messages.slice(-6);

      const { limited, message } = await checkRateLimit(req);
      if (limited) {
        return new Response(JSON.stringify({ error: message }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const baseSystem = `Tu es un expert en UI/UX design pour les applications web et mobile (React, Next.js, React Native).

Ton rôle :
- Analyser et améliorer les interfaces utilisateur
- Proposer des palettes de couleurs cohérentes
- Créer des style guides complets
- Suggérer des améliorations d'accessibilité et d'ergonomie

Règles :
- Toujours fournir du code React/Tailwind fonctionnel
- Préciser Web ou Mobile
- Respecter les principes WCAG pour l'accessibilité
- Proposer des solutions concrètes avec exemples visuels en code`;

      const system = fileContent
        ? `${baseSystem}\n\nFichier attaché (${fileContent.name}):\n\`\`\`\n${fileContent.content}\n\`\`\``
        : baseSystem;

      const result = streamText({
        model: anthropic('claude-haiku-4-5-20251001'),
        system,
        messages: trimmedMessages,
        maxSteps: 3,
        maxTokens: 2000,
        onError: (error) => console.error('UI/UX agent error:', JSON.stringify(error)),
        tools: {
          analyzeDesign: tool({
            description: 'Analyse un composant ou une interface et propose des améliorations UI/UX',
            parameters: z.object({
              component: z.string().describe('Le code du composant à analyser'),
              context: z.string().optional().describe('Contexte : mobile, web, dashboard...'),
            }),
            execute: async ({ component, context }) => {
              return { component, context, timestamp: new Date().toISOString() };
            },
          }),
          suggestColorPalette: tool({
            description: 'Génère une palette de couleurs cohérente pour un projet',
            parameters: z.object({
              mood: z
                .string()
                .describe("L'ambiance souhaitée : professionnel, créatif, minimal..."),
              platform: z.enum(['web', 'mobile']).describe('Plateforme cible'),
              baseColor: z.string().optional().describe('Couleur de base en hex ex: #2563eb'),
            }),
            execute: async ({ mood, platform, baseColor }) => {
              return { mood, platform, baseColor, timestamp: new Date().toISOString() };
            },
          }),
          generateStyleGuide: tool({
            description: 'Crée un style guide complet pour un projet',
            parameters: z.object({
              projectName: z.string().describe('Nom du projet'),
              platform: z.enum(['web', 'mobile', 'both']).describe('Plateforme cible'),
              style: z.string().describe('Style visuel : minimal, bold, playful, corporate...'),
            }),
            execute: async ({ projectName, platform, style }) => {
              return { projectName, platform, style, timestamp: new Date().toISOString() };
            },
          }),
        },
      });

      const response = result.toDataStreamResponse();

      result.usage.then((usage) => {
        if (usage) {
          trackTokens({
            agent: 'uiux',
            model: 'claude-haiku-4-5-20251001',
            promptTokens: usage.promptTokens,
            completionTokens: usage.completionTokens,
            totalTokens: usage.totalTokens,
            cost: calculateCost(
              'claude-haiku-4-5-20251001',
              usage.promptTokens,
              usage.completionTokens
            ),
            conversationId: 'unknown',
          }).catch(console.error);
        }
      });

      return response;
    } catch (error) {
      console.error('UI/UX agent error:', error);
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
  { name: 'agent-uiux-post', client: langsmithClient }
);
