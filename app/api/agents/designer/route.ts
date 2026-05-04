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

      const baseSystem = `Tu es un expert en design et création de maquettes pour les applications web et mobile (React, Next.js, React Native).

Ton rôle :
- Générer des maquettes en code HTML/CSS/Tailwind
- Analyser et améliorer les layouts existants
- Suggérer des typographies cohérentes
- Créer des composants visuels complets et esthétiques

Règles :
- Toujours fournir du code fonctionnel React/Tailwind
- Les maquettes doivent être pixel-perfect et responsive
- Respecter les principes de design : hiérarchie visuelle, espacement, contraste
- Proposer des variantes quand c'est pertinent`;

      const system = fileContent
        ? `${baseSystem}\n\nFichier attaché (${fileContent.name}):\n\`\`\`\n${fileContent.content}\n\`\`\``
        : baseSystem;

      const result = streamText({
        model: anthropic('claude-haiku-4-5-20251001'),
        system,
        messages: trimmedMessages,
        maxSteps: 3,
        maxTokens: 2000,
        onError: (error) => console.error('Designer agent error:', JSON.stringify(error)),
        tools: {
          generateMockup: tool({
            description:
              'Génère une maquette complète en code React/Tailwind pour un écran ou composant',
            parameters: z.object({
              screenType: z
                .string()
                .describe("Type d'écran : landing page, dashboard, profile, login..."),
              platform: z.enum(['web', 'mobile']).describe('Plateforme cible'),
              style: z
                .string()
                .describe('Style visuel : minimal, bold, glassmorphism, neumorphism...'),
            }),
            execute: async ({ screenType, platform, style }) => {
              return { screenType, platform, style, timestamp: new Date().toISOString() };
            },
          }),
          analyzeLayout: tool({
            description: 'Analyse un layout existant et propose des améliorations de design',
            parameters: z.object({
              layout: z.string().describe('Le code du layout à analyser'),
              issues: z
                .string()
                .optional()
                .describe('Problèmes constatés : espacement, alignement, hiérarchie...'),
            }),
            execute: async ({ layout, issues }) => {
              return { layout, issues, timestamp: new Date().toISOString() };
            },
          }),
          suggestTypography: tool({
            description: 'Propose un système typographique complet pour un projet',
            parameters: z.object({
              projectType: z
                .string()
                .describe('Type de projet : corporate, creative, editorial, app...'),
              platform: z.enum(['web', 'mobile']).describe('Plateforme cible'),
              mood: z.string().describe('Ambiance : sérieux, playful, luxe, tech...'),
            }),
            execute: async ({ projectType, platform, mood }) => {
              return { projectType, platform, mood, timestamp: new Date().toISOString() };
            },
          }),
        },
      });

      const response = result.toDataStreamResponse();

      result.usage.then((usage) => {
        if (usage) {
          trackTokens({
            agent: 'designer',
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
      console.error('Designer agent error:', error);
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
  { name: 'agent-designer-post', client: langsmithClient }
);
