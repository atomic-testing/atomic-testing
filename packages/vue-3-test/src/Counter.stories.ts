import type { Meta, StoryObj } from '@storybook/vue3';
import CounterComponent from './Counter.vue';

const meta: Meta<typeof CounterComponent> = {
  component: CounterComponent,
};

export default meta;
export type Story = StoryObj<typeof CounterComponent>;

export const Default: Story = {};
