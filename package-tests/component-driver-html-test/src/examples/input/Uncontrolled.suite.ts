import { JSX } from 'react';

import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { uncontrolledTextInputUIExample } from './Uncontrolled.examples';

export const uncontrolledTextInputExampleScenePart = {
  text: {
    locator: byDataTestId('uncontrolled-text-input'),
    driver: HTMLTextInputDriver,
  },
  number: {
    locator: byDataTestId('uncontrolled-number-input'),
    driver: HTMLTextInputDriver,
  },
  date: {
    locator: byDataTestId('uncontrolled-date-input'),
    driver: HTMLTextInputDriver,
  },
  dateTime: {
    locator: byDataTestId('uncontrolled-datetime-local-input'),
    driver: HTMLTextInputDriver,
  },
  time: {
    locator: byDataTestId('uncontrolled-time-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export const uncontrolledTextInputExample: IExampleUnit<typeof uncontrolledTextInputExampleScenePart, JSX.Element> = {
  ...uncontrolledTextInputUIExample,
  scene: uncontrolledTextInputExampleScenePart,
};

export const uncontrolledTextInputExampleTestSuite: TestSuiteInfo<typeof uncontrolledTextInputExample.scene> = {
  title: 'ControlledTextInput',
  url: '/input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${uncontrolledTextInputExample.title}`, () => {
      const engine = useTestEngine(uncontrolledTextInputExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`set text value`, async () => {
        const targetValue = 'abc';
        await engine().parts.text.setValue(targetValue);
        const val = await engine().parts.text.getValue();
        assertEqual(val, targetValue);
      });

      test(`set number value`, async () => {
        const targetValue = '125';
        await engine().parts.number.setValue(targetValue);
        const val = await engine().parts.number.getValue();
        assertEqual(val, targetValue);
      });

      test(`set date value`, async () => {
        const targetValue = '2002-02-02';
        await engine().parts.date.setValue(targetValue);
        const val = await engine().parts.date.getValue();
        assertEqual(val, targetValue);
      });

      test(`set time value`, async () => {
        const targetValue = '13:58';
        await engine().parts.time.setValue(targetValue);
        const val = await engine().parts.time.getValue();
        assertEqual(val, targetValue);
      });

      test(`set date time value`, async () => {
        const targetValue = '2002-02-02T13:58';
        await engine().parts.dateTime.setValue(targetValue);
        const val = await engine().parts.dateTime.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
