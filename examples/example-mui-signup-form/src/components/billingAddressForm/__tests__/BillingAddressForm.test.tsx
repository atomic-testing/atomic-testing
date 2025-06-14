import { ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { DeepPartial } from 'utility-types';
import { BillingModel, SignupModel } from '../../../models/SignupModel';
import { getGoodAlternateAddressMock } from '../../../models/__mocks__/addressMock';
import {
  getGoodBillingMock,
  getGoodCredentialMock,
  getGoodShippingMock
} from '../../../models/__mocks__/signupModelMock';
import { createTestEngineForComponent } from '../../../utils/testUtil';
import { BillingAddressForm } from '../BillingAddressForm';
import { BillingAddressFormDriver } from '../BillingAddressFormDriver';

const DataTestId = {
  form: 'shipping-form'
} as const;

const parts = {
  form: {
    locator: byDataTestId(DataTestId.form),
    driver: BillingAddressFormDriver
  }
} satisfies ScenePart;

const emptyData: DeepPartial<SignupModel> = {
  credential: getGoodCredentialMock(),
  shipping: getGoodShippingMock()
};

const goodBillingEntry: BillingModel = getGoodBillingMock();

describe('BillingForm', () => {
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
        <BillingAddressForm
          data={emptyData}
          data-testid={DataTestId.form}
          onNextStep={onNext}
          onPreviousStep={onPrevious}
        />,
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

      describe('When entering good submission data, and click Next button', () => {
        beforeEach(async () => {
          await testEngine.parts.form.setValue(goodBillingEntry);
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
            billing: goodBillingEntry
          });
        });
      });

      describe('When toggle on the same address switch', () => {
        beforeEach(async () => {
          await testEngine.parts.form.useSameBillAddress();
          if (button === 'Previous') {
            await testEngine.parts.form.previous();
          } else {
            await testEngine.parts.form.next();
          }
        });

        test('Address form should be disabled', async () => {
          const isDisabled = await testEngine.parts.form.isAddressDisabled();
          expect(isDisabled).toBe(true);
        });

        test('Form should not have error', async () => {
          const hasError = await testEngine.parts.form.hasError();
          expect(hasError).toBe(false);
        });

        test('Address should be the same as the shipping address', async () => {
          const billing = await testEngine.parts.form.getValue();
          const address = billing.address;
          expect(address).toEqual(emptyData.shipping?.address);
        });

        describe('When toggle off the same address switch', () => {
          const alternateAddress = getGoodAlternateAddressMock();
          beforeEach(async () => {
            await testEngine.parts.form.useDifferentBillAddress(alternateAddress);
            if (button === 'Previous') {
              await testEngine.parts.form.previous();
            } else {
              await testEngine.parts.form.next();
            }
          });

          test('Address form should not be disabled', async () => {
            const isDisabled = await testEngine.parts.form.isAddressDisabled();
            expect(isDisabled).toBe(false);
          });

          test('Form should not have error', async () => {
            const hasError = await testEngine.parts.form.hasError();
            expect(hasError).toBe(false);
          });

          test('Address should be different from shipping address', async () => {
            const billing = await testEngine.parts.form.getValue();
            const address = billing.address;
            expect(address).not.toEqual(emptyData.shipping?.address);
          });
        });
      });
    });
  });
});
