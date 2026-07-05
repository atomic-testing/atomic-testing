import { InputTextDriver } from '@atomic-testing/component-driver-primevue-v4';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const inputTextScenePart = {
  firstName: {
    locator: byDataTestId('first-name'),
    driver: InputTextDriver,
  },
  lastName: {
    locator: byDataTestId('last-name'),
    driver: InputTextDriver,
  },
  disabled: {
    locator: byDataTestId('disabled-input'),
    driver: InputTextDriver,
  },
  readonly: {
    locator: byDataTestId('readonly-input'),
    driver: InputTextDriver,
  },
  strict: {
    locator: byDataTestId('strict-input'),
    driver: InputTextDriver,
  },
} satisfies ScenePart;

export const inputTextTestSuite: TestSuiteInfo<typeof inputTextScenePart> = {
  title: 'PrimeVue InputText',
  url: '/input-text',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('PrimeVue InputText', () => {
      const engine = useTestEngine(inputTextScenePart, getTestEngine, { beforeEach, afterEach });

      test('setValue/getValue round-trip', async () => {
        assertEqual(await engine().parts.firstName.getValue(), '');
        assertTrue(await engine().parts.firstName.setValue('Ada'));
        assertEqual(await engine().parts.firstName.getValue(), 'Ada');
      });

      test('two instances keep independent values', async () => {
        await engine().parts.firstName.setValue('Ada');
        assertEqual(await engine().parts.firstName.getValue(), 'Ada');
        assertEqual(await engine().parts.lastName.getValue(), 'Smith');
      });

      test('reads the disabled state', async () => {
        assertFalse(await engine().parts.firstName.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });

      test('reads the readonly state', async () => {
        assertFalse(await engine().parts.firstName.isReadonly());
        assertTrue(await engine().parts.readonly.isReadonly());
      });

      test('reads required and invalid states', async () => {
        assertFalse(await engine().parts.firstName.isRequired());
        assertFalse(await engine().parts.firstName.isError());
        assertTrue(await engine().parts.strict.isRequired());
        assertTrue(await engine().parts.strict.isError());
      });
    });
  },
};
