import { SeparatorDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { separatorUIExample } from './Separator.examples';

export const separatorExampleScenePart = {
  horizontal: {
    locator: byDataTestId('separator-horizontal'),
    driver: SeparatorDriver,
  },
  vertical: {
    locator: byDataTestId('separator-vertical'),
    driver: SeparatorDriver,
  },
  decorative: {
    locator: byDataTestId('separator-decorative'),
    driver: SeparatorDriver,
  },
} satisfies ScenePart;

export const separatorExample: IExampleUnit<typeof separatorExampleScenePart, JSX.Element> = {
  ...separatorUIExample,
  scene: separatorExampleScenePart,
};

export const separatorExampleTestSuite: TestSuiteInfo<typeof separatorExample.scene> = {
  title: 'Radix Separator',
  url: '/separator',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${separatorExample.title}`, () => {
      const engine = useTestEngine(separatorExample.scene, getTestEngine, { beforeEach, afterEach });

      // getOrientation reads Radix's always-present data-orientation state attribute.
      test(`reads orientation per instance`, async () => {
        assertEqual(await engine().parts.horizontal.getOrientation(), 'horizontal');
        assertEqual(await engine().parts.vertical.getOrientation(), 'vertical');
      });

      // A decorative separator downgrades role="separator" to role="none".
      test(`distinguishes semantic from decorative`, async () => {
        assertFalse(await engine().parts.horizontal.isDecorative());
        assertFalse(await engine().parts.vertical.isDecorative());
        assertTrue(await engine().parts.decorative.isDecorative());
      });
    });
  },
};
