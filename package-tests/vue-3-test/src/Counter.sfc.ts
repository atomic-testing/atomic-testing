import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, IExampleUIUnit, ScenePart } from '@atomic-testing/core';
import { VueSFCLikeComponent } from '@atomic-testing/vue-3';
import { ref } from 'vue';

export const CounterSFCComponent: VueSFCLikeComponent = {
  name: 'CounterSFCComponent',
  template: `<button data-testid="counter" @click="inc">Count: {{ count }}</button>`,
  setup() {
    const count = ref(0);
    const inc = () => {
      count.value += 1;
    };
    return {
      count,
      inc
    };
  }
};

export const counterSFCExampleUI: IExampleUIUnit<VueSFCLikeComponent> = {
  title: 'Counter SFC',
  ui: CounterSFCComponent,
};

export const counterSFCScene = {
  button: {
    locator: byDataTestId('counter'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

export const counterSFCExample: IExampleUnit<typeof counterSFCScene, VueSFCLikeComponent> = {
  ...counterSFCExampleUI,
  scene: counterSFCScene,
};