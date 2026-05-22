import { spatialTheme } from './themes/spatial';
import { falloutTheme } from './themes/fallout';

export interface ThemeConfig {
  id: string;
  name: string;

  // Base colors
  bg: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  accent: string;

  // Typography
  fontFamily: string;

  // Labels
  labelPrefix: string;
  labelSuffix: string;

  // Components
  cardBg: string;
  cardBorder: string;
  inputBg: string;
  sectionLabelColor: string;
  pillBg: string;
  pillRunningBg: string;
  pillRunningText: string;
  pillCompletedBg: string;
  pillCompletedText: string;
  userBubbleBg: string;
  userBubbleText: string;
  agentBubbleBg: string;
  agentBubbleBorder: string;
  codeBg: string;
  codeText: string;
  agentBarBg: string;

  // semantic colors
  highlightColor: string;
  subtleBg: string;

  // Pricing page
  pricingTitle: string;
  pricingSubtitle: string;
  pricingPopularLabel: string;
  pricingAgentsLabel: string;
  pricingCtaLabel: string;
  pricingCtaLoadingLabel: string;
  pricingFooterNote: string;
  pricingCheckIcon: string;

  // Animations pricing
  pricingCardHoverShadow: string;
  pricingGlowAnimation: boolean;
}

export type Theme = 'spatial' | 'fallout';

export const themes: Record<Theme, ThemeConfig> = {
  spatial: spatialTheme,
  fallout: falloutTheme,
};

export function formatLabel(t: ThemeConfig, text: string): string {
  return `${t.labelPrefix}${t.labelPrefix ? text.toUpperCase() : text}${t.labelSuffix}`;
}
