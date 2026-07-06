import { Type } from '@angular/core';

import { AutocompleteExampleComponent } from './examples/autocomplete/Autocomplete.examples';
import { ButtonExampleComponent } from './examples/button/Button.examples';
import { CheckboxExampleComponent } from './examples/checkbox/Checkbox.examples';
import { DialogExampleComponent } from './examples/dialog/Dialog.examples';
import { InputExampleComponent } from './examples/input/Input.examples';
import { MenuExampleComponent } from './examples/menu/Menu.examples';
import { RadioExampleComponent } from './examples/radio/Radio.examples';
import { SelectExampleComponent } from './examples/select/Select.examples';
import { SlideToggleExampleComponent } from './examples/slideToggle/SlideToggle.examples';
import { SnackbarExampleComponent } from './examples/snackbar/Snackbar.examples';
import { TableExampleComponent } from './examples/table/Table.examples';
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
  { title: 'Autocomplete', url: '/autocomplete', component: AutocompleteExampleComponent },
  { title: 'Button', url: '/button', component: ButtonExampleComponent },
  { title: 'Checkbox', url: '/checkbox', component: CheckboxExampleComponent },
  { title: 'Dialog', url: '/dialog', component: DialogExampleComponent },
  { title: 'Input', url: '/input', component: InputExampleComponent },
  { title: 'Menu', url: '/menu', component: MenuExampleComponent },
  { title: 'Radio', url: '/radio', component: RadioExampleComponent },
  { title: 'Select', url: '/select', component: SelectExampleComponent },
  { title: 'Slide Toggle', url: '/slide-toggle', component: SlideToggleExampleComponent },
  { title: 'Snackbar', url: '/snackbar', component: SnackbarExampleComponent },
  { title: 'Table', url: '/table', component: TableExampleComponent },
  { title: 'Tabs', url: '/tabs', component: TabsExampleComponent },
];
