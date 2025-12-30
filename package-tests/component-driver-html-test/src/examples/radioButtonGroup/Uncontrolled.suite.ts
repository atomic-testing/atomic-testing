import { JSX } from 'react';

import { HTMLRadioButtonGroupDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { uncontrolledRadioButtonGroupUIExample } from './Uncontrolled.examples';

export const uncontrolledRadioButtonGroupExampleScenePart = {
  input: {
    locator: byName('uncontrolled-group'),
    driver: HTMLRadioButtonGroupDriver,
  },
} satisfies ScenePart;

export const uncontrolledRadioButtonGroupExample: IExampleUnit<
  typeof uncontrolledRadioButtonGroupExampleScenePart,
  JSX.Element
> = {
  ...uncontrolledRadioButtonGroupUIExample,
  scene: uncontrolledRadioButtonGroupExampleScenePart,
};

export const uncontrolledRadioButtonGroupTestSuite: TestSuiteInfo<typeof uncontrolledRadioButtonGroupExample.scene> = {
  title: 'Radio Button Group',
  url: '/radio-buttons',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${uncontrolledRadioButtonGroupExample.title}`, () => {
      const engine = useTestEngine(uncontrolledRadioButtonGroupExample.scene, getTestEngine, { beforeEach, afterEach });

      test('should be able to select a radio button', async () => {
        const targetValue = '3';
        await engine().parts.input.setValue(targetValue);
        const val = await engine().parts.input.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
