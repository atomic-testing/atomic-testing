import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ChipDriver } from '@atomic-testing/component-driver-mui-v6';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { clickableChipUIExample } from './ClickableChip.examples';

export const clickableChipExampleScenePart = {
  jackChip: {
    locator: byDataTestId('clickable-Jack'),
    driver: ChipDriver,
  },
  lucyChip: {
    locator: byDataTestId('clickable-Lucy'),
    driver: ChipDriver,
  },
  mariaChip: {
    locator: byDataTestId('clickable-Maria'),
    driver: ChipDriver,
  },
  selectedDisplay: {
    locator: byDataTestId('selected'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const clickableChipExample: IExampleUnit<typeof clickableChipExampleScenePart, JSX.Element> = {
  ...clickableChipUIExample,
  scene: clickableChipExampleScenePart,
};

export const clickableChipTestSuite: TestSuiteInfo<typeof clickableChipExample.scene> = {
  title: 'Clickable Chip',
  url: '/chip',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof clickableChipExample.scene>;
    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(clickableChipExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Selected display should be empty initially', async () => {
      const text = await testEngine.parts.selectedDisplay.getText();
      assertEqual(text, '');
    });

    test('Clicking Jack chip should select Jack', async () => {
      await testEngine.parts.jackChip.click();
      const text = await testEngine.parts.selectedDisplay.getText();
      assertEqual(text, 'Jack');
    });

    test('Clicking Lucy chip should select Lucy', async () => {
      await testEngine.parts.lucyChip.click();
      const text = await testEngine.parts.selectedDisplay.getText();
      assertEqual(text, 'Lucy');
    });
  },
};
