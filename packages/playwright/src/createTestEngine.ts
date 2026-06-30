import { ITestEngineOption, ScenePart, TestEngine } from '@atomic-testing/core';
import { Page } from '@playwright/test';

import { PlaywrightInteractor } from './PlaywrightInteractor';

/**
 * Create a {@link TestEngine} instance backed by Playwright.
 *
 * @param page - Playwright page used for interaction.
 * @param partDefinitions - Scene part definitions describing the scene
 *   structure for the engine.
 * @param _option - Reserved for entry-point symmetry with the other adapters;
 *   currently ignored. `rootElement` is not applicable to Playwright, which drives
 *   a real browser page rather than mounting into a host element.
 * @returns A configured {@link TestEngine} ready for use.
 */
export function createTestEngine<T extends ScenePart>(
  page: Page,
  partDefinitions: T,
  _option?: ITestEngineOption
): TestEngine<T> {
  const engine = new TestEngine([], new PlaywrightInteractor(page), {
    parts: partDefinitions,
  });

  return engine;
}
