import { IExampleUIUnit } from '@atomic-testing/core';
import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';
import { JSX } from 'react';

import { contextMenuUIExample } from './examples/context-menu/ContextMenu.examples';
import { dialogUIExample } from './examples/dialog/Dialog.examples';
import { dropdownMenuUIExample } from './examples/dropdown-menu/DropdownMenu.examples';
import { oneTimePasswordFieldUIExample } from './examples/one-time-password-field/OneTimePasswordField.examples';
import { passwordToggleFieldUIExample } from './examples/password-toggle-field/PasswordToggleField.examples';
import { popoverUIExample } from './examples/popover/Popover.examples';
import { scrollAreaUIExample } from './examples/scroll-area/ScrollArea.examples';
import { selectUIExample } from './examples/select/Select.examples';
import { separatorUIExample } from './examples/separator/Separator.examples';
import { sliderUIExample } from './examples/slider/Slider.examples';
import { tabsUIExample } from './examples/tabs/Tabs.examples';
import { tooltipUIExample } from './examples/tooltip/Tooltip.examples';

const toc = (label: string, path: string, example: IExampleUIUnit<JSX.Element>): ExampleToc => ({
  label,
  path,
  ui: <ExampleList examples={[example]} />,
});

export const tocs: ExampleToc[] = [
  toc('Separator', '/separator', separatorUIExample),
  // Wave 4 (#1006)
  toc('Slider', '/slider', sliderUIExample),
  toc('ScrollArea', '/scroll-area', scrollAreaUIExample),
  toc('PasswordToggleField', '/password-toggle-field', passwordToggleFieldUIExample),
  toc('OneTimePasswordField', '/one-time-password-field', oneTimePasswordFieldUIExample),
  // Wave 0 audit scenes
  toc('Tabs', '/tabs', tabsUIExample),
  toc('ContextMenu', '/context-menu', contextMenuUIExample),
  toc('Dialog', '/dialog', dialogUIExample),
  toc('DropdownMenu', '/dropdown-menu', dropdownMenuUIExample),
  toc('Popover', '/popover', popoverUIExample),
  toc('Tooltip', '/tooltip', tooltipUIExample),
  toc('Select', '/select', selectUIExample),
];
