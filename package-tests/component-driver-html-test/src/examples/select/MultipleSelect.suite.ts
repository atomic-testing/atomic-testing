import { JSX } from 'react';

import { HTMLSelectDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { multipleSelectUIExample } from './MultipleSelect.examples';

export const multipleSelectExampleScenePart = {
  select: {
    locator: byName('multiple-select'),
    driver: HTMLSelectDriver,
  },
} satisfies ScenePart;

export const multipleSelectExample: IExampleUnit<typeof multipleSelectExampleScenePart, JSX.Element> = {
  ...multipleSelectUIExample,
  scene: multipleSelectExampleScenePart,
};

export const multipleSelectTestSuite: TestSuiteInfo<typeof multipleSelectExample.scene> = {
  title: 'Single Select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${multipleSelectExample.title}`, () => {
      const engine = useTestEngine(multipleSelectExample.scene, getTestEngine, { beforeEach, afterEach });

      test('Multiple Select', async () => {
        const targetValue = ['3', '5'];
        await engine().parts.select.setValue(targetValue);
        const val = await engine().parts.select.getValue();
        assertEqual(val, targetValue);
      });

      describe('Select by label', () => {
        beforeEach(async () => {
          await engine().parts.select.selectByLabel(['One', 'Three']);
        });

        test('Selected labels should reflect the selection', async () => {
          const val = await engine().parts.select.getSelectedLabel(true);
          assertEqual(val, ['One', 'Three']);
        });

        test('Selected values should reflect the selection', async () => {
          const val = await engine().parts.select.getValue();
          assertEqual(val, ['1', '3']);
        });
      });
    });
  },
};
