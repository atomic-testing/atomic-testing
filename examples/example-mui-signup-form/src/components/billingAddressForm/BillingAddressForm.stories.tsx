import { Meta, StoryObj } from '@storybook/react';
import { BillingAddressForm } from './BillingAddressForm';

const meta: Meta<typeof BillingAddressForm> = {
  component: BillingAddressForm
};

export default meta;
type Story = StoryObj<typeof BillingAddressForm>;

export const Default: Story = {
  args: {}
};

export const PrefilledData: Story = {
  args: {
    data: {
      shipping: {
        lastName: 'Doe',
        firstName: 'John',
        address: {
          address: '1234 Elm St',
          city: 'Springfield',
          state: 'IL',
          zip: '62701'
        }
      }
    }
  }
};
