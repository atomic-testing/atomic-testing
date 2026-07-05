import { SelectDriver } from '@atomic-testing/component-driver-angular-material-v22';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const selectScenePart = {
  fruit: {
    locator: byDataTestId('fruit-select'),
    driver: SelectDriver,
  },
  color: {
    locator: byDataTestId('color-select'),
    driver: SelectDriver,
  },
  locked: {
    locator: byDataTestId('locked-select'),
    driver: SelectDriver,
  },
  fruitValue: {
    locator: byDataTestId('fruit-value'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const selectTestSuite: TestSuiteInfo<typeof selectScenePart> = {
  title: 'Angular Material v22 Select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('MatSelect', () => {
      const engine = useTestEngine(selectScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the selected label per instance', async () => {
        assertEqual(await engine().parts.fruit.getSelectedLabel(), null);
        // MatSelect renders a preset [value] into the trigger only after its
        // options QueryList settles (a beat after first paint under zoneless
        // bootstrap) — probe rather than assert immediately.
        const color = await engine().parts.color.waitUntil({
          probeFn: () => engine().parts.color.getSelectedLabel(),
          terminateCondition: 'Green',
          timeoutMs: 5000,
        });
        assertEqual(color, 'Green');
      });

      test('reports the dropdown closed initially', async () => {
        assertFalse(await engine().parts.fruit.isDropdownOpen());
      });

      test('opens and closes the dropdown', async () => {
        await engine().parts.fruit.openDropdown();
        assertTrue(await engine().parts.fruit.isDropdownOpen());
        await engine().parts.fruit.closeDropdown();
        assertFalse(await engine().parts.fruit.isDropdownOpen());
      });

      test('enumerates the options', async () => {
        assertEqual(await engine().parts.fruit.getOptionLabels(), ['Apple', 'Banana', 'Cherry']);
        assertEqual(await engine().parts.fruit.getOptionCount(), 3);
      });

      test('exposes per-option state', async () => {
        const cherry = await engine().parts.fruit.getOptionByLabel('Cherry');
        assertTrue(await cherry!.isDisabled());

        const green = await engine().parts.color.getOptionByLabel('Green');
        assertTrue(await green!.isSelected());
        assertFalse(await green!.isDisabled());

        const missing = await engine().parts.color.getOptionByLabel('Purple');
        assertEqual(missing, null);
      });

      test('selects an option by label and closes the panel', async () => {
        await engine().parts.fruit.selectByLabel('Banana');
        assertFalse(await engine().parts.fruit.isDropdownOpen());
        assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Banana');
        // The component's own change handler observed the selection.
        const echoed = await engine().parts.fruit.waitUntil({
          probeFn: async () => (await engine().parts.fruitValue.getText())?.trim(),
          terminateCondition: 'banana',
          timeoutMs: 5000,
        });
        assertEqual(echoed, 'banana');
      });

      test('reads and writes through the IInputDriver contract', async () => {
        assertEqual(await engine().parts.fruit.getValue(), null);
        assertTrue(await engine().parts.fruit.setValue('Apple'));
        assertEqual(await engine().parts.fruit.getValue(), 'Apple');
        // Selecting in one instance never leaks into the other.
        assertEqual(await engine().parts.color.getValue(), 'Green');
      });

      test('setValue returns false for an unknown label and closes the panel', async () => {
        assertFalse(await engine().parts.fruit.setValue('Durian'));
        assertFalse(await engine().parts.fruit.isDropdownOpen());
        assertEqual(await engine().parts.fruit.getValue(), null);
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
