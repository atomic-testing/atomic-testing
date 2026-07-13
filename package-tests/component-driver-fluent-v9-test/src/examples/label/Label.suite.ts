import { LabelDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { labelUIExample } from './Label.examples';

export const labelExampleScenePart = {
  linked: { locator: byDataTestId('label-linked'), driver: LabelDriver },
  unlinked: { locator: byDataTestId('label-unlinked'), driver: LabelDriver },
} satisfies ScenePart;

export const labelExample: IExampleUnit<typeof labelExampleScenePart, JSX.Element> = {
  ...labelUIExample,
  scene: labelExampleScenePart,
};

export const labelExampleTestSuite: TestSuiteInfo<typeof labelExample.scene> = {
  title: 'Fluent Label',
  url: '/label',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${labelExample.title}`, () => {
      const engine = useTestEngine(labelExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its own text and for-target per instance', async () => {
        assertEqual(await engine().parts.linked.getText(), 'Linked label');
        assertEqual(await engine().parts.linked.getFor(), 'some-control');
        assertEqual(await engine().parts.unlinked.getText(), 'Unlinked label');
      });

      test('has no for-target when unlinked', async () => {
        assertEqual(await engine().parts.unlinked.getFor(), undefined);
      });
    });
  },
};
