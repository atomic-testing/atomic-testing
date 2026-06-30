import { HTMLElementDriver, HTMLRangeInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { rangeInputUIExample } from './RangeInput.examples';

export const rangeInputExampleScenePart = {
  primary: {
    locator: byDataTestId('range-primary'),
    driver: HTMLRangeInputDriver,
  },
  primaryValue: {
    locator: byDataTestId('range-primary-value'),
    driver: HTMLElementDriver,
  },
  secondary: {
    locator: byDataTestId('range-secondary'),
    driver: HTMLRangeInputDriver,
  },
  secondaryValue: {
    locator: byDataTestId('range-secondary-value'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const rangeInputExample: IExampleUnit<typeof rangeInputExampleScenePart, JSX.Element> = {
  ...rangeInputUIExample,
  scene: rangeInputExampleScenePart,
};

export const rangeInputExampleTestSuite: TestSuiteInfo<typeof rangeInputExample.scene> = {
  title: 'Range input: setRangeValue primitive',
  url: '/range-input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${rangeInputExample.title}`, () => {
      const engine = useTestEngine(rangeInputExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`Reads the initial value`, async () => {
        assertEqual(await engine().parts.primary.getValue(), 20);
      });

      test(`setValue updates the value and fires change`, async () => {
        await engine().parts.primary.setValue(40);
        assertEqual(await engine().parts.primary.getValue(), 40);
        // The echoed text confirms the controlled onChange ran, not just an attribute poke.
        assertEqual(await engine().parts.primaryValue.getText(), '40');
      });

      test(`setValue targets one slider without disturbing its sibling`, async () => {
        await engine().parts.primary.setValue(40);
        await engine().parts.secondary.setValue(70);
        assertEqual(await engine().parts.primary.getValue(), 40);
        assertEqual(await engine().parts.secondary.getValue(), 70);
      });
    });
  },
};
