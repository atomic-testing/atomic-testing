import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { clickLocationMouseEventUIExample } from './ClickLocation.examples';

export const clickLocationMouseEventExampleScenePart = {
  target: {
    locator: byDataTestId('click-target'),
    driver: HTMLButtonDriver,
  },
  xDisplay: {
    locator: byDataTestId('position-x'),
    driver: HTMLElementDriver,
  },
  yDisplay: {
    locator: byDataTestId('position-y'),
    driver: HTMLElementDriver,
  },
  eventDisplay: {
    locator: byDataTestId('event-name'),
    driver: HTMLElementDriver,
  },
  clickCountDisplay: {
    locator: byDataTestId('click-count'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const clickLocationMouseEventExample: IExampleUnit<typeof clickLocationMouseEventExampleScenePart, JSX.Element> =
  {
    ...clickLocationMouseEventUIExample,
    scene: clickLocationMouseEventExampleScenePart,
  };

export const clickLocationMouseEventExampleTestSuite: TestSuiteInfo<typeof clickLocationMouseEventExample.scene> = {
  title: 'Mouse event: Click',
  url: '/mouse-event',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertApproxEqual, assertEqual, assertTrue }) => {
    describe(`${clickLocationMouseEventExample.title}`, () => {
      const engine = useTestEngine(clickLocationMouseEventExample.scene, getTestEngine, { beforeEach, afterEach });

      test('Click on somewhere in the target should display the correct coordinates', async () => {
        await engine().parts.target.click({
          position: {
            x: 20,
            y: 15,
          },
        });
        const xDisplay = await engine().parts.xDisplay.getText();
        const yDisplay = await engine().parts.yDisplay.getText();

        // Use tolerance-based comparison for cross-browser compatibility
        // Playwright's click position may have sub-pixel offset from the requested position
        const xActual = parseFloat(xDisplay ?? '');
        const yActual = parseFloat(yDisplay ?? '');

        assertApproxEqual(xActual, 20, 1);
        assertApproxEqual(yActual, 15, 1);
      });

      // clickCount: 2 dispatches a real double-click gesture, distinct from
      // calling click() twice (which does not reliably register as one).
      test('click({ clickCount: 2 }) dispatches a real double-click', async () => {
        await engine().parts.target.click({ clickCount: 2 });
        assertEqual(await engine().parts.eventDisplay.getText(), 'dblclick');
      });

      // The positioned path (`position` set) must still fire the two `click`
      // events before `dblclick` — a component relying on both `onClick` and
      // `onDoubleClick` would otherwise silently lose the click handling.
      test('click({ position, clickCount: 2 }) fires click twice before dblclick', async () => {
        await engine().parts.target.click({ position: { x: 10, y: 10 }, clickCount: 2 });
        assertEqual(await engine().parts.eventDisplay.getText(), 'dblclick');
        assertEqual(await engine().parts.clickCountDisplay.getText(), '2');
      });

      // clickCount values other than 2 are rejected consistently across
      // every Interactor implementation (see assertValidClickCount).
      test('click({ clickCount: 3 }) throws', async () => {
        let threw = false;
        try {
          await engine().parts.target.click({ clickCount: 3 });
        } catch {
          threw = true;
        }
        assertTrue(threw);
      });
    });
  },
};
