import { CheckboxDriver } from '@atomic-testing/component-driver-angular-material-v21';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const checkboxScenePart = {
  terms: {
    locator: byDataTestId('terms'),
    driver: CheckboxDriver,
  },
  termsState: {
    locator: byDataTestId('terms-state'),
    driver: HTMLElementDriver,
  },
  newsletter: {
    locator: byDataTestId('newsletter'),
    driver: CheckboxDriver,
  },
  selectAll: {
    locator: byDataTestId('select-all'),
    driver: CheckboxDriver,
  },
  disabled: {
    locator: byDataTestId('disabled-checkbox'),
    driver: CheckboxDriver,
  },
  interactiveDisabled: {
    locator: byDataTestId('interactive-disabled-checkbox'),
    driver: CheckboxDriver,
  },
  required: {
    locator: byDataTestId('required-checkbox'),
    driver: CheckboxDriver,
  },
  bare: {
    locator: byDataTestId('bare-checkbox'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

export const checkboxTestSuite: TestSuiteInfo<typeof checkboxScenePart> = {
  title: 'Angular Material v21 Checkbox',
  url: '/checkbox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('MatCheckbox', () => {
      const engine = useTestEngine(checkboxScenePart, getTestEngine, { beforeEach, afterEach });

      test('reports the initial checked state per instance', async () => {
        assertFalse(await engine().parts.terms.isSelected());
        assertTrue(await engine().parts.newsletter.isSelected());
      });

      // setSelected clicks the native input, so Material's (change) output
      // fires — the recorded state advances alongside the checked state.
      test('setSelected toggles the checkbox and reaches the change handler', async () => {
        await engine().parts.terms.setSelected(true);
        assertTrue(await engine().parts.terms.isSelected());
        assertEqual(await engine().parts.termsState.getText(), 'true');

        await engine().parts.terms.setSelected(false);
        assertFalse(await engine().parts.terms.isSelected());
        assertEqual(await engine().parts.termsState.getText(), 'false');
      });

      test('reports indeterminate via aria-checked="mixed"', async () => {
        assertTrue(await engine().parts.selectAll.isIndeterminate());
        assertFalse(await engine().parts.terms.isIndeterminate());
      });

      // Clicking an indeterminate checkbox resolves it to checked; the driver
      // routes through checked to reach unchecked.
      test('setSelected(false) resolves an indeterminate checkbox to unchecked', async () => {
        await engine().parts.selectAll.setSelected(false);
        assertFalse(await engine().parts.selectAll.isSelected());
        assertFalse(await engine().parts.selectAll.isIndeterminate());
      });

      test('setSelected(true) resolves an indeterminate checkbox to checked', async () => {
        await engine().parts.selectAll.setSelected(true);
        assertTrue(await engine().parts.selectAll.isSelected());
        assertFalse(await engine().parts.selectAll.isIndeterminate());
      });

      // isDisabled covers both the native disabled attribute and the
      // disabledInteractive flavor, which keeps the input focusable and
      // signals via aria-disabled instead.
      test('reports the disabled state for both disabled flavors', async () => {
        assertTrue(await engine().parts.disabled.isDisabled());
        assertTrue(await engine().parts.interactiveDisabled.isDisabled());
        assertFalse(await engine().parts.terms.isDisabled());
      });

      test('reports the required state', async () => {
        assertTrue(await engine().parts.required.isRequired());
        assertFalse(await engine().parts.terms.isRequired());
      });

      test('reads the value attribute', async () => {
        assertEqual(await engine().parts.terms.getValue(), 'terms');
        assertEqual(await engine().parts.bare.getValue(), null);
      });

      // Each checkbox resolves its own <label for>↔id association — two
      // instances never leak each other's label.
      test('reads each instance its own label', async () => {
        assertEqual(await engine().parts.terms.getLabel(), 'Accept terms');
        assertEqual(await engine().parts.newsletter.getLabel(), 'Subscribe to newsletter');
      });

      test('reports undefined label when the checkbox has no label content', async () => {
        assertEqual(await engine().parts.bare.getLabel(), undefined);
      });
    });
  },
};
