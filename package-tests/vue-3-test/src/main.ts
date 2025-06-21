import { createApp, h } from 'vue';

import { CounterComponent } from './Counter.example';

createApp({
  render: () => h(CounterComponent),
}).mount('#app');
