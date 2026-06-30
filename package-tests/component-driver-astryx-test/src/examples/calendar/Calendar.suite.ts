import { CalendarDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { calendarUIExample } from './Calendar.examples';

export const calendarExampleScenePart = {
  single: {
    locator: byDataTestId('single-cal'),
    driver: CalendarDriver,
  },
  range: {
    locator: byDataTestId('range-cal'),
    driver: CalendarDriver,
  },
} satisfies ScenePart;

export const calendarExample: IExampleUnit<typeof calendarExampleScenePart, JSX.Element> = {
  ...calendarUIExample,
  scene: calendarExampleScenePart,
};

export const calendarExampleTestSuite: TestSuiteInfo<typeof calendarExample.scene> = {
  title: 'Astryx Calendar',
  url: '/calendar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${calendarExample.title}`, () => {
      const engine = useTestEngine(calendarExample.scene, getTestEngine, { beforeEach, afterEach });

      // getMode and getVisibleMonthLabel read the calendar chrome.
      test(`reads mode and visible month`, async () => {
        assertEqual(await engine().parts.single.getMode(), 'single');
        assertEqual(await engine().parts.range.getMode(), 'range');
        assertEqual(await engine().parts.single.getVisibleMonthLabel(), 'January 2024');
        assertTrue((await engine().parts.single.getDayCount()) >= 28);
      });

      // The selected day is read from aria-selected via its data-date.
      test(`reads the selected day`, async () => {
        assertTrue(await engine().parts.single.isDaySelected('2024-01-15'));
        assertFalse(await engine().parts.single.isDaySelected('2024-01-16'));
      });

      // selectDay changes the single selection; an off-screen date returns false.
      test(`selectDay changes the selection`, async () => {
        assertFalse(await engine().parts.single.selectDay('2030-06-01'));
        assertTrue(await engine().parts.single.selectDay('2024-01-20'));
        assertTrue(await engine().parts.single.isDaySelected('2024-01-20'));
      });

      // Range mode marks both endpoints selected.
      test(`range mode selects endpoints`, async () => {
        const dates = await engine().parts.range.getSelectedDates();
        assertTrue(dates.includes('2024-01-10'));
        assertTrue(dates.includes('2024-01-20'));
      });

      // Month navigation updates the visible month.
      test(`nextMonth and previousMonth navigate`, async () => {
        await engine().parts.single.nextMonth();
        assertEqual(await engine().parts.single.getVisibleMonthLabel(), 'February 2024');
        await engine().parts.single.previousMonth();
        assertEqual(await engine().parts.single.getVisibleMonthLabel(), 'January 2024');
      });
    });
  },
};
