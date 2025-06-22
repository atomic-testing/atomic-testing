import { ChipDriver } from '@atomic-testing/component-driver-mui-v5';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { basicChipUIExample } from './BasicChip.examples';

export const basicChipExampleScenePart = {
  basicChip: {
    locator: byDataTestId('basic-chip'),
    driver: ChipDriver,
  },
} satisfies ScenePart;

export const basicChipExample: IExampleUnit<typeof basicChipExampleScenePart, JSX.Element> = {
  ...basicChipUIExample,
  scene: basicChipExampleScenePart,
};

export const basicChipTestSuite: TestSuiteInfo<typeof basicChipExample.scene> = {
  title: 'Basic Chip',
  url: '/chip',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicChipExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicChipExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Basic chip should have correct label', async () => {
      const label = await testEngine.parts.basicChip.getLabel();
      assertEqual(label, 'Chirpy');
    });
  },
};
