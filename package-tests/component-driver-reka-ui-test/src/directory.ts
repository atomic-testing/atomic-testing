import { Component } from 'vue';

import { CheckboxExample } from './examples/checkbox/Checkbox.examples';
import { SeparatorExample } from './examples/separator/Separator.examples';
import { SwitchExample } from './examples/switch/Switch.examples';
import { ToggleExample } from './examples/toggle/Toggle.examples';

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
  { path: '/separator', title: 'Separator', component: SeparatorExample },
  { path: '/switch', title: 'Switch', component: SwitchExample },
  { path: '/checkbox', title: 'Checkbox', component: CheckboxExample },
  { path: '/toggle', title: 'Toggle', component: ToggleExample },
];
