import { ComboboxDriver, MenuItemNotFoundErrorId } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { comboboxUIExample } from './Combobox.examples';

export const comboboxExampleScenePart = {
  animals: { locator: byDataTestId('combobox-animals'), driver: ComboboxDriver },
  empty: { locator: byDataTestId('combobox-empty'), driver: ComboboxDriver },
  disabled: { locator: byDataTestId('combobox-disabled'), driver: ComboboxDriver },
  pairA: { locator: byDataTestId('combobox-pair-a'), driver: ComboboxDriver },
  pairB: { locator: byDataTestId('combobox-pair-b'), driver: ComboboxDriver },
} satisfies ScenePart;

export const comboboxExample: IExampleUnit<typeof comboboxExampleScenePart, JSX.Element> = {
  ...comboboxUIExample,
  scene: comboboxExampleScenePart,
};

export const comboboxExampleTestSuite: TestSuiteInfo<typeof comboboxExample.scene> = {
  title: 'Fluent Combobox',
  url: '/combobox',
  tests: (
    getTestEngine,
    { describe, test, beforeEach, afterEach, assertEqual, assertNotEqual, assertTrue, assertFalse }
  ) => {
    describe(`${comboboxExample.title}`, () => {
      const engine = useTestEngine(comboboxExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('is closed by default and opens/closes by clicking the input', async () => {
        assertFalse(await engine().parts.animals.isOpen());

        await engine().parts.animals.open();
        assertTrue(await engine().parts.animals.isOpen());

        await engine().parts.animals.close();
        assertFalse(await engine().parts.animals.isOpen());
      });

      test('lists option labels and count, in document order', async () => {
        assertEqual(await engine().parts.animals.getOptionCount(), 4);
        assertEqual(await engine().parts.animals.getOptionLabels(), ['Cat', 'Dog', 'Bird', 'Fish']);
      });

      test('reads per-option disabled state', async () => {
        const fish = await engine().parts.animals.getOptionByLabel('Fish');
        assertNotEqual(fish, null);
        assertTrue(await fish!.isDisabled());

        const cat = await engine().parts.animals.getOptionByLabel('Cat');
        assertNotEqual(cat, null);
        assertFalse(await cat!.isDisabled());
      });

      test('getOptionByLabel returns null for a label with no matching option', async () => {
        assertEqual(await engine().parts.animals.getOptionByLabel('Zebra'), null);
      });

      test('selectByLabel clicks the option, closes the listbox, and mirrors its text onto the value', async () => {
        assertEqual(await engine().parts.animals.getValue(), '');

        await engine().parts.animals.selectByLabel('Dog');
        assertEqual(await engine().parts.animals.getValue(), 'Dog');
        assertFalse(await engine().parts.animals.isOpen());
      });

      test('the selected option carries aria-selected once the listbox is reopened', async () => {
        await engine().parts.animals.selectByLabel('Cat');

        const cat = await engine().parts.animals.getOptionByLabel('Cat');
        const dog = await engine().parts.animals.getOptionByLabel('Dog');
        assertNotEqual(cat, null);
        assertNotEqual(dog, null);
        assertTrue(await cat!.isSelected());
        assertFalse(await dog!.isSelected());
      });

      test('selectByLabel throws MenuItemNotFoundError for an unmatched label', async () => {
        let thrownName: string | undefined;
        try {
          await engine().parts.animals.selectByLabel('Zebra');
        } catch (error) {
          thrownName = (error as Error).name;
        }
        assertEqual(thrownName, MenuItemNotFoundErrorId);
      });

      test('setValue drives freeform typed text, independent of the option list', async () => {
        await engine().parts.animals.setValue('Zebra');
        assertEqual(await engine().parts.animals.getValue(), 'Zebra');
      });

      test('reads the disabled state per instance', async () => {
        assertFalse(await engine().parts.animals.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });

      test('an empty combobox has no options and resolves no match', async () => {
        assertEqual(await engine().parts.empty.getOptionCount(), 0);
        assertEqual(await engine().parts.empty.getOptionLabels(), []);
        assertEqual(await engine().parts.empty.getOptionByLabel('Anything'), null);
      });

      test('two simultaneously open instances resolve independent listboxes (locator disambiguation)', async () => {
        assertTrue(await engine().parts.pairA.isOpen());
        assertTrue(await engine().parts.pairB.isOpen());

        assertEqual(await engine().parts.pairA.getOptionLabels(), ['Alpha', 'Beta']);
        assertEqual(await engine().parts.pairB.getOptionLabels(), ['Gamma', 'Delta', 'Epsilon']);
        assertNotEqual(await engine().parts.pairA.getOptionCount(), await engine().parts.pairB.getOptionCount());

        await engine().parts.pairA.selectByLabel('Beta');
        assertEqual(await engine().parts.pairA.getValue(), 'Beta');
        // pairB's value and options are untouched by pairA's selection.
        assertEqual(await engine().parts.pairB.getValue(), '');
        assertEqual(await engine().parts.pairB.getOptionLabels(), ['Gamma', 'Delta', 'Epsilon']);
      });
    });
  },
};
