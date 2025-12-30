import { CheckboxDriver } from '@atomic-testing/component-driver-mui-v5';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { indeterminateCheckboxUIExample } from './IndeterminateCheckbox.examples';

export const indeterminateCheckboxExampleScenePart = {
  parent: {
    locator: byDataTestId('parent'),
    driver: CheckboxDriver,
  },
  child1: {
    locator: byDataTestId('child1'),
    driver: CheckboxDriver,
  },
  child2: {
    locator: byDataTestId('child2'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

export const indeterminateCheckboxExample: IExampleUnit<typeof indeterminateCheckboxExampleScenePart, JSX.Element> = {
  ...indeterminateCheckboxUIExample,
  scene: indeterminateCheckboxExampleScenePart,
};

export const indeterminateCheckboxTestSuite: TestSuiteInfo<typeof indeterminateCheckboxExample.scene> = {
  title: 'Indeterminate Checkbox',
  url: '/checkbox',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    let testEngine: TestEngine<typeof indeterminateCheckboxExample.scene>;

    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(indeterminateCheckboxExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Child1 should be checked initially', async () => {
      const isSelected = await testEngine.parts.child1.isSelected();
      assertTrue(isSelected);
    });

    test('Child2 should not be checked initially', async () => {
      const isSelected = await testEngine.parts.child2.isSelected();
      assertFalse(isSelected);
    });

    test('Parent should be indeterminate initially', async () => {
      const isIndeterminate = await testEngine.parts.parent.isIndeterminate();
      assertTrue(isIndeterminate);
    });
  },
};
