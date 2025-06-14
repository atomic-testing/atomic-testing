import { ScenePart, byDataTestId } from '@atomic-testing/core';
import { createRenderedTestEngine } from '@atomic-testing/react';
import { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import { ShippingModel } from '../../models/SignupModel';
import { getGoodShippingMock } from '../../models/__mocks__/signupModelMock';
import { ShippingAddressForm } from './ShippingAddressForm';
import { ShippingAddressFormDriver } from './ShippingAddressFormDriver';

const meta: Meta<typeof ShippingAddressForm> = {
  component: ShippingAddressForm
};

export default meta;
type Story = StoryObj<typeof ShippingAddressForm>;

const dataTestId = 'shipping-form';
const parts = {
  form: {
    locator: byDataTestId(dataTestId),
    driver: ShippingAddressFormDriver
  }
} satisfies ScenePart;

const goodShippingEntry: ShippingModel = getGoodShippingMock();

export const Default: Story = {
  args: {}
};

export const DefaultTest: Story = {
  args: {
    'data-testid': dataTestId,
    onNextStep: fn(),
    onPreviousStep: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const testEngine = createRenderedTestEngine(canvasElement, parts);

    await step(
      'Click on the Next button while nothing has been filled in, error should show and onNextStep should not be called',
      async () => {
        await testEngine.parts.form.next();
        const hasError = await testEngine.parts.form.hasError();
        expect(hasError, 'form hasError should be true').toBe(true);
        expect(args.onNextStep, 'onNextStep should not be called').not.toHaveBeenCalled();
      }
    );

    await step('Filling in correct data and click next', async () => {
      await testEngine.parts.form.setValue(goodShippingEntry);
      await testEngine.parts.form.next();
      const hasError = await testEngine.parts.form.hasError();
      expect(hasError, 'form hasError should be false').toBe(false);
      expect(args.onNextStep, 'onNextStep should have been called once').toHaveBeenCalledTimes(1);
    });
  }
};

export const PrefilledData: Story = {
  args: {
    data: {
      shipping: goodShippingEntry
    }
  }
};
