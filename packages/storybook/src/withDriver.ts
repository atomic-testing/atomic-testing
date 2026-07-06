import { byCssSelector, ComponentDriver, ComponentDriverCtor, PartLocator } from '@atomic-testing/core';

import { StorybookInteractor } from './StorybookInteractor';
import { StorybookPlayContext } from './types';

export interface WithDriverOption {
  /**
   * Locator for the driver's root within the story canvas.
   * @defaultValue the story's root element (`:scope > *`, the canvas's first
   * element child). Pass an explicit locator when a decorator wraps the story
   * in extra DOM or the story renders more than one root element.
   */
  readonly locator?: PartLocator;
}

/**
 * Build a Storybook `play` function around a single driver rooted at the
 * story's root element — the lowest-ramp path for the one-component-per-story
 * case: no `ScenePart`, no locators, no `canvasElement` plumbing.
 *
 * The returned function constructs `driverClass` over the story's rendered
 * root (see {@link WithDriverOption.locator}) and passes the full play context
 * through to `fn` augmented with the typed `driver`.
 *
 * @example
 * export const Increments: Story = {
 *   play: withDriver(HTMLButtonDriver, async ({ driver }) => {
 *     await driver.click();
 *   }),
 * };
 */
export function withDriver<
  D extends ComponentDriver<any>, // eslint-disable-line @typescript-eslint/no-explicit-any -- matches ComponentDriverCtor's variance-driven `any`
  C extends StorybookPlayContext = StorybookPlayContext,
>(
  driverClass: ComponentDriverCtor<D>,
  fn: (context: C & { driver: D }) => Promise<void>,
  option?: WithDriverOption
): (context: C) => Promise<void> {
  return async context => {
    const interactor = new StorybookInteractor(context.canvasElement);
    const locator = option?.locator ?? byCssSelector(':scope > *');
    const driver = new driverClass(locator, interactor, {});
    await fn({ ...context, driver });
  };
}
