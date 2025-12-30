import { JSX } from 'react';

import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { mouseOverMouseEventUIExample } from './MouseOver.examples';

export const mouseOverMouseEventExampleScenePart = {
  target: {
    locator: byDataTestId('mouse-over-target'),
    driver: HTMLButtonDriver,
  },
  mouseOverDisplay: {
    locator: byDataTestId('mouse-over'),
    driver: HTMLElementDriver,
  },
  mouseOutDisplay: {
    locator: byDataTestId('mouse-out'),
    driver: HTMLElementDriver,
  },
  mouseEnterDisplay: {
    locator: byDataTestId('mouse-enter'),
    driver: HTMLElementDriver,
  },
  mouseLeaveDisplay: {
    locator: byDataTestId('mouse-leave'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const mouseOverMouseEventExample: IExampleUnit<typeof mouseOverMouseEventExampleScenePart, JSX.Element> = {
  ...mouseOverMouseEventUIExample,
  scene: mouseOverMouseEventExampleScenePart,
};

export const mouseOverMouseEventExampleTestSuite: TestSuiteInfo<typeof mouseOverMouseEventExample.scene> = {
  title: 'Mouse event: Mouse over/out/enter/leave',
  url: '/mouse-event',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${mouseOverMouseEventExample.title}`, () => {
      let testEngine: TestEngine<typeof mouseOverMouseEventExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(mouseOverMouseEventExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('MouseOver', async () => {
        await testEngine.parts.target.mouseOver();
        const text = await testEngine.parts.mouseOverDisplay.getText();
        assertEqual(text, 'true');
      });

      test('MouseOut', async () => {
        await testEngine.parts.target.mouseOut();
        const text = await testEngine.parts.mouseOutDisplay.getText();
        assertEqual(text, 'true');
      });

      test('MouseEnter', async () => {
        await testEngine.parts.target.mouseEnter();
        const text = await testEngine.parts.mouseEnterDisplay.getText();
        assertEqual(text, 'true');
      });

      test('MouseLeave', async () => {
        await testEngine.parts.target.mouseLeave();
        const text = await testEngine.parts.mouseLeaveDisplay.getText();
        assertEqual(text, 'true');
      });
    });
  },
};
