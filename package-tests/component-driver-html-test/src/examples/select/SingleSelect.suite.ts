import { JSX } from 'react';

import { HTMLSelectDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { singleSelectUIExample } from './SingleSelect.examples';

export const singleSelectExampleScenePart = {
  select: {
    locator: byName('single-select'),
    driver: HTMLSelectDriver,
  },
} satisfies ScenePart;

export const singleSelectExample: IExampleUnit<typeof singleSelectExampleScenePart, JSX.Element> = {
  ...singleSelectUIExample,
  scene: singleSelectExampleScenePart,
};

export const singleSelectTestSuite: TestSuiteInfo<typeof singleSelectExample.scene> = {
  title: 'Single Select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${singleSelectExample.title}`, () => {
      const engine = useTestEngine(singleSelectExample.scene, getTestEngine, { beforeEach, afterEach });

      test('Single Select', async () => {
        const targetValue = '3';
        await engine().parts.select.setValue(targetValue);
        const val = await engine().parts.select.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
