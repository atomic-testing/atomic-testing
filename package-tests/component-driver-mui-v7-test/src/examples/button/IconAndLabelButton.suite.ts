import { ButtonDriver } from '@atomic-testing/component-driver-mui-v7';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
      let testEngine: TestEngine<typeof iconAndLabelExample.scene>;
      beforeEach(function ({ page }: TestFixture) {
        testEngine = getTestEngine(iconAndLabelExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          (arguments[0] as () => void)();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Icon button should exist and be clickable', async () => {
        const exists = await testEngine.parts.iconButton.exists();
        assertTrue(exists);
        await testEngine.parts.iconButton.click();
      });

      test('Icon-label button should exist and be clickable', async () => {
        const exists = await testEngine.parts.iconLabelButton.exists();
        assertTrue(exists);
        await testEngine.parts.iconLabelButton.click();
      });
    });
  },
};
