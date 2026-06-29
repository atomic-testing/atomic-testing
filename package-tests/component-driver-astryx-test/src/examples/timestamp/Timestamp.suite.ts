import { TimestampDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byAttribute, byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { timestampUIExample } from './Timestamp.examples';

export const timestampExampleScenePart = {
  // The forwarded data-testid lands on the inner <time>, which the driver anchors on.
  date: {
    locator: byDataTestId('timestamp-date'),
    driver: TimestampDriver,
  },
  system: {
    locator: byDataTestId('timestamp-system'),
    driver: TimestampDriver,
  },
  // data-format lives on the OUTER wrapper span; a generic element driver reads it there.
  dateWrapper: {
    locator: byAttribute('data-format', 'date'),
    driver: HTMLElementDriver,
  },
  systemWrapper: {
    locator: byAttribute('data-format', 'system_date'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const timestampExample: IExampleUnit<typeof timestampExampleScenePart, JSX.Element> = {
  ...timestampUIExample,
  scene: timestampExampleScenePart,
};

export const timestampExampleTestSuite: TestSuiteInfo<typeof timestampExample.scene> = {
  title: 'Astryx Timestamp',
  url: '/timestamp',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${timestampExample.title}`, () => {
      const engine = useTestEngine(timestampExample.scene, getTestEngine, { beforeEach, afterEach });

      // getDateTime reads the machine-readable ISO 8601 datetime on <time>.
      test(`reads the ISO datetime`, async () => {
        assertEqual(await engine().parts.date.getDateTime(), '2026-02-19T17:00:00.000Z');
      });

      // The format is read from the parent wrapper's data-format, distinct per instance.
      test(`reads the format from the wrapper`, async () => {
        assertEqual(await engine().parts.dateWrapper.getAttribute('data-format'), 'date');
        assertEqual(await engine().parts.systemWrapper.getAttribute('data-format'), 'system_date');
      });

      // Both <time> instances share the same instant but are disambiguated by testid.
      test(`disambiguates two instances`, async () => {
        assertEqual(await engine().parts.system.getDateTime(), '2026-02-19T17:00:00.000Z');
      });
    });
  },
};
