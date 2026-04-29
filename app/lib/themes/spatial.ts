import type { ThemeConfig } from '../theme';

export const spatialTheme: ThemeConfig = {
  id: 'spatial',
  name: 'Spatial Cards',

  // Base colors
  bg: '#f5f5f7',
  surface: '#ffffff',
  border: '#e0e0eb',
  text: '#0f0f1a',
  textSecondary: '#6b7280',
  accent: '#0f0f1a',

  // Typography
  fontFamily: 'inherit',

  // Labels
  labelPrefix: '',
  labelSuffix: '',

  // Components
  cardBg: '#f9fafb',
  cardBorder: 'transparent',
  inputBg: '#f9fafb',
  sectionLabelColor: '#9ca3af',
  pillBg: '#f3f4f6',
  pillRunningBg: '#3b82f6',
  pillRunningText: '#ffffff',
  pillCompletedBg: '#f3f4f6',
  pillCompletedText: '#9ca3af',
  userBubbleBg: '#0f0f1a',
  userBubbleText: '#ffffff',
  agentBubbleBg: '#ffffff',
  agentBubbleBorder: '#f0f0f0',
  codeBg: '#0f0f1a',
  codeText: '#f0f0f0',
  agentBarBg: '', //use agentColors for this

  //semantic colors
  highlightColor: '#0f0f1a',
  subtleBg: '#f3f4f6',
};
