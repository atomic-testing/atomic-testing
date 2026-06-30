import { DateInputDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { dateInputUIExample } from './DateInput.examples';

export const dateInputExampleScenePart = {
  birthday: {
    locator: byDataTestId('birthday'),
    driver: DateInputDriver,
  },
  deadline: {
    locator: byDataTestId('deadline'),
    driver: DateInputDriver,
  },
} satisfies ScenePart;

export const dateInputExample: IExampleUnit<typeof dateInputExampleScenePart, JSX.Element> = {
  ...dateInputUIExample,
  scene: dateInputExampleScenePart,
};

export const dateInputExampleTestSuite: TestSuiteInfo<typeof dateInputExample.scene> = {
  title: 'Astryx DateInput',
  url: '/date-input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${dateInputExample.title}`, () => {
      const engine = useTestEngine(dateInputExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // getValue reads the display string; empty inputs read undefined.
      test(`reads the displayed value`, async () => {
        assertEqual(await engine().parts.birthday.getValue(), 'January 15, 2024');
        assertEqual(await engine().parts.deadline.getValue(), undefined);
        assertFalse(await engine().parts.birthday.isExpanded());
        assertFalse(await engine().parts.birthday.isInvalid());
      });

      // setValue types a date into the field. (typing may open the native popover → not WebKit)
      test(`setValue types into the field`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.deadline.setValue('March 3, 2024');
        assertEqual(await engine().parts.deadline.getValue(), 'March 3, 2024');
      });

      // Opening the calendar and picking a day updates the value. (native-popover → not WebKit)
      test(`open and pickDate select a day`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.birthday.open();
        assertTrue(await engine().parts.birthday.isExpanded());
        assertTrue(await engine().parts.birthday.pickDate('2024-01-20'));
        assertEqual(await engine().parts.birthday.getValue(), 'January 20, 2024');
      });

      // The clear control empties the value.
      test(`clear empties the value`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertTrue(await engine().parts.birthday.clear());
        assertEqual(await engine().parts.birthday.getValue(), undefined);
        assertFalse(await engine().parts.deadline.clear());
      });
    });
  },
};
