import { ChipDriver } from '@atomic-testing/component-driver-mui-v6';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
    let testEngine: TestEngine<typeof deletableChipExample.scene>;

    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(deletableChipExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('All chips should exist initially', async () => {
      const jackExists = await testEngine.parts.jackChip.exists();
      const lucyExists = await testEngine.parts.lucyChip.exists();
      const mariaExists = await testEngine.parts.mariaChip.exists();
      assertTrue(jackExists);
      assertTrue(lucyExists);
      assertTrue(mariaExists);
    });

    test('Deleting Jack chip should remove it', async () => {
      await testEngine.parts.jackChip.clickRemove();
      const jackExists = await testEngine.parts.jackChip.exists();
      assertFalse(jackExists);
    });
  },
};
