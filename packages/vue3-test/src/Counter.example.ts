import { defineComponent, h, ref } from 'vue';
import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, IExampleUIUnit, ScenePart } from '@atomic-testing/core';

export const CounterComponent = defineComponent({
  name: 'CounterComponent',
  setup() {
    const count = ref(0);
    const inc = () => {
      count.value += 1;
    };
    return () =>
      h(
        'button',
        {
          'data-testid': 'counter',
          onClick: inc,
        },
        `Count: ${count.value}`,
      );
  },
});

export const counterExampleUI: IExampleUIUnit<ReturnType<typeof defineComponent>> = {
  title: 'Counter',
  ui: CounterComponent,
};

export const counterScene = {
  button: {
    locator: byDataTestId('counter'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

export const counterExample: IExampleUnit<typeof counterScene, ReturnType<typeof defineComponent>> = {
  ...counterExampleUI,
  scene: counterScene,
};
