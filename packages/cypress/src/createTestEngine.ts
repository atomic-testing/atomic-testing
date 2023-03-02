import { defaultStep, ScenePart, TestEngine } from '@testzilla/core';

import { CypressInteractor } from './CypressInteractor';

export function createTestEngine<T extends ScenePart>(partDefinitions: T): TestEngine<T> {
  const engine = new TestEngine([], new CypressInteractor(), {
    perform: defaultStep,
    parts: partDefinitions,
  });

  return engine;
}
