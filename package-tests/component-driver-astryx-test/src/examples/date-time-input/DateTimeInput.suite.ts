import { DateTimeInputDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { dateTimeInputUIExample } from './DateTimeInput.examples';

export const dateTimeInputExampleScenePart = {
  meeting: {
    locator: byDataTestId('meeting'),
    driver: DateTimeInputDriver,
  },
  reminder: {
    locator: byDataTestId('reminder'),
    driver: DateTimeInputDriver,
  },
  locked: {
    locator: byDataTestId('locked'),
    driver: DateTimeInputDriver,
  },
} satisfies ScenePart;

export const dateTimeInputExample: IExampleUnit<typeof dateTimeInputExampleScenePart, JSX.Element> = {
  ...dateTimeInputUIExample,
  scene: dateTimeInputExampleScenePart,
};

export const dateTimeInputExampleTestSuite: TestSuiteInfo<typeof dateTimeInputExample.scene> = {
  title: 'Astryx DateTimeInput',
  url: '/date-time-input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    describe(`${dateTimeInputExample.title}`, () => {
      const engine = useTestEngine(dateTimeInputExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // The date and time fields read independently.
      test(`reads the date and time values`, async () => {
        assertEqual(await engine().parts.meeting.getDateValue(), 'January 15, 2024');
        assertEqual(await engine().parts.meeting.getTimeValue(), '10:30 AM');
        assertEqual(await engine().parts.reminder.getDateValue(), undefined);
      });

      // setTime types into the time field. (the date field can open a native popover → not WebKit)
      test(`setTime types into the time field`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.meeting.setTime('11:45 AM');
        assertEqual(await engine().parts.meeting.getTimeValue(), '11:45 AM');
      });

      // setDate types into the date field and can open/pick from the calendar.
      test(`setDate and pickDate update the date field`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.reminder.setDate('March 3, 2024');
        assertEqual(await engine().parts.reminder.getDateValue(), 'March 3, 2024');
        await engine().parts.meeting.open();
        assertTrue(await engine().parts.meeting.isExpanded());
      });

      // getDisabledMessage resolves the disabled-reason tooltip through the date
      // field's composed aria-describedby (the time field carries no such link);
      // undefined when not in that state.
      test(`getDisabledMessage returns the disabled-reason tooltip text`, async () => {
        assertEqual(await engine().parts.locked.getDisabledMessage(), 'You need the Editor role to change this');
        assertEqual(await engine().parts.reminder.getDisabledMessage(), undefined);
      });
    });
  },
};
