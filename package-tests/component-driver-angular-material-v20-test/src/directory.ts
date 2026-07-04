import { Type } from '@angular/core';

import { ButtonExampleComponent } from './examples/button/Button.examples';
import { CheckboxExampleComponent } from './examples/checkbox/Checkbox.examples';
import { InputExampleComponent } from './examples/input/Input.examples';
import { RadioExampleComponent } from './examples/radio/Radio.examples';
import { SlideToggleExampleComponent } from './examples/slideToggle/SlideToggle.examples';
import { TabsExampleComponent } from './examples/tabs/Tabs.examples';

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
  { title: 'Checkbox', url: '/checkbox', component: CheckboxExampleComponent },
  { title: 'Input', url: '/input', component: InputExampleComponent },
  { title: 'Radio', url: '/radio', component: RadioExampleComponent },
  { title: 'Slide Toggle', url: '/slide-toggle', component: SlideToggleExampleComponent },
  { title: 'Tabs', url: '/tabs', component: TabsExampleComponent },
];
