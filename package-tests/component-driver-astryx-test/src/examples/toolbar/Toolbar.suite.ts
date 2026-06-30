import { ToolbarDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toolbarUIExample } from './Toolbar.examples';

export const toolbarExampleScenePart = {
  toolbar: {
    locator: byDataTestId('toolbar'),
    driver: ToolbarDriver,
  },
  secondary: {
    locator: byDataTestId('toolbar-secondary'),
    driver: ToolbarDriver,
  },
} satisfies ScenePart;

export const toolbarExample: IExampleUnit<typeof toolbarExampleScenePart, JSX.Element> = {
  ...toolbarUIExample,
  scene: toolbarExampleScenePart,
};

export const toolbarExampleTestSuite: TestSuiteInfo<typeof toolbarExample.scene> = {
  title: 'Astryx Toolbar',
  url: '/toolbar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${toolbarExample.title}`, () => {
      const engine = useTestEngine(toolbarExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel reads aria-label; getSize reads data-size.
      test(`getLabel and getSize read the toolbar attributes`, async () => {
        assertEqual(await engine().parts.toolbar.getLabel(), 'Text actions');
        assertEqual(await engine().parts.toolbar.getSize(), 'sm');
      });

      // getOrientation defaults to horizontal and follows the orientation prop.
      test(`getOrientation reflects the orientation`, async () => {
        assertEqual(await engine().parts.toolbar.getOrientation(), 'horizontal');
        assertEqual(await engine().parts.secondary.getOrientation(), 'vertical');
      });

      // getItemCount counts each toolbar's own buttons.
      test(`getItemCount counts the buttons per toolbar`, async () => {
        assertEqual(await engine().parts.toolbar.getItemCount(), 3);
        assertEqual(await engine().parts.secondary.getItemCount(), 1);
      });
    });
  },
};
