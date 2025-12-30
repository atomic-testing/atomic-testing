import { JSX } from 'react';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ChipDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
    const engine = useTestEngine(clickableChipExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Selected display should be empty initially', async () => {
      const text = await engine().parts.selectedDisplay.getText();
      assertEqual(text, '');
    });

    test('Clicking Jack chip should select Jack', async () => {
      await engine().parts.jackChip.click();
      const text = await engine().parts.selectedDisplay.getText();
      assertEqual(text, 'Jack');
    });

    test('Clicking Lucy chip should select Lucy', async () => {
      await engine().parts.lucyChip.click();
      const text = await engine().parts.selectedDisplay.getText();
      assertEqual(text, 'Lucy');
    });
  },
};
