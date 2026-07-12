import type { ProjectSnapshot, RunnerId } from '../types';
import { mergedDeps } from './deps';

/**
 * Detect an existing unit-test runner from dependencies and config files.
 * Returns null when nothing is present — the caller then defaults to the
 * framework's paved runner (see the framework plugin) or prompts.
 *
 * Playwright is treated as an *additive* e2e layer, not the primary unit runner,
 * so it only wins when nothing else is present.
 */
export function detectRunner(snapshot: ProjectSnapshot): RunnerId | null {
  const deps = mergedDeps(snapshot.packageJson);
  const has = (name: string): boolean => deps[name] != null;
  const hasConfig = (basename: string): boolean =>
    snapshot.configFiles.some(f => f === basename || f.startsWith(basename.replace(/\.[^.]+$/, '.')));

  const usesBrowserMode = has('@vitest/browser-playwright') || has('@vitest/browser') || has('vitest-browser-react');

  if (has('vitest') || hasConfig('vitest.config.ts')) {
    return usesBrowserMode ? 'vitest-browser' : 'vitest';
  }
  if (has('jest') || has('@swc/jest') || has('ts-jest') || hasConfig('jest.config.js')) {
    return 'jest';
  }
  if (has('@playwright/test') || hasConfig('playwright.config.ts')) {
    return 'playwright';
  }
  return null;
}
