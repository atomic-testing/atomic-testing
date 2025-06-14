import { ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { getGoodCredentialMock } from '../../../models/__mocks__/signupModelMock';
import { createTestEngineForComponent } from '../../../utils/testUtil';
import { CredentialForm } from '../CredentialForm';
import { CredentialFormDriver, CredentialFormValue } from '../CredentialFormDriver';

const DataTestId = {
  form: 'credential-form'
} as const;

const parts = {
  form: {
    locator: byDataTestId(DataTestId.form),
    driver: CredentialFormDriver
  }
} satisfies ScenePart;

const goodCredentialEntry: CredentialFormValue = getGoodCredentialMock();

describe('CredentialForm', () => {
  let testEngine: TestEngine<typeof parts>;
  let onNext: jest.Mock;

  afterEach(async () => {
    await testEngine?.cleanUp();
  });

  describe('When starting from empty form', () => {
    beforeEach(() => {
      onNext = jest.fn();
      testEngine = createTestEngineForComponent(
        <CredentialForm data={{}} data-testid={DataTestId.form} onNextStep={onNext} />,
        parts
      );
    });

    test('There should not be error initially when the form is empty', async () => {
      const hasError = await testEngine.parts.form.hasError();
      expect(hasError).toBe(false);
    });

    describe('When clicking on Next button while the form is empty', () => {
      beforeEach(async () => {
        await testEngine.parts.form.next();
      });

      test('There should be errors in the form', async () => {
        const hasError = await testEngine.parts.form.hasError();
        expect(hasError).toBe(true);
      });

      test('onNextStep should not be called', () => {
        expect(onNext).toHaveBeenCalledTimes(0);
      });
    });

    describe('When entering good submission data, and click Next button', () => {
      beforeEach(async () => {
        await testEngine.parts.form.setValue(goodCredentialEntry);
        await testEngine.parts.form.next();
      });

      test('There should not be any errors in the form', async () => {
        const hasError = await testEngine.parts.form.hasError();
        expect(hasError).toBe(false);
      });

      test('onNextStep should be called once', () => {
        expect(onNext).toHaveBeenCalledTimes(1);
      });

      test('onNextStep should be called with submission data', () => {
        expect(onNext).toHaveBeenLastCalledWith({
          credential: goodCredentialEntry
        });
      });
    });
  });
});
