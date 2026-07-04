import { ToolbarDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toolbarUIExample } from './Toolbar.examples';

export const toolbarExampleScenePart = {
  toolbar: {
    locator: byDataTestId('toolbar-root'),
    driver: ToolbarDriver,
  },
} satisfies ScenePart;

export const toolbarExample: IExampleUnit<typeof toolbarExampleScenePart, JSX.Element> = {
  ...toolbarUIExample,
  scene: toolbarExampleScenePart,
};

export const toolbarExampleTestSuite: TestSuiteInfo<typeof toolbarExample.scene> = {
  title: 'Radix Toolbar',
  url: '/toolbar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${toolbarExample.title}`, () => {
      const engine = useTestEngine(toolbarExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the accessible label', async () => {
        assertEqual(await engine().parts.toolbar.getLabel(), 'Formatting options');
      });

      test('reads the orientation', async () => {
        assertEqual(await engine().parts.toolbar.getOrientation(), 'horizontal');
      });

      // Bold + Italic (nested inside the ToggleGroup wrapper, reached by the
      // '*' group recursion) + Link + Share = 4; the separator and the group
      // wrapper are not collection items and must not be counted.
      test('counts focusable items across the toggle-group wrapper', async () => {
        assertEqual(await engine().parts.toolbar.getItemCount(), 4);
      });
    });
  },
};
