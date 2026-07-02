import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { withDriver } from '@atomic-testing/storybook';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { CounterButton } from './CounterButton';

const meta: Meta<typeof CounterButton> = {
  component: CounterButton,
};
export default meta;

type Story = StoryObj<typeof CounterButton>;

export const ClicksIncrement: Story = {
  args: { label: 'Clicked' },
  play: withDriver(HTMLButtonDriver, async ({ driver, args }) => {
    expect(await driver.getText()).toBe(`${args.label}: 0`);
    await driver.click();
    expect(await driver.getText()).toBe(`${args.label}: 1`);
    await driver.click();
    expect(await driver.getText()).toBe(`${args.label}: 2`);
  }),
};
