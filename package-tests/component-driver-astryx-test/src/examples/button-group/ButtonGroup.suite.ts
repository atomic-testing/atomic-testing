import { ButtonGroupDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { buttonGroupUIExample } from './ButtonGroup.examples';

export const buttonGroupExampleScenePart = {
  group: {
    locator: byDataTestId('text-actions'),
    driver: ButtonGroupDriver,
  },
  copyCount: {
    locator: byDataTestId('copy-count'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const buttonGroupExample: IExampleUnit<typeof buttonGroupExampleScenePart, JSX.Element> = {
  ...buttonGroupUIExample,
  scene: buttonGroupExampleScenePart,
};

export const buttonGroupExampleTestSuite: TestSuiteInfo<typeof buttonGroupExample.scene> = {
  title: 'Astryx ButtonGroup',
  url: '/button-group',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${buttonGroupExample.title}`, () => {
      const engine = useTestEngine(buttonGroupExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel reads the group's aria-label; getOrientation its aria-orientation.
      test(`getLabel and getOrientation read the group attributes`, async () => {
        assertEqual(await engine().parts.group.getLabel(), 'Text actions');
        assertEqual(await engine().parts.group.getOrientation(), 'horizontal');
      });

      // getButtonCount counts the child buttons.
      test(`getButtonCount counts the buttons`, async () => {
        assertEqual(await engine().parts.group.getButtonCount(), 3);
      });

      // clickButton finds a child by its visible text and clicks it.
      test(`clickButton clicks the named button`, async () => {
        assertTrue(await engine().parts.group.clickButton('Copy'));
        const count = await engine().parts.copyCount.waitUntil({
          probeFn: () => engine().parts.copyCount.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(count, '1');
      });

      // clickButton returns false for an unknown name.
      test(`clickButton returns false for an unknown button`, async () => {
        assertFalse(await engine().parts.group.clickButton('Nope'));
      });
    });
  },
};
