import { ScenePart, byDataTestId } from '@atomic-testing/core';
import { createRenderedTestEngine } from '@atomic-testing/react';
import { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import { getGoodCredentialMock } from '../../models/__mocks__/signupModelMock';
import { CredentialForm } from './CredentialForm';
import { CredentialFormDriver, CredentialFormValue } from './CredentialFormDriver';

const meta: Meta<typeof CredentialForm> = {
  component: CredentialForm
};

export default meta;
type Story = StoryObj<typeof CredentialForm>;

const dataTestId = 'credential-form';
const parts = {
  form: {
    locator: byDataTestId(dataTestId),
    driver: CredentialFormDriver
  }
} satisfies ScenePart;

const goodCredentialEntry: CredentialFormValue = getGoodCredentialMock();

export const Default: Story = {
  args: {
    onNextStep: fn()
  }
};

export const DefaultTest: Story = {
  args: {
    onNextStep: fn(),
    'data-testid': dataTestId
  },
  play: async ({ args, canvasElement, step }) => {
    const testEngine = createRenderedTestEngine(canvasElement, parts);

    await step('Initially the form should have no errors', async () => {
      const hasError = await testEngine.parts.form.hasError();
      expect(hasError, 'form hasError should be false').toBe(false);
    });

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
      await testEngine.parts.form.setValue(goodCredentialEntry);
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
      credential: {
        email: 'tangent@usa.net',
        password: 'password',
        birthday: '1990-01-01'
      }
    }
  }
};
