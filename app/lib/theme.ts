import { spatialTheme } from './themes/spatial';
import { falloutTheme } from './themes/fallout';

export interface ThemeConfig {
  id: string;
  name: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  accent: string;
}

export type Theme = 'spatial' | 'fallout';

export const themes: Record<Theme, ThemeConfig> = {
  spatial: spatialTheme,
  fallout: falloutTheme,
};
