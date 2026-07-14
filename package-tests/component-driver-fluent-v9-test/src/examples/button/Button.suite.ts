import { ButtonDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { buttonUIExample } from './Button.examples';

export const buttonExampleScenePart = {
  one: { locator: byDataTestId('button-one'), driver: ButtonDriver },
  two: { locator: byDataTestId('button-two'), driver: ButtonDriver },
  disabled: { locator: byDataTestId('button-disabled'), driver: ButtonDriver },
} satisfies ScenePart;

export const buttonExample: IExampleUnit<typeof buttonExampleScenePart, JSX.Element> = {
  ...buttonUIExample,
  scene: buttonExampleScenePart,
};

export const buttonExampleTestSuite: TestSuiteInfo<typeof buttonExample.scene> = {
  title: 'Fluent Button',
  url: '/button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${buttonExample.title}`, () => {
      const engine = useTestEngine(buttonExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its own text per instance', async () => {
        assertEqual(await engine().parts.one.getText(), 'One');
        assertEqual(await engine().parts.two.getText(), 'Two');
      });

      test('reads disabled state per instance', async () => {
        assertFalse(await engine().parts.one.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });

      test('is clickable', async () => {
        await engine().parts.one.click();
      });
    });
  },
};
