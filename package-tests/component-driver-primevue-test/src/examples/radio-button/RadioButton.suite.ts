import { RadioButtonDriver, RadioButtonGroupDriver } from '@atomic-testing/component-driver-primevue-v4';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const radioButtonScenePart = {
  group: {
    locator: byDataTestId('drink-group'),
    driver: RadioButtonGroupDriver,
  },
  wine: {
    locator: byDataTestId('drink-wine'),
    driver: RadioButtonDriver,
  },
} satisfies ScenePart;

export const radioButtonTestSuite: TestSuiteInfo<typeof radioButtonScenePart> = {
  title: 'PrimeVue RadioButton',
  url: '/radio-button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('PrimeVue RadioButton', () => {
      const engine = useTestEngine(radioButtonScenePart, getTestEngine, { beforeEach, afterEach });

      test('counts every radio through the per-option wrappers', async () => {
        assertEqual(await engine().parts.group.getItemCount(), 3);
      });

      test('reads the selected value', async () => {
        assertEqual(await engine().parts.group.getValue(), 'water');
      });

      test('selects by value and moves the selection', async () => {
        assertTrue(await engine().parts.group.setValue('wine'));
        assertEqual(await engine().parts.group.getValue(), 'wine');
        assertTrue(await engine().parts.wine.isSelected());
      });

      test('refuses a disabled or unknown value', async () => {
        assertFalse(await engine().parts.group.setValue('beer'));
        assertFalse(await engine().parts.group.setValue('juice'));
        assertEqual(await engine().parts.group.getValue(), 'water');
      });

      test('a single radio cannot be deselected directly', async () => {
        await engine().parts.group.setValue('wine');
        let threw = false;
        try {
          await engine().parts.wine.setSelected(false);
        } catch {
          threw = true;
        }
        assertTrue(threw);
        assertTrue(await engine().parts.wine.isSelected());
      });
    });
  },
};
