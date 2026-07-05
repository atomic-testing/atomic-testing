import { AutocompleteDriver } from '@atomic-testing/component-driver-angular-material-v22';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const autocompleteScenePart = {
  fruit: {
    locator: byDataTestId('fruit-input'),
    driver: AutocompleteDriver,
  },
  color: {
    locator: byDataTestId('color-input'),
    driver: AutocompleteDriver,
  },
  locked: {
    locator: byDataTestId('locked-input'),
    driver: AutocompleteDriver,
  },
  title: {
    locator: byDataTestId('page-title'),
    driver: HTMLElementDriver,
  },
  fruitSelection: {
    locator: byDataTestId('fruit-selection'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const autocompleteTestSuite: TestSuiteInfo<typeof autocompleteScenePart> = {
  title: 'Angular Material v22 Autocomplete',
  url: '/autocomplete',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('MatAutocomplete', () => {
      const engine = useTestEngine(autocompleteScenePart, getTestEngine, { beforeEach, afterEach });

      test('starts closed with an empty value', async () => {
        assertFalse(await engine().parts.fruit.isDropdownOpen());
        assertEqual(await engine().parts.fruit.getValue(), '');
      });

      test('opens on click, lists every option and closes on Escape', async () => {
        await engine().parts.fruit.openDropdown();
        assertTrue(await engine().parts.fruit.isDropdownOpen());
        assertEqual(await engine().parts.fruit.getOptionLabels(), [
          'Apple',
          'Apricot',
          'Banana',
          'Blueberry',
          'Cherry',
        ]);
        assertEqual(await engine().parts.fruit.getOptionCount(), 5);
        await engine().parts.fruit.closeDropdown();
        assertFalse(await engine().parts.fruit.isDropdownOpen());
      });

      test('dismisses on outside click', async () => {
        await engine().parts.fruit.openDropdown();
        assertTrue(await engine().parts.fruit.isDropdownOpen());
        await engine().parts.title.click();
        const open = await engine().parts.fruit.waitUntil({
          probeFn: () => engine().parts.fruit.isDropdownOpen(),
          terminateCondition: false,
          timeoutMs: 5000,
        });
        assertFalse(open);
      });

      test('typing opens the panel and filters the options', async () => {
        await engine().parts.fruit.enterText('ap');
        // Filtering re-renders asynchronously — probe, never assert immediately.
        const filteredCount = await engine().parts.fruit.waitUntil({
          probeFn: () => engine().parts.fruit.getOptionCount(),
          terminateCondition: 2,
          timeoutMs: 5000,
        });
        assertEqual(filteredCount, 2);
        assertTrue(await engine().parts.fruit.isDropdownOpen());
        assertEqual(await engine().parts.fruit.getOptionLabels(), ['Apple', 'Apricot']);

        await engine().parts.fruit.enterText('apr');
        const narrowedCount = await engine().parts.fruit.waitUntil({
          probeFn: () => engine().parts.fruit.getOptionCount(),
          terminateCondition: 1,
          timeoutMs: 5000,
        });
        assertEqual(narrowedCount, 1);
        assertEqual(await engine().parts.fruit.getOptionLabels(), ['Apricot']);
      });

      test('reports no options when the filter matches nothing', async () => {
        await engine().parts.fruit.enterText('zzz');
        const count = await engine().parts.fruit.waitUntil({
          probeFn: () => engine().parts.fruit.getOptionCount(),
          terminateCondition: 0,
          timeoutMs: 5000,
        });
        assertEqual(count, 0);
        assertFalse(await engine().parts.fruit.isDropdownOpen());
      });

      test('selectByLabel picks a filtered option and fills the input', async () => {
        await engine().parts.fruit.enterText('b');
        await engine().parts.fruit.selectByLabel('Blueberry');
        assertEqual(await engine().parts.fruit.getValue(), 'Blueberry');
        assertFalse(await engine().parts.fruit.isDropdownOpen());
        // The component's own optionSelected handler observed the selection.
        const echoed = await engine().parts.fruit.waitUntil({
          probeFn: async () => (await engine().parts.fruitSelection.getText())?.trim(),
          terminateCondition: 'Blueberry',
          timeoutMs: 5000,
        });
        assertEqual(echoed, 'Blueberry');
      });

      test('setValue types, selects the matching option and stays per-instance', async () => {
        assertTrue(await engine().parts.fruit.setValue('Banana'));
        assertEqual(await engine().parts.fruit.getValue(), 'Banana');
        assertFalse(await engine().parts.fruit.isDropdownOpen());
        // Selecting in one instance never leaks into the other.
        assertEqual(await engine().parts.color.getValue(), '');
      });

      test('setValue returns false for an unknown label and closes the panel', async () => {
        assertFalse(await engine().parts.fruit.setValue('Durian'));
        assertFalse(await engine().parts.fruit.isDropdownOpen());
        // The typed text stays — autocomplete is a free-text input.
        assertEqual(await engine().parts.fruit.getValue(), 'Durian');
      });

      test('setValue(null) clears the input', async () => {
        assertTrue(await engine().parts.fruit.setValue('Apple'));
        assertTrue(await engine().parts.fruit.setValue(null));
        assertEqual(await engine().parts.fruit.getValue(), '');
        assertFalse(await engine().parts.fruit.isDropdownOpen());
      });

      test('exposes per-option state', async () => {
        const blue = await engine().parts.color.getOptionByLabel('Blue');
        assertTrue(await blue!.isDisabled());
        const red = await engine().parts.color.getOptionByLabel('Red');
        assertFalse(await red!.isDisabled());
        const missing = await engine().parts.color.getOptionByLabel('Purple');
        assertEqual(missing, null);
      });

      test('reports disabled and required state', async () => {
        assertTrue(await engine().parts.locked.isDisabled());
        assertTrue(await engine().parts.locked.isRequired());
        assertFalse(await engine().parts.fruit.isDisabled());
        assertFalse(await engine().parts.fruit.isRequired());
      });
    });
  },
};
