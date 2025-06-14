import { Meta, StoryObj } from '@storybook/react';
import { userInterests } from '../../data/userInterests';
import { SignupReview } from './SignupReview';

const meta: Meta<typeof SignupReview> = {
  component: SignupReview
};

export default meta;
type Story = StoryObj<typeof SignupReview>;

export const PrefilledData: Story = {
  args: {
    data: {
      credential: {
        email: 'tangent@usa.net',
        password: 'password',
        birthday: '1990-01-01'
      },
      shipping: {
        lastName: 'Doe',
        firstName: 'John',
        address: {
          address: '1234 Elm St',
          city: 'Springfield',
          state: 'IL',
          zip: '62701'
        }
      },
      billing: {
        sameAsShipping: true,
        address: {
          address: '1234 Elm St',
          city: 'Springfield',
          state: 'IL',
          zip: '62701'
        }
      },
      interest: {
        interestIds: [userInterests[0].id, userInterests[2].id]
      }
    }
  }
};
