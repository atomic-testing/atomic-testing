import { Type } from '@angular/core';

import { ButtonExampleComponent } from './examples/button/Button.examples';

export interface ExampleEntry {
  readonly title: string;
  readonly url: string;
  readonly component: Type<unknown>;
}

/**
 * Maps each example URL (the suite's e2e navigation target) to the standalone
 * component rendering it — the Angular counterpart of the React test apps'
 * `directory.tsx`.
 */
export const directory: ReadonlyArray<ExampleEntry> = [
  { title: 'Button', url: '/button', component: ButtonExampleComponent },
];
