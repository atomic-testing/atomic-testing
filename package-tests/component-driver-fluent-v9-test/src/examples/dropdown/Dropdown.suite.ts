import { DropdownDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dropdownUIExample } from './Dropdown.examples';

export const dropdownExampleScenePart = {
  one: { locator: byDataTestId('dropdown-one'), driver: DropdownDriver },
  two: { locator: byDataTestId('dropdown-two'), driver: DropdownDriver },
  selected: { locator: byDataTestId('dropdown-selected'), driver: DropdownDriver },
  disabled: { locator: byDataTestId('dropdown-disabled'), driver: DropdownDriver },
  unselected: { locator: byDataTestId('dropdown-unselected'), driver: DropdownDriver },
} satisfies ScenePart;

export const dropdownExample: IExampleUnit<typeof dropdownExampleScenePart, JSX.Element> = {
  ...dropdownUIExample,
  scene: dropdownExampleScenePart,
};

export const dropdownExampleTestSuite: TestSuiteInfo<typeof dropdownExample.scene> = {
  title: 'Fluent Dropdown',
  url: '/dropdown',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${dropdownExample.title}`, () => {
      const engine = useTestEngine(dropdownExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('is closed initially and opens/closes via the trigger', async () => {
        assertFalse(await engine().parts.one.isOpen());
        await engine().parts.one.open();
        assertTrue(await engine().parts.one.isOpen());
        await engine().parts.one.close();
        assertFalse(await engine().parts.one.isOpen());
      });

      test('lists option labels and count once open', async () => {
        await engine().parts.one.open();
        assertEqual(await engine().parts.one.getOptionCount(), 4);
        assertEqual(await engine().parts.one.getOptionLabels(), ['Apple', 'Banana', 'Cherry', 'Date']);
      });

      test('reads a disabled option distinctly from an enabled one', async () => {
        await engine().parts.one.open();
        const cherry = await engine().parts.one.getOptionByLabel('Cherry');
        const apple = await engine().parts.one.getOptionByLabel('Apple');
        assertTrue(await cherry?.isDisabled());
        assertFalse(await apple?.isDisabled());
      });

      test('selectByLabel selects the option, updates the trigger label, and closes the dropdown', async () => {
        await engine().parts.one.open();
        await engine().parts.one.selectByLabel('Banana');
        assertFalse(await engine().parts.one.isOpen());
        assertEqual(await engine().parts.one.getSelectedLabel(), 'Banana');
      });

      test('reports no options while closed, since Fluent only mounts them once opened', async () => {
        assertEqual(await engine().parts.two.getOptionCount(), 0);
        assertEqual(await engine().parts.two.getOptionLabels(), []);
      });

      test('two simultaneously-usable instances disambiguate their selection independently', async () => {
        await engine().parts.one.open();
        await engine().parts.one.selectByLabel('Apple');

        await engine().parts.two.open();
        await engine().parts.two.selectByLabel('Yellow');

        assertEqual(await engine().parts.one.getSelectedLabel(), 'Apple');
        assertEqual(await engine().parts.two.getSelectedLabel(), 'Yellow');
      });

      test('reads the pre-selected initial label (the non-empty counterpart of the absent case below)', async () => {
        assertEqual(await engine().parts.selected.getSelectedLabel(), 'Green');
      });

      test('an unselected dropdown with no placeholder has no selected label', async () => {
        assertEqual(await engine().parts.unselected.getSelectedLabel(), undefined);
      });

      test('reads disabled state per instance', async () => {
        assertFalse(await engine().parts.one.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });
    });
  },
};
