# DevAgent OS

> AI-powered multi-agent development assistant — built with Next.js, Claude API, MongoDB and Stripe.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![Claude](https://img.shields.io/badge/Claude-Sonnet%20%7C%20Haiku-orange?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Stripe](https://img.shields.io/badge/Stripe-Billing-6772e5?style=flat-square&logo=stripe)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)
![NextAuth](https://img.shields.io/badge/Auth-Google%20OAuth-blue?style=flat-square&logo=google)
![Resend](https://img.shields.io/badge/Emails-Resend-black?style=flat-square)
![Sentry](https://img.shields.io/badge/Monitoring-Sentry-purple?style=flat-square&logo=sentry)
![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100%2F100%2F100-green?style=flat-square&logo=lighthouse)

**Live demo** → [devagent-os.vercel.app](https://devagent-os.vercel.app)

---

## What is DevAgent OS?

DevAgent OS is a production-ready SaaS multi-agent AI system where each agent specializes in a specific development task. A central orchestrator coordinates the agents and can run them sequentially as a pipeline — from code generation to debugging, testing, and UI design.

Built to demonstrate AI agent architecture, full-stack development, SaaS billing infrastructure, and production deployment practices.

---

## V2 — SaaS Features

- **Stripe Billing** — 3 subscription plans (Starter / Pro / Expert) with recurring payments
- **Webhooks** — Stripe event handling with signature verification and idempotency
- **Plan-based access control** — agents locked by subscription tier
- **Monthly quota system** — atomic request counter with auto-reset on the 1st
- **Customer portal** — Stripe-hosted subscription management (upgrade, cancel, invoices)
- **Billing dashboard** — real-time quota usage, plan info and renewal date
- **Transactional emails** — welcome, quota alert (80%) and cancellation via Resend
- **RGPD compliant** — full account deletion (MongoDB + Stripe customer)
- **Mobile responsive** — mobile-first layout with burger menu and sidebar drawer
- **Admin bypass** — unlimited access for the admin account

---

## Pricing

| Plan    | Price | Agents                                        | Requests/month |
| ------- | ----- | --------------------------------------------- | -------------- |
| Starter | 7€    | Dev, Debug, QA                                | 800            |
| Pro     | 15€   | Dev, Debug, QA, UI/UX, Designer               | 1 500          |
| Expert  | 24€   | Dev, Debug, QA, UI/UX, Designer, Orchestrator | 3 000          |

---

## Agents

| Agent            | Model             | Role                                 | Eval Score |
| ---------------- | ----------------- | ------------------------------------ | ---------- |
| **Dev**          | Claude Sonnet 4.5 | Code, hooks, architecture            | 2.70/3     |
| **Debug**        | Claude Sonnet 4.5 | Error analysis, bug fixes            | 3.00/3     |
| **QA**           | Claude Haiku 4.5  | Tests, coverage, quality             | 3.00/3     |
| **UI/UX**        | Claude Haiku 4.5  | Design, color palettes, style guides | 3.00/3     |
| **Designer**     | Claude Haiku 4.5  | Mockups, layouts, typography         | 3.00/3     |
| **Orchestrator** | Claude Sonnet 4.5 | Coordinates all agents               | —          |

> Scores measured with automated LLM-as-judge evaluation using Groq Llama 3.1 8b.

---

## Key Features

- **Multi-agent pipeline** — Orchestrator routes tasks to the right agent or runs them sequentially (Dev → Debug → QA → Designer)
- **Dual theme** — Spatial Cards (Apple-inspired) and Fallout (green phosphor CRT terminal)
- **Component Preview** — Designer agent generates React/Tailwind mockups with live Sandpack preview
- **Persistent conversations** — MongoDB stores full conversation history with load/delete
- **Token dashboard** — Real-time token usage and cost tracking by agent (Today / Week / Month)
- **File upload** — Attach `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css` files for analysis
- **Auth** — Google OAuth via NextAuth.js
- **Monitoring** — Sentry error tracking and performance tracing
- **LangSmith tracing** — All agent calls traced with latency and error tracking
- **Mobile responsive** — Mobile-first layout with burger menu and sidebar drawer

---

## Lighthouse Scores

| Performance | Accessibility | Best Practices | SEO |
| ----------- | ------------- | -------------- | --- |
| 99          | 96            | 100            | 100 |

---

## Tech Stack

```
Framework     Next.js 16.2 + TypeScript + Tailwind
AI SDK        Vercel AI SDK v4 (ai@4.3.16)
Models        Claude Sonnet 4.5 + Claude Haiku 4.5
Provider      Anthropic (@ai-sdk/anthropic@1.1.12)
Database      MongoDB Atlas
Auth          NextAuth.js + Google OAuth
Billing       Stripe (subscriptions, webhooks, portal)
Emails        Resend (transactional)
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
├── api/
│   ├── agents/
│   │   ├── dev/route.ts          → Claude Sonnet + agent guard
│   │   ├── debug/route.ts        → Claude Sonnet + agent guard
│   │   ├── qa/route.ts           → Claude Haiku + agent guard
│   │   ├── uiux/route.ts         → Claude Haiku + agent guard
│   │   ├── designer/route.ts     → Claude Haiku + agent guard
│   │   └── orchestrator/route.ts → Claude Sonnet + agent guard
│   ├── stripe/
│   │   ├── webhook/route.ts      → Stripe events + idempotency
│   │   ├── create-checkout-session/
│   │   ├── portal/route.ts       → Customer portal redirect
│   │   └── session/route.ts      → Session retrieval
│   ├── billing/route.ts          → Subscription + quota data
│   ├── user/delete/route.ts      → RGPD account deletion
│   ├── conversations/            → CRUD MongoDB
│   └── stats/                    → Token aggregations
├── billing/
│   └── page.tsx                  → Billing dashboard
├── pricing/
│   └── page.tsx                  → Pricing page
├── checkout/
│   └── success/page.tsx          → Post-payment confirmation
├── config/
│   └── agents.tsx                → Centralized agent config
├── context/
│   └── ThemeContext.tsx          → Theme provider
├── hooks/
│   ├── useAgent.ts
│   ├── useConversations.ts
│   ├── useTokenStats.ts
│   └── useBilling.ts             → Subscription + quota data
├── lib/
│   ├── stripe.ts                 → Stripe singleton
│   ├── email.ts                  → Resend email functions
│   ├── plans.ts                  → Plan config (source of truth)
│   ├── auth.ts                   → NextAuth config
│   ├── mongodb.ts
│   ├── theme.ts                  → ThemeConfig + formatLabel()
│   ├── guards/
│   │   └── agentGuard.ts         → Subscription + quota check
│   ├── db/
│   │   ├── subscriptions.ts      → CRUD + atomic quota increment
│   │   ├── deleteUser.ts         → Full account deletion
│   │   ├── tokens.ts
│   │   ├── conversations.ts
│   │   └── visitors.ts
│   └── themes/
│       ├── spatial.ts
│       └── fallout.ts
└── components/
    ├── layout/                   → Topbar, Sidebar, SettingsPanel
    ├── agents/                   → AgentCard, AgentChip
    └── chat/                     → ChatMessages, ChatInput, MessageBubble
```

---

## Stripe Security

- Webhook signature verification (`stripe.webhooks.constructEvent`)
- Idempotency via `stripe_events` MongoDB collection — prevents double processing
- `current_period_end` logic — access maintained until end of paid period on cancellation
- Hard quota limit with atomic MongoDB increment (`$inc` + `$expr`) — no race conditions
- Admin bypass via `ADMIN_EMAIL` environment variable
- Budget cap configured on Anthropic dashboard ($50 hard limit)
- Throttle 10 req/minute per user via rate limiting middleware

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
  pricingTitle: 'Choose your plan',
  pricingGlowAnimation: false,
  // ... all semantic properties
};

// 2. Export from app/lib/themes/index.ts
// 3. Add to themes record in app/lib/theme.ts
// 4. Add to Theme union type
```

---

## Token Optimization

| Agent        | Model  | Reason                         |
| ------------ | ------ | ------------------------------ |
| Dev          | Sonnet | Complex architecture decisions |
| Debug        | Sonnet | Subtle bug analysis            |
| QA           | Haiku  | Structured test patterns       |
| UI/UX        | Haiku  | Structured design patterns     |
| Designer     | Haiku  | Structured mockup patterns     |
| Orchestrator | Sonnet | Multi-agent coordination       |

Additional optimizations:

- History trimmed to last 6 messages
- `maxTokens` capped per agent (1000–2000)
- System prompts compressed
- Agent images converted to WebP (10x lighter)

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

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_EXPERT=price_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev

# Admin
ADMIN_EMAIL=your@email.com

# LangSmith
LANGSMITH_API_KEY=...
LANGSMITH_TRACING_V2=true
LANGSMITH_ENDPOINT=https://eu.api.smith.langchain.com
LANGSMITH_PROJECT=agent-dev

# Tavily
TAVILY_API_KEY=tvly-...

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

# Dev server
npm run dev

# Stripe webhooks (separate terminal)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Roadmap

- [x] Google Auth (NextAuth.js)
- [x] Sentry monitoring
- [x] Rate limiting per user
- [x] Stripe billing (subscriptions, webhooks, portal)
- [x] Plan-based agent access control
- [x] Monthly quota system
- [x] Transactional emails (Resend)
- [x] RGPD account deletion
- [x] Mobile responsive layout
- [x] Billing dashboard
- [ ] Custom domain
- [ ] Stripe live mode
- [ ] Multi-language FR/EN (next-intl)
- [ ] Claude Opus on Orchestrator for complex pipelines

---

## Author

Built by **Thomas Bourc'his** — fullstack developer.

[bourchisthomas@gmail.com](mailto:bourchisthomas@gmail.com) · [GitHub](https://github.com/Thomas-Bhs/agent-dev)

Deployed on [Vercel](https://vercel.com) · Powered by [Anthropic](https://anthropic.com) · Billing by [Stripe](https://stripe.com)
