import { CompoundButtonDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { compoundButtonUIExample } from './CompoundButton.examples';

export const compoundButtonExampleScenePart = {
  withSecondary: { locator: byDataTestId('compound-button-with-secondary'), driver: CompoundButtonDriver },
  bare: { locator: byDataTestId('compound-button-bare'), driver: CompoundButtonDriver },
} satisfies ScenePart;

export const compoundButtonExample: IExampleUnit<typeof compoundButtonExampleScenePart, JSX.Element> = {
  ...compoundButtonUIExample,
  scene: compoundButtonExampleScenePart,
};

export const compoundButtonExampleTestSuite: TestSuiteInfo<typeof compoundButtonExample.scene> = {
  title: 'Fluent CompoundButton',
  url: '/compound-button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${compoundButtonExample.title}`, () => {
      const engine = useTestEngine(compoundButtonExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the secondary content when present', async () => {
        assertEqual(await engine().parts.withSecondary.getSecondaryContent(), 'Secondary text');
      });

      test('has no secondary content when absent', async () => {
        assertEqual(await engine().parts.bare.getSecondaryContent(), undefined);
      });
    });
  },
};
