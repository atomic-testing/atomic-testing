import { MenuItemNotFoundErrorId, SelectDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const selectScenePart = {
  fruit: {
    locator: byDataTestId('select-trigger'),
    driver: SelectDriver,
  },
  lockedFruit: {
    locator: byDataTestId('locked-select-trigger'),
    driver: SelectDriver,
  },
} satisfies ScenePart;

export const selectTestSuite: TestSuiteInfo<typeof selectScenePart> = {
  title: 'Reka UI Select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Reka UI Select', () => {
      const engine = useTestEngine(selectScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the initial selected label', async () => {
        assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Apple');
      });

      // The trigger's default SelectIcon renders a "▼" glyph as a sibling
      // <span> of SelectValue — getSelectedLabel must exclude it (see
      // SelectDriver's class doc comment) or this would read "Apple▼".
      test('getValue matches getSelectedLabel (no glyph pollution)', async () => {
        assertEqual(await engine().parts.fruit.getValue(), 'Apple');
      });

      test('isDropdownOpen starts false', async () => {
        assertFalse(await engine().parts.fruit.isDropdownOpen());
      });

      // Regression test for the flagship #1037 pain point: opening the
      // dropdown must not throw (hasPointerCapture jsdom gap, polyfilled in
      // jest.setup.ts — see SelectDriver's class doc comment) and the
      // dropdown must stay open, not close immediately.
      test('opening the dropdown does not throw and stays open', async () => {
        await engine().parts.fruit.openDropdown();
        assertTrue(await engine().parts.fruit.isDropdownOpen());
      });

      test('closeDropdown no-ops when already closed', async () => {
        assertFalse(await engine().parts.fruit.isDropdownOpen());
        await engine().parts.fruit.closeDropdown();
        assertFalse(await engine().parts.fruit.isDropdownOpen());
      });

      // closeDropdown() while OPEN (re-clicking the trigger) is NOT covered
      // here: confirmed empirically in real Chromium that Reka's
      // DismissableLayer sets pointer-events: none on document.body while
      // open (the trigger inherits it), so a click at the trigger's own
      // element never becomes actionable and hangs until the actionability
      // timeout — see SelectDriver.closeDropdown's class doc. This mirrors
      // component-driver-radix-v1's own suite, which also never exercises
      // this path. selectByLabel/setValue (below) close the dropdown via an
      // item click instead, which stays reliably actionable.

      test('counts and finds options', async () => {
        await engine().parts.fruit.openDropdown();
        assertEqual(await engine().parts.fruit.getMenuItemCount(), 3);

        const banana = await engine().parts.fruit.getMenuItemByLabel('Banana');
        assertEqual(await banana?.getLabel(), 'Banana');
      });

      test('getMenuItemByIndex returns options positionally, and null out of range', async () => {
        await engine().parts.fruit.openDropdown();

        assertEqual(await (await engine().parts.fruit.getMenuItemByIndex(0))?.getLabel(), 'Apple');
        assertEqual(await (await engine().parts.fruit.getMenuItemByIndex(1))?.getLabel(), 'Banana');
        assertEqual(await (await engine().parts.fruit.getMenuItemByIndex(2))?.getLabel(), 'Cherry');
        assertEqual(await engine().parts.fruit.getMenuItemByIndex(3), null);
      });

      test('reads the disabled item', async () => {
        await engine().parts.fruit.openDropdown();

        const cherry = await engine().parts.fruit.getMenuItemByLabel('Cherry');
        assertTrue(await cherry?.isDisabled());

        const apple = await engine().parts.fruit.getMenuItemByLabel('Apple', { skipDropdownCheck: true });
        assertFalse(await apple?.isDisabled());
      });

      test('selectByLabel changes the selection and closes the dropdown', async () => {
        await engine().parts.fruit.selectByLabel('Banana');
        assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Banana');
        assertFalse(await engine().parts.fruit.isDropdownOpen());
      });

      test('selectByLabel throws MenuItemNotFoundError for an unknown label', async () => {
        let errorName = '';
        try {
          await engine().parts.fruit.selectByLabel('Durian');
        } catch (error) {
          errorName = (error as Error).name;
        }
        assertEqual(errorName, MenuItemNotFoundErrorId);
      });

      test('setValue selects by label and returns true', async () => {
        const changed = await engine().parts.fruit.setValue('Banana');
        assertTrue(changed);
        assertEqual(await engine().parts.fruit.getValue(), 'Banana');
      });

      test('setValue returns false for an unknown label', async () => {
        const changed = await engine().parts.fruit.setValue('Durian');
        assertFalse(changed);
      });

      test('isDisabled/isRequired distinguish the two scene instances', async () => {
        assertFalse(await engine().parts.fruit.isDisabled());
        assertFalse(await engine().parts.fruit.isRequired());

        assertTrue(await engine().parts.lockedFruit.isDisabled());
        assertTrue(await engine().parts.lockedFruit.isRequired());
      });
    });
  },
};
