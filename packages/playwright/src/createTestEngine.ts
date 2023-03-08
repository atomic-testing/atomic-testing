import { defaultStep, ScenePart, TestEngine } from '@atomic-testing/core';
import { Page } from '@playwright/test';

import { PlaywrightInteractor } from './PlaywrightInteractor';

export function createTestEngine<T extends ScenePart>(page: Page, partDefinitions: T): TestEngine<T> {
  const engine = new TestEngine([], new PlaywrightInteractor(page), {
    perform: defaultStep,
    parts: partDefinitions,
  });

  return engine;
}
