import { Component } from 'vue';

import { ButtonExample } from './examples/button/Button.examples';
import { CheckboxExample } from './examples/checkbox/Checkbox.examples';
import { InputTextExample } from './examples/input-text/InputText.examples';
import { RadioButtonExample } from './examples/radio-button/RadioButton.examples';
import { SliderExample } from './examples/slider/Slider.examples';
import { ToggleSwitchExample } from './examples/toggle-switch/ToggleSwitch.examples';

export interface DirectoryEntry {
  path: string;
  title: string;
  component: Component;
}

/**
 * Maps each suite's e2e `url` to the example component rendered there. The
 * Playwright leg navigates by full page load, so a pathname switch in `App`
 * is all the routing this app needs.
 */
export const directory: DirectoryEntry[] = [
  { path: '/button', title: 'Button', component: ButtonExample },
  { path: '/input-text', title: 'InputText', component: InputTextExample },
  { path: '/checkbox', title: 'Checkbox', component: CheckboxExample },
  { path: '/radio-button', title: 'RadioButton', component: RadioButtonExample },
  { path: '/toggle-switch', title: 'ToggleSwitch', component: ToggleSwitchExample },
  { path: '/slider', title: 'Slider', component: SliderExample },
];
