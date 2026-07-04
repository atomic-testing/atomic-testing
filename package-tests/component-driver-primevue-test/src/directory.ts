import { Component } from 'vue';

import { ButtonExample } from './examples/button/Button.examples';

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
export const directory: DirectoryEntry[] = [{ path: '/button', title: 'Button', component: ButtonExample }];
