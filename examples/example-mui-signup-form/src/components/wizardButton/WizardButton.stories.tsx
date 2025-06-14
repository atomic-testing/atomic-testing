import { Meta, StoryObj } from '@storybook/react';
import { WizardButton } from './WizardButton';

const meta: Meta<typeof WizardButton> = {
  component: WizardButton
};

export default meta;
type Story = StoryObj<typeof WizardButton>;

export const Default: Story = {
  args: {}
};

export const FirstStep: Story = {
  args: {
    isFirstStep: true
  }
};

export const LastStep: Story = {
  args: {
    isLastStep: true
  }
};
