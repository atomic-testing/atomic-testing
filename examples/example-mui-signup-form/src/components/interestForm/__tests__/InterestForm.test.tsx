import { byDataTestId, ScenePart, TestEngine } from '@atomic-testing/core';
import { DeepPartial } from 'react-hook-form';
import {
  getGoodBillingMock,
  getGoodCredentialMock,
  getGoodInterestMock,
  getGoodShippingMock
} from '../../../models/__mocks__/signupModelMock';
import { InterestModel, SignupModel } from '../../../models/SignupModel';
import { createTestEngineForComponent } from '../../../utils/testUtil';
import { InterestForm } from '../InterestForm';
import { InterestFormDriver } from '../InterestFormDriver';

const DataTestId = {
  form: 'interest-form'
} as const;

const parts = {
  form: {
    locator: byDataTestId(DataTestId.form),
    driver: InterestFormDriver
  }
} satisfies ScenePart;

const emptyData: DeepPartial<SignupModel> = {
  credential: getGoodCredentialMock(),
  shipping: getGoodShippingMock(),
  billing: getGoodBillingMock()
};

const goodInterestEntry: InterestModel = getGoodInterestMock();

describe('InterestForm', () => {
  let testEngine: TestEngine<typeof parts>;
  let onNext: jest.Mock;
  let onPrevious: jest.Mock;

  afterEach(async () => {
    await testEngine?.cleanUp();
  });

  describe('When starting from empty form', () => {
    beforeEach(() => {
      onNext = jest.fn();
      onPrevious = jest.fn();
      testEngine = createTestEngineForComponent(
        <InterestForm data={emptyData} data-testid={DataTestId.form} onNextStep={onNext} onPreviousStep={onPrevious} />,
        parts
      );
    });

    test('There should not be error initially when the form is empty', async () => {
      const hasError = await testEngine.parts.form.hasError();
      expect(hasError).toBe(false);
    });

    describe.each([
      ['Previous', 'onPreviousStep'],
      ['Next', 'onNextStep']
    ])('When clicking on %s button while the form is empty', (button, callbackName) => {
      let handleToCheck: jest.Mock;
      beforeEach(async () => {
        if (button === 'Previous') {
          await testEngine.parts.form.previous();
        } else {
          await testEngine.parts.form.next();
        }
        handleToCheck = button === 'Previous' ? onPrevious : onNext;
      });

      test('There should be errors in the form', async () => {
        const hasError = await testEngine.parts.form.hasError();
        expect(hasError).toBe(true);
      });

      test(`${callbackName} should not be called`, () => {
        expect(handleToCheck).toHaveBeenCalledTimes(0);
      });

      describe(`When entering good submission data, and click the ${button} button`, () => {
        beforeEach(async () => {
          await testEngine.parts.form.setValue(goodInterestEntry);
          if (button === 'Previous') {
            await testEngine.parts.form.previous();
          } else {
            await testEngine.parts.form.next();
          }
        });

        test('There should not be any errors in the form', async () => {
          const hasError = await testEngine.parts.form.hasError();
          expect(hasError).toBe(false);
        });

        test(`${callbackName} should be called once`, () => {
          expect(handleToCheck).toHaveBeenCalledTimes(1);
        });

        test(`${callbackName} should be called with submission data`, () => {
          expect(handleToCheck).toHaveBeenLastCalledWith({
            ...emptyData,
            interest: goodInterestEntry
          });
        });
      });
    });
  });
});
