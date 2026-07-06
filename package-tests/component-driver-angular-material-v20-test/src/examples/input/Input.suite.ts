import { InputDriver } from '@atomic-testing/component-driver-angular-material-v20';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const inputScenePart = {
  name: {
    locator: byDataTestId('name-field'),
    driver: InputDriver,
  },
  email: {
    locator: byDataTestId('email-field'),
    driver: InputDriver,
  },
  bio: {
    locator: byDataTestId('bio-field'),
    driver: InputDriver,
  },
  disabled: {
    locator: byDataTestId('disabled-field'),
    driver: InputDriver,
  },
  readonly: {
    locator: byDataTestId('readonly-field'),
    driver: InputDriver,
  },
} satisfies ScenePart;

export const inputTestSuite: TestSuiteInfo<typeof inputScenePart> = {
  title: 'Angular Material v20 Input',
  url: '/input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('MatInput in MatFormField', () => {
      const engine = useTestEngine(inputScenePart, getTestEngine, { beforeEach, afterEach });

      test('sets and reads the value of a single-line field', async () => {
        assertEqual(await engine().parts.name.getValue(), '');
        await engine().parts.name.setValue('Jane Doe');
        assertEqual(await engine().parts.name.getValue(), 'Jane Doe');
      });

      test('sets and reads the value of a multiline (textarea) field', async () => {
        await engine().parts.bio.setValue('Tester of components');
        assertEqual(await engine().parts.bio.getValue(), 'Tester of components');
      });

      // Each field resolves its own <label for>↔id association — two fields
      // never leak each other's label; the required marker is CSS-generated
      // content and never part of the text.
      test('reads each field its own label', async () => {
        assertEqual(await engine().parts.name.getLabel(), 'Full name');
        assertEqual(await engine().parts.email.getLabel(), 'Email');
      });

      test('reads the hint text and reports undefined when there is none', async () => {
        assertEqual(await engine().parts.name.getHintText(), 'First and last name');
        assertEqual(await engine().parts.bio.getHintText(), undefined);
      });

      // The email field is seeded with an invalid touched value, so it is in
      // the error state from the start.
      test('reports the error state and error text', async () => {
        assertTrue(await engine().parts.email.isError());
        assertEqual(await engine().parts.email.getErrorText(), 'Please enter a valid email address');
        assertFalse(await engine().parts.name.isError());
        assertEqual(await engine().parts.name.getErrorText(), undefined);
      });

      test('clears the error state once a valid value is entered', async () => {
        await engine().parts.email.setValue('jane@example.com');
        // The error clears when Angular re-runs validation and change
        // detection; probe rather than assert immediately.
        const stillError = await engine().parts.email.waitUntil({
          probeFn: () => engine().parts.email.isError(),
          terminateCondition: false,
          timeoutMs: 2000,
        });
        assertFalse(stillError);
        assertEqual(await engine().parts.email.getErrorText(), undefined);
      });

      test('reports the required state', async () => {
        assertTrue(await engine().parts.email.isRequired());
        assertFalse(await engine().parts.name.isRequired());
      });

      test('reports the disabled state', async () => {
        assertTrue(await engine().parts.disabled.isDisabled());
        assertFalse(await engine().parts.name.isDisabled());
        assertEqual(await engine().parts.disabled.getValue(), 'Locked value');
      });

      test('reports the readonly state', async () => {
        assertTrue(await engine().parts.readonly.isReadonly());
        assertFalse(await engine().parts.name.isReadonly());
        assertEqual(await engine().parts.readonly.getValue(), 'Fixed value');
      });
    });
  },
};
