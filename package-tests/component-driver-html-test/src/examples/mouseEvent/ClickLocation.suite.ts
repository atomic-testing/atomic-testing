import { JSX } from 'react';

import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
} satisfies ScenePart;

export const clickLocationMouseEventExample: IExampleUnit<typeof clickLocationMouseEventExampleScenePart, JSX.Element> =
  {
    ...clickLocationMouseEventUIExample,
    scene: clickLocationMouseEventExampleScenePart,
  };

export const clickLocationMouseEventExampleTestSuite: TestSuiteInfo<typeof clickLocationMouseEventExample.scene> = {
  title: 'Mouse event: Click',
  url: '/mouse-event',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertApproxEqual }) => {
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
    });
  },
};
