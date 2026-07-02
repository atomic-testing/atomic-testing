import { ITestEngineOption, ScenePart, TestEngine } from '@atomic-testing/core';

import { StorybookInteractor } from './StorybookInteractor';

/**
 * Create a test engine over a story's canvas, for use inside a Storybook
 * `play` function.
 *
 * Framework-agnostic: works for any renderer whose story commits to real DOM
 * (React, Vue, …) — see {@link StorybookInteractor}.
 *
 * @param canvasElement The story's canvas element, from the `play` context
 * @param partDefinitions The scene part definitions
 * @param _option Reserved for future use; accepted for entry-point symmetry with
 *   the other adapters and currently ignored.
 * @returns The test engine
 */
export function createTestEngine<T extends ScenePart>(
  canvasElement: HTMLElement,
  partDefinitions: T,
  _option?: ITestEngineOption
): TestEngine<T> {
  const cleanup = () => Promise.resolve();
  return new TestEngine(
    [],
    new StorybookInteractor(canvasElement),
    {
      parts: partDefinitions,
    },
    cleanup
  );
}
