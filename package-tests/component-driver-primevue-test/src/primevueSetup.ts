import { VuePluginInput } from '@atomic-testing/vue-3';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';

/**
 * The single PrimeVue bootstrap shared by the browser app (`main.ts`) and the
 * jsdom test engine (`createPrimeVueTestEngine`): PrimeVue components refuse to
 * render without their config plugin installed on the hosting app, so both
 * environments must install the identical plugin set for the rendered DOM to
 * match.
 */
export const primeVuePlugins: VuePluginInput[] = [[PrimeVue, { theme: { preset: Aura } }]];
