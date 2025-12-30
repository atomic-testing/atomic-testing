import { JSX } from 'react';

import { HTMLSelectDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
      let testEngine: TestEngine<typeof multipleSelectExample.scene>;

      beforeEach(function ({ page }: TestFixture) {
        testEngine = getTestEngine(multipleSelectExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          (arguments[0] as () => void)();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Multiple Select', async () => {
        const targetValue = ['3', '5'];
        await testEngine.parts.select.setValue(targetValue);
        const val = await testEngine.parts.select.getValue();
        assertEqual(val, targetValue);
      });

      describe('Select by label', () => {
        beforeEach(async () => {
          await testEngine.parts.select.selectByLabel(['One', 'Three']);
        });

        test('Selected labels should reflect the selection', async () => {
          const val = await testEngine.parts.select.getSelectedLabel(true);
          assertEqual(val, ['One', 'Three']);
        });

        test('Selected values should reflect the selection', async () => {
          const val = await testEngine.parts.select.getValue();
          assertEqual(val, ['1', '3']);
        });
      });
    });
  },
};
