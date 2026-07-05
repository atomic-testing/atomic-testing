import { CheckboxDriver } from '@atomic-testing/component-driver-primevue-v4';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const checkboxScenePart = {
  subscribe: {
    locator: byDataTestId('subscribe'),
    driver: CheckboxDriver,
  },
  disabled: {
    locator: byDataTestId('disabled-checkbox'),
    driver: CheckboxDriver,
  },
  required: {
    locator: byDataTestId('required-checkbox'),
    driver: CheckboxDriver,
  },
  cheese: {
    locator: byDataTestId('topping-cheese'),
    driver: CheckboxDriver,
  },
  mushroom: {
    locator: byDataTestId('topping-mushroom'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

export const checkboxTestSuite: TestSuiteInfo<typeof checkboxScenePart> = {
  title: 'PrimeVue Checkbox',
  url: '/checkbox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('PrimeVue Checkbox', () => {
      const engine = useTestEngine(checkboxScenePart, getTestEngine, { beforeEach, afterEach });

      test('binary mode toggles through setSelected', async () => {
        assertFalse(await engine().parts.subscribe.isSelected());
        await engine().parts.subscribe.setSelected(true);
        assertTrue(await engine().parts.subscribe.isSelected());
        await engine().parts.subscribe.setSelected(false);
        assertFalse(await engine().parts.subscribe.isSelected());
      });

      test('setSelected is idempotent', async () => {
        await engine().parts.subscribe.setSelected(true);
        await engine().parts.subscribe.setSelected(true);
        assertTrue(await engine().parts.subscribe.isSelected());
      });

      test('binary mode has no value attribute', async () => {
        assertEqual(await engine().parts.subscribe.getValue(), null);
      });

      test('reads disabled and required states', async () => {
        assertFalse(await engine().parts.subscribe.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
        assertFalse(await engine().parts.subscribe.isRequired());
        assertTrue(await engine().parts.required.isRequired());
      });

      test('array-value mode: each checkbox reports its own value and selection', async () => {
        assertEqual(await engine().parts.cheese.getValue(), 'cheese');
        assertEqual(await engine().parts.mushroom.getValue(), 'mushroom');
        assertTrue(await engine().parts.cheese.isSelected());
        assertFalse(await engine().parts.mushroom.isSelected());

        await engine().parts.mushroom.setSelected(true);
        assertTrue(await engine().parts.mushroom.isSelected());
        assertTrue(await engine().parts.cheese.isSelected());
      });
    });
  },
};
