import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

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
      const engine = useTestEngine(mouseOverMouseEventExample.scene, getTestEngine, { beforeEach, afterEach });

      test('MouseOver', async () => {
        await engine().interactor.mouseOver(engine().parts.target.locator);
        const text = await engine().parts.mouseOverDisplay.getText();
        assertEqual(text, 'true');
      });

      test('MouseOut', async () => {
        await engine().interactor.mouseOut(engine().parts.target.locator);
        const text = await engine().parts.mouseOutDisplay.getText();
        assertEqual(text, 'true');
      });

      test('MouseEnter', async () => {
        await engine().interactor.mouseEnter(engine().parts.target.locator);
        const text = await engine().parts.mouseEnterDisplay.getText();
        assertEqual(text, 'true');
      });

      test('MouseLeave', async () => {
        await engine().interactor.mouseLeave(engine().parts.target.locator);
        const text = await engine().parts.mouseLeaveDisplay.getText();
        assertEqual(text, 'true');
      });
    });
  },
};
