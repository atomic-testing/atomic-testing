import { RadioButtonDriver, RadioGroupDriver } from '@atomic-testing/component-driver-angular-material-v21';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const radioScenePart = {
  flavorGroup: {
    locator: byDataTestId('flavor-group'),
    driver: RadioGroupDriver,
  },
  flavorState: {
    locator: byDataTestId('flavor-state'),
    driver: HTMLElementDriver,
  },
  vanilla: {
    locator: byDataTestId('flavor-vanilla'),
    driver: RadioButtonDriver,
  },
  chocolate: {
    locator: byDataTestId('flavor-chocolate'),
    driver: RadioButtonDriver,
  },
  strawberry: {
    locator: byDataTestId('flavor-strawberry'),
    driver: RadioButtonDriver,
  },
  sizeGroup: {
    locator: byDataTestId('size-group'),
    driver: RadioGroupDriver,
  },
} satisfies ScenePart;

export const radioTestSuite: TestSuiteInfo<typeof radioScenePart> = {
  title: 'Angular Material v21 Radio',
  url: '/radio',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('MatRadioGroup and MatRadioButton', () => {
      const engine = useTestEngine(radioScenePart, getTestEngine, { beforeEach, afterEach });

      // Each group reads its own checked input — a selection in one group
      // never leaks into another.
      test('reads the selected value per group', async () => {
        assertEqual(await engine().parts.flavorGroup.getValue(), null);
        assertEqual(await engine().parts.sizeGroup.getValue(), 'small');
      });

      // setValue clicks the native input, so Material's (change) output
      // fires — the recorded value advances alongside the group value.
      test('setValue selects the radio with that value and reaches the change handler', async () => {
        assertTrue(await engine().parts.flavorGroup.setValue('chocolate'));
        assertEqual(await engine().parts.flavorGroup.getValue(), 'chocolate');
        assertEqual(await engine().parts.flavorState.getText(), 'chocolate');
      });

      test('reports the selected label, undefined when nothing is selected', async () => {
        assertEqual(await engine().parts.flavorGroup.getSelectedLabel(), undefined);
        assertEqual(await engine().parts.sizeGroup.getSelectedLabel(), 'Small');

        await engine().parts.flavorGroup.setValue('vanilla');
        assertEqual(await engine().parts.flavorGroup.getSelectedLabel(), 'Vanilla');
      });

      test('radio buttons report their own selected state', async () => {
        assertFalse(await engine().parts.vanilla.isSelected());
        await engine().parts.vanilla.select();
        assertTrue(await engine().parts.vanilla.isSelected());
        assertFalse(await engine().parts.chocolate.isSelected());
      });

      test('selecting a sibling moves the selection', async () => {
        await engine().parts.vanilla.select();
        await engine().parts.chocolate.select();
        assertTrue(await engine().parts.chocolate.isSelected());
        assertFalse(await engine().parts.vanilla.isSelected());
        assertEqual(await engine().parts.flavorGroup.getValue(), 'chocolate');
      });

      test('reads each radio button its own value and label', async () => {
        assertEqual(await engine().parts.vanilla.getValue(), 'vanilla');
        assertEqual(await engine().parts.vanilla.getLabel(), 'Vanilla');
        assertEqual(await engine().parts.chocolate.getLabel(), 'Chocolate');
      });

      test('reports the disabled state per radio button', async () => {
        assertTrue(await engine().parts.strawberry.isDisabled());
        assertFalse(await engine().parts.vanilla.isDisabled());
      });
    });
  },
};
