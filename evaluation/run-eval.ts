import Groq from 'groq-sdk';
import * as fs from 'fs';
import { devQuestions } from './datasets/dev';
import { debugQuestions } from './datasets/debug';
import { qaQuestions } from './datasets/qa';
import { uiuxQuestions } from './datasets/uiux';
import { designerQuestions } from './datasets/designer';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const BASE_URL = process.env.EVAL_URL || 'http://localhost:3000';
const MODEL = process.env.EVAL_MODEL || 'claude-sonnet-4-5';

const agentConfig = [
  {
    name: 'dev',
    route: '/api/agents/dev',
    questions: devQuestions,
    outputFile: `evaluation/results/${MODEL}-dev.json`,
  },
  {
    name: 'debug',
    route: '/api/agents/debug',
    questions: debugQuestions,
    outputFile: `evaluation/results/${MODEL}-debug.json`,
  },
  {
    name: 'qa',
    route: '/api/agents/qa',
    questions: qaQuestions,
    outputFile: `evaluation/results/${MODEL}-qa.json`,
  },
  {
    name: 'uiux',
    route: '/api/agents/uiux',
    questions: uiuxQuestions,
    outputFile: `evaluation/results/${MODEL}-uiux.json`,
  },
  {
    name: 'designer',
    route: '/api/agents/designer',
    questions: designerQuestions,
    outputFile: `evaluation/results/${MODEL}-designer.json`,
  },
];

async function askAgent(route: string, question: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    const res = await fetch(`${BASE_URL}${route}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: question }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await res.text();
    const lines = text.split('\n').filter((l) => l.startsWith('0:'));
    const content = lines
      .map((l) => {
        try {
          return JSON.parse(l.slice(2));
        } catch {
          return '';
        }
      })
      .join('');

    return content || 'Pas de réponse';
  } catch (error) {
    console.error(`  ⚠️ Timeout ou erreur réseau — question ignorée`);
    return 'TIMEOUT';
  }
}

async function judgeResponse(
  question: string,
  response: string,
  agentRole: string
): Promise<{ score: number; reason: string }> {
  if (response === 'TIMEOUT') {
    return { score: 0, reason: 'Pas de réponse (timeout)' };
  }

  const judgment = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `Tu es un évaluateur expert en développement React/Next.js/React Native.
Tu évalues les réponses d'un agent spécialisé en "${agentRole}".
Note la réponse de 0 à 3 :
- 0 = Incorrecte ou hallucination
- 1 = Partielle ou imprécise
- 2 = Correcte mais incomplète
- 3 = Correcte et complète avec exemple de code
Réponds UNIQUEMENT en JSON : {"score": X, "reason": "explication courte"}`,
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nRéponse à évaluer:\n${response}`,
      },
    ],
    temperature: 0,
  });

  try {
    const text = judgment.choices[0].message.content || '{}';
    return JSON.parse(text);
  } catch {
    return { score: 0, reason: 'Erreur de parsing' };
  }
}

async function evalAgent(config: (typeof agentConfig)[0]) {
  console.log(`\n🤖 Évaluation agent ${config.name.toUpperCase()}`);
  console.log('─'.repeat(50));

  const results = [];
  let totalScore = 0;

  for (const q of config.questions) {
    console.log(`📝 ${q.id}: ${q.question.slice(0, 50)}...`);

    const response = await askAgent(config.route, q.question);
    const judgment = await judgeResponse(q.question, response, config.name);

    const result = {
      id: q.id,
      question: q.question,
      expectedTool: q.expectedTool,
      response: response.slice(0, 500),
      score: judgment.score,
      reason: judgment.reason,
    };

    results.push(result);
    totalScore += judgment.score;
    console.log(`  Score: ${judgment.score}/3 — ${judgment.reason}`);

    await new Promise((r) => setTimeout(r, 2000));
  }

  const avgScore = (totalScore / config.questions.length).toFixed(2);
  console.log(`\n📊 Score moyen ${config.name}: ${avgScore}/3`);

  const report = {
    agent: config.name,
    model: MODEL,
    date: new Date().toISOString(),
    avgScore,
    totalScore,
    results,
  };

  fs.writeFileSync(config.outputFile, JSON.stringify(report, null, 2));
  console.log(`📄 Résultats → ${config.outputFile}`);

  return { agent: config.name, avgScore, totalScore };
}

async function runAllEvals() {
  console.log('🚀 Démarrage des évaluations multi-agents');
  console.log(`📡 URL: ${BASE_URL}`);
  console.log(`🧠 Modèle: ${MODEL}`);

  const summary = [];

  for (const config of agentConfig) {
    const result = await evalAgent(config);
    summary.push(result);
  }

  console.log('\n' + '═'.repeat(50));
  console.log('📈 RAPPORT FINAL');
  console.log('═'.repeat(50));

  for (const s of summary) {
    const bar = '█'.repeat(Math.round((Number(s.avgScore) * 10) / 3));
    console.log(`  ${s.agent.padEnd(10)} ${bar.padEnd(10)} ${s.avgScore}/3`);
  }

  const globalAvg = (
    summary.reduce((acc, s) => acc + Number(s.avgScore), 0) / summary.length
  ).toFixed(2);

  console.log(`\n  GLOBAL     ${globalAvg}/3`);

  fs.writeFileSync(
    'evaluation/results/summary.json',
    JSON.stringify(
      { model: MODEL, date: new Date().toISOString(), globalAvg, agents: summary },
      null,
      2
    )
  );
  console.log('\n📄 Résumé → evaluation/results/summary.json');
}

//runAllEvals().catch(console.error);

//Eval just one agent
evalAgent(agentConfig[4]).catch(console.error)
//evalAgent(agentConfig[3]).catch(console.error);
