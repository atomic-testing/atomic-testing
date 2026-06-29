import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { mouseLocationMouseEventUIExample } from './MouseLocation.examples';

export const mouseLocationMouseEventExampleScenePart = {
  target: {
    locator: byDataTestId('mouse-target'),
    driver: HTMLButtonDriver,
  },
  eventDisplay: {
    locator: byDataTestId('mouse-event-name'),
    driver: HTMLElementDriver,
  },
  xDisplay: {
    locator: byDataTestId('mouse-x'),
    driver: HTMLElementDriver,
  },
  yDisplay: {
    locator: byDataTestId('mouse-y'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const mouseLocationMouseEventExample: IExampleUnit<typeof mouseLocationMouseEventExampleScenePart, JSX.Element> =
  {
    ...mouseLocationMouseEventUIExample,
    scene: mouseLocationMouseEventExampleScenePart,
  };

export const mouseLocationMouseEventExampleTestSuite: TestSuiteInfo<typeof mouseLocationMouseEventExample.scene> = {
  title: 'Mouse event: Mouse move/up/click',
  url: '/mouse-event',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertApproxEqual }) => {
    describe(`${mouseLocationMouseEventExample.title}`, () => {
      const engine = useTestEngine(mouseLocationMouseEventExample.scene, getTestEngine, { beforeEach, afterEach });

      test('Mousemove on somewhere in the target should display the correct coordinates', async () => {
        await engine().parts.target.mouseMove({
          position: {
            x: 20,
            y: 15,
          },
        });
        const eventDisplay = await engine().parts.eventDisplay.getText();
        const xDisplay = await engine().parts.xDisplay.getText();
        const yDisplay = await engine().parts.yDisplay.getText();

        // Tolerance-based comparison for cross-browser compatibility: the
        // reported mouse position may have a sub-pixel offset from the requested one.
        assertEqual(eventDisplay, 'mouseMove');
        assertApproxEqual(parseFloat(xDisplay ?? ''), 20, 1);
        assertApproxEqual(parseFloat(yDisplay ?? ''), 15, 1);
      });

      test('Mousedown on somewhere in the target should display the correct coordinates', async () => {
        await engine().parts.target.mouseMove({
          position: {
            x: 20,
            y: 15,
          },
        });
        await engine().parts.target.mouseDown({
          position: {
            x: 12,
            y: 16,
          },
        });
        const eventDisplay = await engine().parts.eventDisplay.getText();
        const xDisplay = await engine().parts.xDisplay.getText();
        const yDisplay = await engine().parts.yDisplay.getText();

        // Tolerance-based comparison for cross-browser compatibility: the
        // reported mouse position may have a sub-pixel offset from the requested one.
        assertEqual(eventDisplay, 'mouseDown');
        assertApproxEqual(parseFloat(xDisplay ?? ''), 12, 1);
        assertApproxEqual(parseFloat(yDisplay ?? ''), 16, 1);
      });

      test('MouseUp on somewhere in the target should display the correct coordinates', async () => {
        await engine().parts.target.mouseMove({
          position: {
            x: 20,
            y: 15,
          },
        });
        await engine().parts.target.mouseDown({
          position: {
            x: 12,
            y: 16,
          },
        });
        await engine().parts.target.mouseUp({
          position: {
            x: 11,
            y: 15,
          },
        });
        const eventDisplay = await engine().parts.eventDisplay.getText();
        const xDisplay = await engine().parts.xDisplay.getText();
        const yDisplay = await engine().parts.yDisplay.getText();

        // Tolerance-based comparison for cross-browser compatibility: the
        // reported mouse position may have a sub-pixel offset from the requested one.
        assertEqual(eventDisplay, 'mouseUp');
        assertApproxEqual(parseFloat(xDisplay ?? ''), 11, 1);
        assertApproxEqual(parseFloat(yDisplay ?? ''), 15, 1);
      });
    });
  },
};
