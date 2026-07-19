import {
  ToolbarDividerDriver,
  ToolbarDriver,
  ToolbarRadioGroupDriver,
} from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toolbarUIExample } from './Toolbar.examples';

export const toolbarExampleScenePart = {
  toolbarA: { locator: byDataTestId('toolbar-a'), driver: ToolbarDriver },
  toolbarB: { locator: byDataTestId('toolbar-b'), driver: ToolbarDriver },
  alignGroup: { locator: byDataTestId('align-group'), driver: ToolbarRadioGroupDriver },
  dividerA: { locator: byDataTestId('divider-a'), driver: ToolbarDividerDriver },
  dividerB: { locator: byDataTestId('divider-b'), driver: ToolbarDividerDriver },
} satisfies ScenePart;

export const toolbarExample: IExampleUnit<typeof toolbarExampleScenePart, JSX.Element> = {
  ...toolbarUIExample,
  scene: toolbarExampleScenePart,
};

export const toolbarExampleTestSuite: TestSuiteInfo<typeof toolbarExample.scene> = {
  title: 'Fluent Toolbar',
  url: '/toolbar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${toolbarExample.title}`, () => {
      const engine = useTestEngine(toolbarExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads orientation per instance (disambiguation)', async () => {
        assertEqual(await engine().parts.toolbarA.getOrientation(), 'horizontal');
        assertEqual(await engine().parts.toolbarB.getOrientation(), 'vertical');
      });

      test('counts buttons and dividers, including buttons nested inside a group wrapper', async () => {
        // toolbar-a: Cut, Copy, Paste, Left, Center, Right = 6
        assertEqual(await engine().parts.toolbarA.getButtonCount(), 6);
        assertEqual(await engine().parts.toolbarA.getDividerCount(), 1);

        // toolbar-b: Save, Open = 2
        assertEqual(await engine().parts.toolbarB.getButtonCount(), 2);
        assertEqual(await engine().parts.toolbarB.getDividerCount(), 1);
      });

      test('getButtonByLabel resolves a plain or grouped button, or null when absent', async () => {
        const cut = await engine().parts.toolbarA.getButtonByLabel('Cut');
        assertFalse(await cut!.isDisabled());

        const copy = await engine().parts.toolbarA.getButtonByLabel('Copy');
        assertTrue(await copy!.isDisabled());

        const left = await engine().parts.toolbarA.getButtonByLabel('Left');
        assertTrue(left != null);

        assertEqual(await engine().parts.toolbarA.getButtonByLabel('Nonexistent'), null);
        assertEqual(await engine().parts.toolbarB.getButtonByLabel('Cut'), null);
      });

      test('ToolbarDividerDriver reports its own axis, inverted relative to its toolbar', async () => {
        assertEqual(await engine().parts.toolbarA.getOrientation(), 'horizontal');
        assertEqual(await engine().parts.dividerA.getOrientation(), 'vertical');

        assertEqual(await engine().parts.toolbarB.getOrientation(), 'vertical');
        assertEqual(await engine().parts.dividerB.getOrientation(), 'horizontal');
      });

      test('ToolbarRadioGroupDriver reads options and the default-selected one', async () => {
        assertEqual(await engine().parts.alignGroup.getOptionLabels(), ['Left', 'Center', 'Right']);
        assertEqual(await engine().parts.alignGroup.getSelectedLabel(), 'Left');
      });

      test('ToolbarRadioGroupDriver.selectByLabel selects a different option', async () => {
        assertTrue(await engine().parts.alignGroup.selectByLabel('Right'));
        assertEqual(await engine().parts.alignGroup.getSelectedLabel(), 'Right');

        assertFalse(await engine().parts.alignGroup.selectByLabel('Nonexistent'));
      });

      test('a radio option reports isSelected/isDisabled directly', async () => {
        const left = await engine().parts.alignGroup.getItemByLabel('Left');
        assertTrue(await left!.isSelected());
        assertFalse(await left!.isDisabled());
      });
    });
  },
};
