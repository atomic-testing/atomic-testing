import { ChipDriver } from '@atomic-testing/component-driver-mui-v5';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof deletableChipExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(deletableChipExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('All chips should exist initially', async () => {
      const jackExists = await testEngine.parts.jackChip.exists();
      const lucyExists = await testEngine.parts.lucyChip.exists();
      const mariaExists = await testEngine.parts.mariaChip.exists();
      assertEqual(jackExists, true);
      assertEqual(lucyExists, true);
      assertEqual(mariaExists, true);
    });

    test('Deleting Jack chip should remove it', async () => {
      await testEngine.parts.jackChip.clickRemove();
      const jackExists = await testEngine.parts.jackChip.exists();
      assertEqual(jackExists, false);
    });
  },
};
