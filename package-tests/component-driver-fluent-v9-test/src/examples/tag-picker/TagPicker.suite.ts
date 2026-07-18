import { TagPickerDriver, TagPickerOptionNotFoundErrorId } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tagPickerUIExample } from './TagPicker.examples';

export const tagPickerExampleScenePart = {
  one: { locator: byDataTestId('tagpicker-one-control'), driver: TagPickerDriver },
  empty: { locator: byDataTestId('tagpicker-empty-control'), driver: TagPickerDriver },
  disabled: { locator: byDataTestId('tagpicker-disabled-control'), driver: TagPickerDriver },
  required: { locator: byDataTestId('tagpicker-required-control'), driver: TagPickerDriver },
  pairA: { locator: byDataTestId('tagpicker-pair-a-control'), driver: TagPickerDriver },
  pairB: { locator: byDataTestId('tagpicker-pair-b-control'), driver: TagPickerDriver },
} satisfies ScenePart;

export const tagPickerExample: IExampleUnit<typeof tagPickerExampleScenePart, JSX.Element> = {
  ...tagPickerUIExample,
  scene: tagPickerExampleScenePart,
};

export const tagPickerExampleTestSuite: TestSuiteInfo<typeof tagPickerExample.scene> = {
  title: 'Fluent TagPicker',
  url: '/tag-picker',
  tests: (
    getTestEngine,
    { describe, test, beforeEach, afterEach, assertEqual, assertNotEqual, assertTrue, assertFalse }
  ) => {
    describe(`${tagPickerExample.title}`, () => {
      const engine = useTestEngine(tagPickerExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the pre-selected tag labels', async () => {
        assertEqual(await engine().parts.one.getSelectedLabels(), ['Apple', 'Banana']);
      });

      test('is closed initially and opens/closes via the freeform input', async () => {
        assertFalse(await engine().parts.one.isOpen());
        await engine().parts.one.open();
        assertTrue(await engine().parts.one.isOpen());
        await engine().parts.one.close();
        assertFalse(await engine().parts.one.isOpen());
      });

      test('lists the remaining (unselected) option labels and count once open', async () => {
        await engine().parts.one.open();
        assertEqual(await engine().parts.one.getOptionCount(), 3);
        assertEqual(await engine().parts.one.getOptionLabels(), ['Cherry', 'Date', 'Elderberry']);
      });

      test('getOptionByLabel returns null for a label with no matching option', async () => {
        assertEqual(await engine().parts.one.getOptionByLabel('Nonexistent'), null);
      });

      test('selectByLabel adds the option to the selected tags and closes the list', async () => {
        await engine().parts.one.open();
        await engine().parts.one.selectByLabel('Cherry');
        assertFalse(await engine().parts.one.isOpen());
        assertEqual(await engine().parts.one.getSelectedLabels(), ['Apple', 'Banana', 'Cherry']);
      });

      test('selectByLabel throws TagPickerOptionNotFoundError for an unmatched label', async () => {
        let thrownName: string | undefined;
        try {
          await engine().parts.one.selectByLabel('Nonexistent');
        } catch (error) {
          thrownName = (error as Error).name;
        }
        assertEqual(thrownName, TagPickerOptionNotFoundErrorId);
      });

      test('removeSelected dismisses a selected tag, leaving the others untouched', async () => {
        await engine().parts.one.removeSelected('Apple');
        assertEqual(await engine().parts.one.getSelectedLabels(), ['Banana']);
      });

      test('removeSelected throws TagPickerOptionNotFoundError for a label that is not selected', async () => {
        let thrownName: string | undefined;
        try {
          await engine().parts.one.removeSelected('Cherry');
        } catch (error) {
          thrownName = (error as Error).name;
        }
        assertEqual(thrownName, TagPickerOptionNotFoundErrorId);
      });

      test('setFilter/getFilterText drive the freeform input independently of the selected tags', async () => {
        assertEqual(await engine().parts.one.getFilterText(), '');
        await engine().parts.one.setFilter('Cherry');
        assertEqual(await engine().parts.one.getFilterText(), 'Cherry');
        assertEqual(await engine().parts.one.getSelectedLabels(), ['Apple', 'Banana']);
      });

      test('reads disabled state per instance', async () => {
        assertFalse(await engine().parts.one.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });

      test('reads required/invalid state per instance', async () => {
        assertFalse(await engine().parts.one.isRequired());
        assertFalse(await engine().parts.one.isError());
        assertTrue(await engine().parts.required.isRequired());
        assertTrue(await engine().parts.required.isError());
      });

      test('an empty picker has no selected tags (the absent case)', async () => {
        assertEqual(await engine().parts.empty.getSelectedLabels(), []);
      });

      test('removeSelected throws on a picker with nothing selected', async () => {
        let thrownName: string | undefined;
        try {
          await engine().parts.empty.removeSelected('Anything');
        } catch (error) {
          thrownName = (error as Error).name;
        }
        assertEqual(thrownName, TagPickerOptionNotFoundErrorId);
      });

      test('two simultaneously open instances resolve independent option lists and selections', async () => {
        assertTrue(await engine().parts.pairA.isOpen());
        assertTrue(await engine().parts.pairB.isOpen());

        assertEqual(await engine().parts.pairA.getOptionLabels(), ['Beta']);
        assertEqual(await engine().parts.pairB.getOptionLabels(), ['Delta', 'Epsilon']);
        assertNotEqual(await engine().parts.pairA.getOptionCount(), await engine().parts.pairB.getOptionCount());

        await engine().parts.pairA.selectByLabel('Beta');
        assertEqual(await engine().parts.pairA.getSelectedLabels(), ['Alpha', 'Beta']);
        // pairB's selection and remaining options are untouched by pairA's selection.
        assertEqual(await engine().parts.pairB.getSelectedLabels(), ['Gamma']);
        assertEqual(await engine().parts.pairB.getOptionLabels(), ['Delta', 'Epsilon']);

        await engine().parts.pairB.removeSelected('Gamma');
        assertEqual(await engine().parts.pairB.getSelectedLabels(), []);
        // pairA's selection is untouched by pairB's removal.
        assertEqual(await engine().parts.pairA.getSelectedLabels(), ['Alpha', 'Beta']);
      });
    });
  },
};
