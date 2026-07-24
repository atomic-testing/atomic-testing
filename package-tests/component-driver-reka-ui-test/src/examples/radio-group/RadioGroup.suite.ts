import { RadioGroupDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const radioGroupScenePart = {
  groupOne: {
    locator: byDataTestId('radio-group-one'),
    driver: RadioGroupDriver,
  },
  groupTwo: {
    locator: byDataTestId('radio-group-two'),
    driver: RadioGroupDriver,
  },
  groupLocked: {
    locator: byDataTestId('radio-group-locked'),
    driver: RadioGroupDriver,
  },
  groupRequired: {
    locator: byDataTestId('radio-group-required'),
    driver: RadioGroupDriver,
  },
} satisfies ScenePart;

export const radioGroupTestSuite: TestSuiteInfo<typeof radioGroupScenePart> = {
  title: 'Reka UI RadioGroup',
  url: '/radio-group',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Reka UI RadioGroup', () => {
      const engine = useTestEngine(radioGroupScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the default selection independently per group', async () => {
        assertEqual(await engine().parts.groupOne.getValue(), 'a');
        assertEqual(await engine().parts.groupTwo.getValue(), null);
      });

      test('selects an item by value without disturbing the other group', async () => {
        const selected = await engine().parts.groupOne.setValue('b');
        assertTrue(selected);
        assertEqual(await engine().parts.groupOne.getValue(), 'b');
        assertEqual(await engine().parts.groupTwo.getValue(), null);

        await engine().parts.groupTwo.setValue('y');
        assertEqual(await engine().parts.groupTwo.getValue(), 'y');
        assertEqual(await engine().parts.groupOne.getValue(), 'b');
      });

      test('refuses to select a disabled item and leaves the selection unchanged', async () => {
        const selected = await engine().parts.groupOne.setValue('c');
        assertFalse(selected);
        assertEqual(await engine().parts.groupOne.getValue(), 'a');
      });

      test('refuses to select a missing value', async () => {
        const selected = await engine().parts.groupOne.setValue('does-not-exist');
        assertFalse(selected);
      });

      test('reads item count and per-item disabled state', async () => {
        assertEqual(await engine().parts.groupOne.getItemCount(), 3);
        const disabledItem = await engine().parts.groupOne.getItemByValue('c');
        assertTrue(disabledItem != null && (await disabledItem.isDisabled()));
      });

      test('reads the group-level disabled state, which cascades onto every item', async () => {
        assertFalse(await engine().parts.groupOne.isDisabled());
        assertTrue(await engine().parts.groupLocked.isDisabled());

        const cascadedItem = await engine().parts.groupLocked.getItemByValue('z');
        assertTrue(cascadedItem != null && (await cascadedItem.isDisabled()));
      });

      test('reads the group-level required state', async () => {
        assertFalse(await engine().parts.groupOne.isRequired());
        assertTrue(await engine().parts.groupRequired.isRequired());
      });
    });
  },
};
