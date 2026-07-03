import { HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { withTestEngine } from '@atomic-testing/storybook';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { EchoForm } from './EchoForm';

const meta: Meta<typeof EchoForm> = {
  component: EchoForm,
};
export default meta;

type Story = StoryObj<typeof EchoForm>;

const parts = {
  input: { locator: byDataTestId('echo-input'), driver: HTMLTextInputDriver },
  output: { locator: byDataTestId('echo-output'), driver: HTMLElementDriver },
} satisfies ScenePart;

export const TypedTextEchoes: Story = {
  play: withTestEngine(parts, async ({ engine }) => {
    await engine.parts.input.setValue('hello storybook');
    expect(await engine.parts.input.getValue()).toBe('hello storybook');
    expect(await engine.parts.output.getText()).toBe('hello storybook');
  }),
};
