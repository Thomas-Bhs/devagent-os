import type { ThemeConfig } from '../theme';

export const falloutTheme: ThemeConfig = {
  id: 'fallout',
  name: 'Fallout',

  bg: '#0a0f0a',
  surface: '#0d120d',
  border: '#2eb82e',
  text: '#2eb82e',
  textSecondary: '#1a5c1a',
  accent: '#2eb82e',

  fontFamily: 'monospace',

  labelPrefix: '// ',
  labelSuffix: '_',

  cardBg: '#2eb82e10',
  cardBorder: '#2eb82e40',
  inputBg: '#0a0f0a',
  sectionLabelColor: '#2eb82e',
  pillBg: '#2eb82e15',
  pillRunningBg: '#2eb82e20',
  pillRunningText: '#2eb82e',
  pillCompletedBg: '#2eb82e10',
  pillCompletedText: '#1a5c1a',
  userBubbleBg: '#2eb82e20',
  userBubbleText: '#2eb82e',
  agentBubbleBg: '#2eb82e08',
  agentBubbleBorder: '#2eb82e40',
  codeBg: '#0a0f0a',
  codeText: '#2eb82e',
  agentBarBg: '#2eb82e',

  // semantic colors
  highlightColor: '#2eb82e',
  subtleBg: '#2eb82e20',

  //Pricing page
  pricingTitle: '>> SUBSCRIPTION PLANS <<',
  pricingSubtitle: 'SELECT ACCESS LEVEL TO CONTINUE',
  pricingPopularLabel: '★ MOST POPULAR ★',
  pricingAgentsLabel: '>> AGENTS',
  pricingCtaLabel: 'INITIATE SUBSCRIPTION',
  pricingCtaLoadingLabel: 'PROCESSING...',
  pricingFooterNote: '[ SECURE PAYMENT PROCESSED BY VAULT-TEC FINANCIAL ]',
  pricingCheckIcon: '►',

  // Animations pricing
  pricingCardHoverShadow: '0 0 24px #2eb82e40',
  pricingGlowAnimation: true,
};
