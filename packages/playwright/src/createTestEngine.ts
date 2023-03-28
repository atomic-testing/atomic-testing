import { ScenePart, TestEngine } from '@atomic-testing/core';
import { Page } from '@playwright/test';

import { PlaywrightInteractor } from './PlaywrightInteractor';

export function createTestEngine<T extends ScenePart>(page: Page, partDefinitions: T): TestEngine<T> {
  const engine = new TestEngine([], new PlaywrightInteractor(page), {
    parts: partDefinitions,
  });

  return engine;
}
