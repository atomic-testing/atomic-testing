import { JSX } from 'react';
import { ButtonDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { iconAndLabelButtonUIExample } from './IconAndLabelButton.example';

export const iconAndLabelExampleScenePart = {
  iconButton: {
    locator: byDataTestId('icon-button'),
    driver: ButtonDriver,
  },
  iconLabelButton: {
    locator: byDataTestId('icon-label-button'),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

export const iconAndLabelExample: IExampleUnit<typeof iconAndLabelExampleScenePart, JSX.Element> = {
  ...iconAndLabelButtonUIExample,
  scene: iconAndLabelExampleScenePart,
};

export const iconAndLabelButtonTestSuite: TestSuiteInfo<typeof iconAndLabelExample.scene> = {
  title: 'Icon & Label',
  url: '/button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertTrue }) => {
    describe(`${iconAndLabelExample.title}`, () => {
      const engine = useTestEngine(iconAndLabelExample.scene, getTestEngine, { beforeEach, afterEach });

      test('Icon button should exist and be clickable', async () => {
        const exists = await engine().parts.iconButton.exists();
        assertTrue(exists);
        await engine().parts.iconButton.click();
      });

      test('Icon-label button should exist and be clickable', async () => {
        const exists = await engine().parts.iconLabelButton.exists();
        assertTrue(exists);
        await engine().parts.iconLabelButton.click();
      });
    });
  },
};
