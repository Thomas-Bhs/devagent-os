# DevAgent OS 🤖

> AI-powered multi-agent development assistant built with Next.js, Claude API, and MongoDB.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![Claude](https://img.shields.io/badge/Claude-Sonnet%20%7C%20Haiku-orange?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)
![NextAuth](https://img.shields.io/badge/Auth-Google%20OAuth-blue?style=flat-square&logo=google)
![Sentry](https://img.shields.io/badge/Monitoring-Sentry-purple?style=flat-square&logo=sentry)

**Live demo** → [devagent-os.vercel.app]([(https://devagent-os.vercel.app))]

---

## Overview

DevAgent OS is a multi-agent AI system where each agent specializes in a specific development task. An orchestrator coordinates the agents and can run them sequentially as a pipeline.

---

## Agents

| Agent | Model | Role | Score |
|-------|-------|------|-------|
| **Dev** | Claude Sonnet | Code, hooks, architecture | 2.70/3 |
| **Debug** | Claude Sonnet | Error analysis, bug fixes | 3.00/3 |
| **QA** | Claude Haiku | Tests, coverage, quality | 3.00/3 |
| **UI/UX** | Claude Haiku | Design, color palettes, style guides | 3.00/3 |
| **Designer** | Claude Haiku | Mockups, layouts, typography | 3.00/3 |
| **Orchestrator** | Claude Sonnet | Coordinates all agents | — |

Scores measured with automated LLM-as-judge evaluation (Llama 3.1 8b).

---

## Features

- **Multi-agent pipeline** — Orchestrator routes tasks to the right agent or runs them sequentially (Dev → Debug → QA → Designer)
- **Dual theme** — Spatial Cards (Apple-inspired) and Fallout (green phosphor CRT terminal)
- **Component Preview** — Designer agent generates React/Tailwind mockups with live Sandpack preview
- **Persistent conversations** — MongoDB stores full conversation history with load/delete
- **Token dashboard** — Real-time token usage and cost tracking by agent (Today / Week / Month)
- **File upload** — Attach `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css` files for analysis
- **Auth** — Google OAuth via NextAuth.js
- **Monitoring** — Sentry error tracking and performance tracing
- **LangSmith tracing** — All agent calls traced with latency and error tracking

---

## Tech Stack

```
Framework     Next.js 16.2 + TypeScript + Tailwind
AI SDK        Vercel AI SDK v4 (ai@4.3.16)
Models        Claude Sonnet 4.5 + Claude Haiku 4.5
Provider      Anthropic (@ai-sdk/anthropic@1.1.12)
Database      MongoDB Atlas M0 (free tier)
Auth          NextAuth.js + Google OAuth
Monitoring    Sentry (error tracking + tracing)
Tracing       LangSmith (EU endpoint)
Search        Tavily API (docs search)
Preview       Sandpack (@codesandbox/sandpack-react)
Deployment    Vercel
```

---

## Architecture

```
app/
├── api/agents/
│   ├── dev/route.ts          → Claude Sonnet
│   ├── debug/route.ts        → Claude Sonnet
│   ├── qa/route.ts           → Claude Haiku
│   ├── uiux/route.ts         → Claude Haiku
│   ├── designer/route.ts     → Claude Haiku
│   └── orchestrator/route.ts → Claude Sonnet
├── api/
│   ├── conversations/        → CRUD MongoDB
│   └── stats/                → Token aggregations
├── config/
│   └── agents.tsx            → Centralized agent config
├── context/
│   └── ThemeContext.tsx       → Theme provider (no prop drilling)
├── hooks/
│   ├── useAgent.ts
│   ├── useConversations.ts
│   └── useTokenStats.ts
├── lib/
│   ├── mongodb.ts
│   ├── theme.ts              → ThemeConfig + formatLabel()
│   ├── themes/
│   │   ├── spatial.ts
│   │   └── fallout.ts
│   └── db/
│       ├── tokens.ts
│       └── conversations.ts
└── components/
    ├── layout/               → Topbar, Sidebar, SettingsPanel
    ├── agents/               → AgentCard, AgentChip
    └── chat/                 → ChatMessages, ChatInput, MessageBubble, ToolPill, PreviewModal
```

---

## Theme System

Adding a new theme requires only one file — zero component changes needed.

```typescript
// 1. Create app/lib/themes/mytheme.ts
export const myTheme: ThemeConfig = {
  id: 'mytheme',
  bg: '#...',
  surface: '#...',
  fontFamily: 'monospace',
  labelPrefix: '>> ',
  labelSuffix: ' <<',
  // ... all semantic properties
}

// 2. Export from app/lib/themes/index.ts
// 3. Add to themes record in app/lib/theme.ts
// 4. Add to Theme union type
```

---

## Token Optimization

| Agent | Model | Reason |
|-------|-------|--------|
| Dev | Sonnet | Complex architecture decisions |
| Debug | Sonnet | Subtle bug analysis |
| QA | Haiku | Structured test patterns |
| UI/UX | Haiku | Structured design patterns |
| Designer | Haiku | Structured mockup patterns |
| Orchestrator | Sonnet | Multi-agent coordination |

Additional optimizations:
- History trimmed to last 6 messages
- `maxTokens` capped per agent (1000–2000)
- System prompts compressed

---

## Evaluation

Automated LLM-as-judge evaluation with Groq Llama 3.1 8b.

```bash
# Run all evals
GROQ_API_KEY=gsk_... npx tsx evaluation/run-eval.ts

# Run single agent (index 0-5)
# Edit run-eval.ts: evalAgent(agentConfig[0])
```

Results saved in `evaluation/results/`.

---

## Environment Variables

```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# MongoDB
MONGODB_URI=mongodb+srv://...

# LangSmith
LANGSMITH_API_KEY=...
LANGSMITH_TRACING_V2=true
LANGSMITH_ENDPOINT=https://eu.api.smith.langchain.com
LANGSMITH_PROJECT=agent-dev

# Tavily
TAVILY_API_KEY=tvly-...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...
```

---

## Getting Started

```bash
# Clone
git clone https://github.com/Thomas-Bhs/agent-dev.git
cd agent-dev

# Install
npm install --legacy-peer-deps

# Environment
cp .env.example .env.local
# Fill in your keys

# Dev
npm run dev
```

---

## Roadmap

- [x] Google Auth (NextAuth.js)
- [x] Sentry monitoring
- [ ] Rate limiting per user
- [ ] Custom domain
- [ ] Multi-language FR/EN (next-intl)
- [ ] Claude Opus on Orchestrator for complex pipelines

---

## Author

Built by **Thomas** — fullstack JavaScript developer learning AI agent architecture.

Deployed on [Vercel](https://vercel.com) · Powered by [Anthropic](https://anthropic.com)
