import { ScenePart, byDataTestId } from '@atomic-testing/core';
import { createRenderedTestEngine } from '@atomic-testing/react';
import { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import { userInterests } from '../../data/userInterests';
import { getGoodInterestMock } from '../../models/__mocks__/signupModelMock';
import { InterestForm } from './InterestForm';
import { InterestFormDriver } from './InterestFormDriver';

const meta: Meta<typeof InterestForm> = {
  component: InterestForm
};

export default meta;
type Story = StoryObj<typeof InterestForm>;

const dataTestId = 'interest-form';
const parts = {
  form: {
    locator: byDataTestId(dataTestId),
    driver: InterestFormDriver
  }
} satisfies ScenePart;
const goodInterestEntry = getGoodInterestMock();

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
      await testEngine.parts.form.setValue(goodInterestEntry);
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
      interest: {
        interestIds: [userInterests[0].id, userInterests[2].id]
      }
    }
  }
};
