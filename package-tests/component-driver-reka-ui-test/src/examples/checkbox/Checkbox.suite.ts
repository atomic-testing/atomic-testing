import { CheckboxDriver } from '@atomic-testing/component-driver-reka-ui-v2';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const checkboxScenePart = {
  terms: {
    locator: byDataTestId('terms-checkbox'),
    driver: CheckboxDriver,
  },
  locked: {
    locator: byDataTestId('locked-checkbox'),
    driver: CheckboxDriver,
  },
  indeterminate: {
    locator: byDataTestId('indeterminate-checkbox'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

export const checkboxTestSuite: TestSuiteInfo<typeof checkboxScenePart> = {
  title: 'Reka UI Checkbox',
  url: '/checkbox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    describe('Reka UI Checkbox', () => {
      const engine = useTestEngine(checkboxScenePart, getTestEngine, { beforeEach, afterEach });

      test('starts unchecked', async () => {
        assertFalse(await engine().parts.terms.isSelected());
        assertFalse(await engine().parts.terms.isIndeterminate());
      });

      test('setSelected drives the model round-trip', async () => {
        await engine().parts.terms.setSelected(true);
        assertTrue(await engine().parts.terms.isSelected());

        await engine().parts.terms.setSelected(false);
        assertFalse(await engine().parts.terms.isSelected());
      });

      test('reads the indeterminate state and takes two clicks to reach unchecked', async () => {
        assertTrue(await engine().parts.indeterminate.isIndeterminate());
        await engine().parts.indeterminate.setSelected(false);
        assertFalse(await engine().parts.indeterminate.isSelected());
        assertFalse(await engine().parts.indeterminate.isIndeterminate());
      });

      test('reads the disabled state and no-ops setSelected on it', async () => {
        assertTrue(await engine().parts.locked.isDisabled());
        await engine().parts.locked.setSelected(true);
        assertFalse(await engine().parts.locked.isSelected());
      });
    });
  },
};
