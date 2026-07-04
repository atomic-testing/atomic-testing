import { SelectDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { selectUIExample } from './Select.examples';

export const selectExampleScenePart = {
  select: {
    locator: byDataTestId('select-trigger'),
    driver: SelectDriver,
  },
} satisfies ScenePart;

export const selectExample: IExampleUnit<typeof selectExampleScenePart, JSX.Element> = {
  ...selectUIExample,
  scene: selectExampleScenePart,
};

export const selectExampleTestSuite: TestSuiteInfo<typeof selectExample.scene> = {
  title: 'Radix Select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${selectExample.title}`, () => {
      const engine = useTestEngine(selectExample.scene, getTestEngine, { beforeEach, afterEach });

      test('reads the initial selected label', async () => {
        assertEqual(await engine().parts.select.getSelectedLabel(), 'Apple');
      });

      // The trigger's default Select.Icon renders a "▼" glyph as a sibling
      // <span> of Select.Value — getSelectedLabel must exclude it (see
      // SelectDriver's class doc comment) or this would read "Apple▼".
      test('getValue matches getSelectedLabel (no glyph pollution)', async () => {
        assertEqual(await engine().parts.select.getValue(), 'Apple');
      });

      // Regression test for the flagship #1003 pain point: opening the
      // dropdown must not throw (hasPointerCapture/scrollIntoView jsdom gaps,
      // polyfilled in jest.setup.ts — see SelectDriver's class doc comment)
      // and the dropdown must stay open, not close immediately.
      test('opening the dropdown does not throw and stays open', async () => {
        await engine().parts.select.openDropdown();
        assertTrue(await engine().parts.select.isDropdownOpen());
      });

      test('counts and finds options', async () => {
        await engine().parts.select.openDropdown();
        assertEqual(await engine().parts.select.getMenuItemCount(), 2);
        const banana = await engine().parts.select.getMenuItemByLabel('Banana');
        assertEqual(await banana?.getLabel(), 'Banana');
      });

      test('selectByLabel changes the selection and closes the dropdown', async () => {
        await engine().parts.select.selectByLabel('Banana');
        assertEqual(await engine().parts.select.getSelectedLabel(), 'Banana');
        assertFalse(await engine().parts.select.isDropdownOpen());
      });

      test('setValue selects by label and returns true', async () => {
        const changed = await engine().parts.select.setValue('Banana');
        assertTrue(changed);
        assertEqual(await engine().parts.select.getValue(), 'Banana');
      });

      test('setValue returns false for an unknown label', async () => {
        const changed = await engine().parts.select.setValue('Cherry');
        assertFalse(changed);
      });

      test('is not disabled or required in the base scene', async () => {
        assertFalse(await engine().parts.select.isDisabled());
        assertFalse(await engine().parts.select.isRequired());
      });
    });
  },
};
