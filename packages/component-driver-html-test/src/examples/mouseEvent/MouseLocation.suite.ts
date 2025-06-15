import { JSX } from 'react';

import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

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
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${mouseLocationMouseEventExample.title}`, () => {
      let testEngine: TestEngine<typeof mouseLocationMouseEventExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(mouseLocationMouseEventExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Mousemove on somewhere in the target should display the correct coordinates', async () => {
        await testEngine.parts.target.mouseMove({
          position: {
            x: 20,
            y: 15,
          },
        });
        const eventDisplay = await testEngine.parts.eventDisplay.getText();
        const xDisplay = await testEngine.parts.xDisplay.getText();
        const yDisplay = await testEngine.parts.yDisplay.getText();

        // The coordinates are rounded because e2e tests are not pixel perfect
        assertEqual(eventDisplay, 'mouseMove');
        assertEqual(Math.round(parseFloat(xDisplay ?? '')), 20);
        assertEqual(Math.round(parseFloat(yDisplay ?? '')), 15);
      });

      test('Mousedown on somewhere in the target should display the correct coordinates', async () => {
        await testEngine.parts.target.mouseMove({
          position: {
            x: 20,
            y: 15,
          },
        });
        await testEngine.parts.target.mouseDown({
          position: {
            x: 12,
            y: 16,
          },
        });
        const eventDisplay = await testEngine.parts.eventDisplay.getText();
        const xDisplay = await testEngine.parts.xDisplay.getText();
        const yDisplay = await testEngine.parts.yDisplay.getText();

        // The coordinates are rounded because e2e tests are not pixel perfect
        assertEqual(eventDisplay, 'mouseDown');
        assertEqual(Math.round(parseFloat(xDisplay ?? '')), 12);
        assertEqual(Math.round(parseFloat(yDisplay ?? '')), 16);
      });

      test('MouseUp on somewhere in the target should display the correct coordinates', async () => {
        await testEngine.parts.target.mouseMove({
          position: {
            x: 20,
            y: 15,
          },
        });
        await testEngine.parts.target.mouseDown({
          position: {
            x: 12,
            y: 16,
          },
        });
        await testEngine.parts.target.mouseUp({
          position: {
            x: 11,
            y: 15,
          },
        });
        const eventDisplay = await testEngine.parts.eventDisplay.getText();
        const xDisplay = await testEngine.parts.xDisplay.getText();
        const yDisplay = await testEngine.parts.yDisplay.getText();

        // The coordinates are rounded because e2e tests are not pixel perfect
        assertEqual(eventDisplay, 'mouseUp');
        assertEqual(Math.round(parseFloat(xDisplay ?? '')), 11);
        assertEqual(Math.round(parseFloat(yDisplay ?? '')), 15);
      });
    });
  },
};
