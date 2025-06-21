import { ScenePart, TestEngine } from '@atomic-testing/core';
import { Page } from '@playwright/test';

import { PlaywrightInteractor } from './PlaywrightInteractor';

/**
 * Create a {@link TestEngine} instance backed by Playwright.
 *
 * @param page - Playwright page used for interaction.
 * @param partDefinitions - Scene part definitions describing the scene
 *   structure for the engine.
 * @returns A configured {@link TestEngine} ready for use.
 */
export function createTestEngine<T extends ScenePart>(page: Page, partDefinitions: T): TestEngine<T> {
  const engine = new TestEngine([], new PlaywrightInteractor(page), {
    parts: partDefinitions,
  });

  return engine;
}
