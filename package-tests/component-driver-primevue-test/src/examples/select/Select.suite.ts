import { MenuItemNotFoundErrorId, SelectDriver } from '@atomic-testing/component-driver-primevue-v4';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const selectScenePart = {
  city: {
    locator: byDataTestId('city-select'),
    driver: SelectDriver,
  },
  size: {
    locator: byDataTestId('size-select'),
    driver: SelectDriver,
  },
  locked: {
    locator: byDataTestId('locked-select'),
    driver: SelectDriver,
  },
  selfAnchored: {
    locator: byDataTestId('self-anchored-select'),
    driver: SelectDriver,
  },
} satisfies ScenePart;

export const selectTestSuite: TestSuiteInfo<typeof selectScenePart> = {
  title: 'PrimeVue Select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('PrimeVue Select', () => {
      const engine = useTestEngine(selectScenePart, getTestEngine, { beforeEach, afterEach });

      test('shows no selection while the placeholder is displayed', async () => {
        assertEqual(await engine().parts.city.getSelectedLabel(), null);
        assertFalse(await engine().parts.city.isDropdownOpen());
      });

      test('open/close cycle tracks aria-expanded', async () => {
        await engine().parts.city.openDropdown();
        assertTrue(await engine().parts.city.isDropdownOpen());
        await engine().parts.city.closeDropdown();
        assertFalse(await engine().parts.city.isDropdownOpen());
      });

      test('counts the options in the open dropdown', async () => {
        await engine().parts.city.openDropdown();
        assertEqual(await engine().parts.city.getMenuItemCount(), 3);
      });

      test('select-by-label round-trip (setValue → getValue)', async () => {
        assertTrue(await engine().parts.city.setValue('London'));
        assertEqual(await engine().parts.city.getValue(), 'London');
        assertEqual(await engine().parts.city.getSelectedLabel(), 'London');
      });

      test('reads options by index', async () => {
        await engine().parts.city.openDropdown();
        const first = await engine().parts.city.getMenuItemByIndex(0);
        assertEqual(await first?.getLabel(), 'Berlin');
        assertEqual(await engine().parts.city.getMenuItemByIndex(99), null);
      });

      test('two selects resolve their own overlays', async () => {
        assertEqual(await engine().parts.size.getSelectedLabel(), 'Small');
        await engine().parts.city.selectByLabel('Tokyo');
        await engine().parts.size.selectByLabel('Large');
        assertEqual(await engine().parts.city.getSelectedLabel(), 'Tokyo');
        assertEqual(await engine().parts.size.getSelectedLabel(), 'Large');
      });

      test('setValue reports an unknown label without throwing', async () => {
        assertFalse(await engine().parts.city.setValue('Atlantis'));
        await engine().parts.city.closeDropdown();
      });

      test('selectByLabel throws MenuItemNotFoundError for an unknown label', async () => {
        let errorName = '';
        try {
          await engine().parts.city.selectByLabel('Atlantis');
        } catch (error) {
          errorName = (error as Error).name;
        }
        assertEqual(errorName, MenuItemNotFoundErrorId);
      });

      test('reads the disabled state', async () => {
        assertFalse(await engine().parts.city.isDisabled());
        assertTrue(await engine().parts.locked.isDisabled());
      });

      test('appendTo="self" overlay resolves and drives identically (#1033)', async () => {
        assertFalse(await engine().parts.selfAnchored.isDropdownOpen());
        await engine().parts.selfAnchored.openDropdown();
        assertTrue(await engine().parts.selfAnchored.isDropdownOpen());
        assertEqual(await engine().parts.selfAnchored.getMenuItemCount(), 2);
        assertTrue(await engine().parts.selfAnchored.setValue('Large'));
        assertEqual(await engine().parts.selfAnchored.getValue(), 'Large');
      });
    });
  },
};
