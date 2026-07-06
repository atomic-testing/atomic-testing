import { createApp } from 'vue';

import { App } from './App';
import { primeVuePlugins } from './primevueSetup';

const app = createApp(App);
for (const plugin of primeVuePlugins) {
  if (Array.isArray(plugin)) {
    const [pluginInstance, ...pluginOptions] = plugin;
    app.use(pluginInstance, ...pluginOptions);
  } else {
    app.use(plugin);
  }
}
app.mount('#root');
