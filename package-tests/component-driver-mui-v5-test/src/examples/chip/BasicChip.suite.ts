import { ChipDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
    const engine = useTestEngine(basicChipExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Basic chip should have correct label', async () => {
      const label = await engine().parts.basicChip.getLabel();
      assertEqual(label, 'Chirpy');
    });
  },
};
