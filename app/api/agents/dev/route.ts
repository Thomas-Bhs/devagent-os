import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { tavily } from '@tavily/core';
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

      // Rate limiting
      const { limited, message } = await checkRateLimit(req);
      if (limited) {
        return new Response(JSON.stringify({ error: message }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      //we keep the last 6 messages to limits the tokens
      const trimmedMessages = messages.slice(-6);

      const baseSystem = `Tu es un expert React, Next.js, React Native, Node.js, TypeScript.

      Règles :
      - Code TypeScript complet et fonctionnel obligatoire
      - Blocs markdown avec langage spécifié ex: \`\`\`typescript
      - Préciser Web ou Mobile
      - Pour toute question sur Next.js/React/RN/CSS : utiliser searchDocs en premier
      - Baser la réponse uniquement sur les résultats searchDocs, citer l'URL source`;

      const system = fileContent
        ? `${baseSystem}\n\nFichier attaché par l'utilisateur (${fileContent.name}):\n\`\`\`\n${fileContent.content}\n\`\`\``
        : baseSystem;

      const result = streamText({
        model: anthropic('claude-sonnet-4-5'),
        system,
        messages: trimmedMessages,
        maxSteps: 3,
        maxTokens: 1500,
        onError: (error) => console.error('streamText error:', JSON.stringify(error)),
        tools: {
          analyzeCode: tool({
            description:
              'Analyse un bloc de code et identifie les problèmes ou améliorations possibles',
            parameters: z.object({
              code: z.string().describe('Le code à analyser'),
              language: z.string().describe('Le langage : typescript, javascript, tsx...'),
            }),
            execute: async ({ code, language }) => {
              return { code, language, timestamp: new Date().toISOString() };
            },
          }),
          suggestFileStructure: tool({
            description: 'Suggère une structure de fichiers pour un type de feature donné',
            parameters: z.object({
              featureType: z
                .string()
                .describe('Type de feature : auth, dashboard, api-route, component...'),
              platform: z.enum(['web', 'mobile', 'both']).describe('Plateforme cible'),
            }),
            execute: async ({ featureType, platform }) => {
              return { featureType, platform };
            },
          }),
          searchDocs: tool({
            description:
              'Recherche dans la documentation officielle de Next.js, React, React Native ou MDN',
            parameters: z.object({
              query: z.string().describe('La recherche à effectuer'),
              topic: z
                .enum(['nextjs', 'react', 'react-native', 'mdn', 'general'])
                .describe('La documentation à cibler'),
            }),
            execute: async ({ query, topic }) => {
              const client = tavily({ apiKey: process.env.TAVILY_API_KEY! });
              const domains: Record<string, string[]> = {
                nextjs: ['nextjs.org'],
                react: ['react.dev'],
                'react-native': ['reactnative.dev'],
                mdn: ['developer.mozilla.org'],
                general: ['nextjs.org', 'react.dev', 'reactnative.dev', 'developer.mozilla.org'],
              };
              const response = await client.search(query, {
                includeDomains: domains[topic],
                maxResults: 3,
              });
              return {
                results: response.results.map((r) => ({
                  title: r.title,
                  url: r.url,
                  content: r.content.slice(0, 500),
                })),
              };
            },
          }),
          generateComponent: tool({
            description:
              "Génère un composant React ou React Native complet à partir d'une description",
            parameters: z.object({
              name: z.string().describe('Le nom du composant en PascalCase, ex: UserCard'),
              description: z.string().describe('Ce que le composant doit faire'),
              platform: z
                .enum(['web', 'mobile'])
                .describe('web pour React, mobile pour React Native'),
              props: z
                .array(z.string())
                .describe('Liste des props attendues, ex: ["userId", "userName"]'),
            }),
            execute: async ({ name, platform, description, props }) => {
              return {
                name,
                platform,
                description,
                props,
                instruction: `Génère un composant ${
                  platform === 'web' ? 'React' : 'React Native'
                } TypeScript nommé ${name} avec les props suivantes : ${props.join(
                  ', '
                )}. Description : ${description}`,
              };
            },
          }) /*
          readFile: tool({
            description: "Lit et analyse le contenu d'un fichier de code fourni par l'utilisateur",
            parameters: z.object({
              filename: z.string().describe('Le nom du fichier'),
              content: z.string().describe('Le contenu du fichier'),
              analysisType: z
                .enum(['bugs', 'improvements', 'explain', 'full'])
                .describe("Type d'analyse"),
            }),
            execute: async ({ filename, content, analysisType }) => {
              return { filename, content, analysisType };
            },
          }),*/,
        },
      });

      const response = result.toDataStreamResponse();

      result.usage.then((usage) => {
        if (usage) {
          trackTokens({
            agent: 'dev',
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
      console.error('Agent error:', error);
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
  { name: 'agent-dev-post', client: langsmithClient }
);
