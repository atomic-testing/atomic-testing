import { ProgressBarDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { progressBarUIExample } from './ProgressBar.examples';

export const progressBarExampleScenePart = {
  determinate: {
    locator: byDataTestId('progress-determinate'),
    driver: ProgressBarDriver,
  },
  indeterminate: {
    locator: byDataTestId('progress-indeterminate'),
    driver: ProgressBarDriver,
  },
} satisfies ScenePart;

export const progressBarExample: IExampleUnit<typeof progressBarExampleScenePart, JSX.Element> = {
  ...progressBarUIExample,
  scene: progressBarExampleScenePart,
};

export const progressBarExampleTestSuite: TestSuiteInfo<typeof progressBarExample.scene> = {
  title: 'Astryx ProgressBar',
  url: '/progress-bar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${progressBarExample.title}`, () => {
      const engine = useTestEngine(progressBarExample.scene, getTestEngine, { beforeEach, afterEach });

      // A determinate bar exposes aria-value* off its role="meter" track.
      test(`reads the determinate value range`, async () => {
        assertEqual(await engine().parts.determinate.getValueNow(), '75');
        assertEqual(await engine().parts.determinate.getValueMin(), '0');
        assertEqual(await engine().parts.determinate.getValueMax(), '100');
        assertEqual(await engine().parts.determinate.getValueText(), '75%');
        assertFalse(await engine().parts.determinate.isIndeterminate());
      });

      // The label and variant come from the header span and the root respectively.
      test(`reads the label and variant`, async () => {
        assertEqual(await engine().parts.determinate.getLabel(), 'Upload progress');
        assertEqual(await engine().parts.determinate.getVariant(), 'accent');
      });

      // An indeterminate bar uses role="progressbar" and emits no aria-value*.
      test(`indeterminate bar has no value and is flagged`, async () => {
        assertTrue(await engine().parts.indeterminate.isIndeterminate());
        assertEqual(await engine().parts.indeterminate.getValueNow(), undefined);
        assertEqual(await engine().parts.indeterminate.getValueText(), undefined);
        assertEqual(await engine().parts.indeterminate.getLabel(), 'Loading...');
      });
    });
  },
};
