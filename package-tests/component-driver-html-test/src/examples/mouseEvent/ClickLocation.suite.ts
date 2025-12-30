import { JSX } from 'react';

import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${clickLocationMouseEventExample.title}`, () => {
      let testEngine: TestEngine<typeof clickLocationMouseEventExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(clickLocationMouseEventExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Click on somewhere in the target should display the correct coordinates', async () => {
        await testEngine.parts.target.click({
          position: {
            x: 20,
            y: 15,
          },
        });
        const xDisplay = await testEngine.parts.xDisplay.getText();
        const yDisplay = await testEngine.parts.yDisplay.getText();

        // The coordinates are compared with tolerance because e2e tests are not pixel perfect
        // Playwright's click position may have sub-pixel offset from the requested position
        const tolerance = 1;
        const xActual = parseFloat(xDisplay ?? '');
        const yActual = parseFloat(yDisplay ?? '');

        assertEqual(Math.abs(xActual - 20) < tolerance, true);
        assertEqual(Math.abs(yActual - 15) < tolerance, true);
      });
    });
  },
};
