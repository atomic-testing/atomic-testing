import { DateRangeInputDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { dateRangeInputUIExample } from './DateRangeInput.examples';

export const dateRangeInputExampleScenePart = {
  report: {
    locator: byDataTestId('report'),
    driver: DateRangeInputDriver,
  },
  budget: {
    locator: byDataTestId('budget'),
    driver: DateRangeInputDriver,
  },
} satisfies ScenePart;

export const dateRangeInputExample: IExampleUnit<typeof dateRangeInputExampleScenePart, JSX.Element> = {
  ...dateRangeInputUIExample,
  scene: dateRangeInputExampleScenePart,
};

// The popover calendar opens on the current month with no value, so days are
// addressed relative to "today" — the 10th and 20th of the current month are
// always rendered, keeping the range pick stable across run dates.
const monthPrefix = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const dateRangeInputExampleTestSuite: TestSuiteInfo<typeof dateRangeInputExample.scene> = {
  title: 'Astryx DateRangeInput',
  url: '/date-range-input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${dateRangeInputExample.title}`, () => {
      const engine = useTestEngine(dateRangeInputExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // getDisplayText reads the trigger text without opening; the two inputs stay independent.
      test(`reads the placeholder display text`, async () => {
        assertEqual(await engine().parts.report.getDisplayText(), 'Select date range');
        assertEqual(await engine().parts.budget.getDisplayText(), 'Select date range');
        assertFalse(await engine().parts.report.isExpanded());
      });

      // getPresetLabels lists the popover presets. (native-popover → not WebKit)
      test(`lists the presets`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertEqual(await engine().parts.report.getPresetLabels(), ['Last 7 days', 'Last 30 days']);
      });

      // selectPreset applies a preset and marks it selected; unknown labels return false.
      test(`selectPreset applies a preset`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertFalse(await engine().parts.report.selectPreset('Nope'));
        assertTrue(await engine().parts.report.selectPreset('Last 7 days'));
        assertEqual(await engine().parts.report.getSelectedPreset(), 'Last 7 days');
      });

      // pickRange selects a start and end day from the current month.
      test(`pickRange selects two days`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        const ym = monthPrefix();
        assertTrue(await engine().parts.report.pickRange(`${ym}-10`, `${ym}-20`));
      });

      // clear resets the range after a preset is applied.
      test(`clear resets the range`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.report.selectPreset('Last 7 days');
        assertTrue(await engine().parts.report.clear());
        assertEqual(await engine().parts.report.getDisplayText(), 'Select date range');
      });
    });
  },
};
