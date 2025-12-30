import { ChipDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { deletableChipUIExample } from './DeletableChip.examples';

export const deletableChipExampleScenePart = {
  jackChip: {
    locator: byDataTestId('deletable-Jack'),
    driver: ChipDriver,
  },
  lucyChip: {
    locator: byDataTestId('deletable-Lucy'),
    driver: ChipDriver,
  },
  mariaChip: {
    locator: byDataTestId('deletable-Maria'),
    driver: ChipDriver,
  },
} satisfies ScenePart;

export const deletableChipExample: IExampleUnit<typeof deletableChipExampleScenePart, JSX.Element> = {
  ...deletableChipUIExample,
  scene: deletableChipExampleScenePart,
};

export const deletableChipTestSuite: TestSuiteInfo<typeof deletableChipExample.scene> = {
  title: 'Deletable Chip',
  url: '/chip',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    const engine = useTestEngine(deletableChipExample.scene, getTestEngine, { beforeEach, afterEach });

    test('All chips should exist initially', async () => {
      const jackExists = await engine().parts.jackChip.exists();
      const lucyExists = await engine().parts.lucyChip.exists();
      const mariaExists = await engine().parts.mariaChip.exists();
      assertTrue(jackExists);
      assertTrue(lucyExists);
      assertTrue(mariaExists);
    });

    test('Deleting Jack chip should remove it', async () => {
      await engine().parts.jackChip.clickRemove();
      const jackExists = await engine().parts.jackChip.exists();
      assertFalse(jackExists);
    });
  },
};
