import { Component } from 'vue';

import { CheckboxExample } from './examples/checkbox/Checkbox.examples';
import { DialogExample } from './examples/dialog/Dialog.examples';
import { DropdownMenuExample } from './examples/dropdown-menu/DropdownMenu.examples';
import { PopoverExample } from './examples/popover/Popover.examples';
import { RadioGroupExample } from './examples/radio-group/RadioGroup.examples';
import { SelectExample } from './examples/select/Select.examples';
import { SeparatorExample } from './examples/separator/Separator.examples';
import { SliderExample } from './examples/slider/Slider.examples';
import { SwitchExample } from './examples/switch/Switch.examples';
import { TabsExample } from './examples/tabs/Tabs.examples';
import { ToggleGroupExample } from './examples/toggle-group/ToggleGroup.examples';
import { ToggleExample } from './examples/toggle/Toggle.examples';
import { TooltipExample } from './examples/tooltip/Tooltip.examples';

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
  { path: '/radio-group', title: 'RadioGroup', component: RadioGroupExample },
  { path: '/toggle-group', title: 'ToggleGroup', component: ToggleGroupExample },
  { path: '/tabs', title: 'Tabs', component: TabsExample },
  { path: '/slider', title: 'Slider', component: SliderExample },
  { path: '/dialog', title: 'Dialog', component: DialogExample },
  { path: '/popover', title: 'Popover', component: PopoverExample },
  { path: '/tooltip', title: 'Tooltip', component: TooltipExample },
  { path: '/select', title: 'Select', component: SelectExample },
  { path: '/dropdown-menu', title: 'DropdownMenu', component: DropdownMenuExample },
];
