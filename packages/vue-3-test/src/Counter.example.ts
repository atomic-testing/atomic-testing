import CounterComponent from './Counter.vue';
import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, IExampleUIUnit, ScenePart } from '@atomic-testing/core';

export const counterExampleUI: IExampleUIUnit<typeof CounterComponent> = {
  title: 'Counter',
  ui: CounterComponent,
};

export const counterScene = {
  button: {
    locator: byDataTestId('counter'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

export const counterExample: IExampleUnit<typeof counterScene, typeof CounterComponent> = {
  ...counterExampleUI,
  scene: counterScene,
};
