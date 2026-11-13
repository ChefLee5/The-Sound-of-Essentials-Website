import React from 'react';
import { Theme } from '@astryxdesign/core/theme';
import { soeTheme } from '../themes/soe';

/**
 * SoeAstryxTheme — Scopes Astryx design tokens and component overrides
 * to the SOE July 2026 canon (#FFF8F0 cream, #FF6F00 accent, Fredoka + Inter)
 * without altering global :root variables on legacy pages.
 */
export const SoeAstryxTheme = ({ children }) => (
  <Theme theme={soeTheme} mode="light">
    {children}
  </Theme>
);

export default SoeAstryxTheme;

