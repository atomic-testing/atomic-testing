import { FieldDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { fieldUIExample } from './Field.examples';

export const fieldExampleScenePart = {
  full: { locator: byDataTestId('field-full'), driver: FieldDriver },
  bare: { locator: byDataTestId('field-bare'), driver: FieldDriver },
} satisfies ScenePart;

export const fieldExample: IExampleUnit<typeof fieldExampleScenePart, JSX.Element> = {
  ...fieldUIExample,
  scene: fieldExampleScenePart,
};

export const fieldExampleTestSuite: TestSuiteInfo<typeof fieldExample.scene> = {
  title: 'Fluent Field',
  url: '/field',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${fieldExample.title}`, () => {
      const engine = useTestEngine(fieldExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads label, hint and validation message when present', async () => {
        assertEqual(await engine().parts.full.getLabel(), 'Full field');
        assertEqual(await engine().parts.full.getHint(), 'A helpful hint');
        assertEqual(await engine().parts.full.getValidationMessage(), 'An error');
      });

      test('has no hint or validation message when absent', async () => {
        assertEqual(await engine().parts.bare.getLabel(), 'Bare field');
        assertEqual(await engine().parts.bare.getHint(), undefined);
        assertEqual(await engine().parts.bare.getValidationMessage(), undefined);
      });
    });
  },
};
