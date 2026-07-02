import { ScenePart, TestEngine } from '@atomic-testing/core';

import { createTestEngine } from './createTestEngine';
import { StorybookPlayContext } from './types';

/**
 * Build a Storybook `play` function around a ready, canvas-scoped test engine.
 *
 * The returned function creates the engine from the play context's
 * `canvasElement`, passes the full play context through to `fn` augmented with
 * `engine` (typed from `parts`), and cleans the engine up afterwards — no
 * `canvasElement` or framework plumbing in the story.
 *
 * @example
 * export const Filled: Story = {
 *   play: withTestEngine(parts, async ({ engine, args }) => {
 *     await engine.parts.input.setValue('hello');
 *   }),
 * };
 */
export function withTestEngine<T extends ScenePart, C extends StorybookPlayContext = StorybookPlayContext>(
  parts: T,
  fn: (context: C & { engine: TestEngine<T> }) => Promise<void>
): (context: C) => Promise<void> {
  return async context => {
    const engine = createTestEngine(context.canvasElement, parts);
    try {
      await fn({ ...context, engine });
    } finally {
      await engine.cleanUp();
    }
  };
}
