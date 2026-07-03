import { IExampleUIUnit } from '@atomic-testing/core';
import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';
import { JSX } from 'react';

import { accordionUIExample } from './examples/accordion/Accordion.examples';
import { alertDialogUIExample } from './examples/alert-dialog/AlertDialog.examples';
import { aspectRatioUIExample } from './examples/aspect-ratio/AspectRatio.examples';
import { avatarUIExample } from './examples/avatar/Avatar.examples';
import { checkboxUIExample } from './examples/checkbox/Checkbox.examples';
import { collapsibleUIExample } from './examples/collapsible/Collapsible.examples';
import { contextMenuUIExample } from './examples/context-menu/ContextMenu.examples';
import { dialogUIExample } from './examples/dialog/Dialog.examples';
import { dropdownMenuUIExample } from './examples/dropdown-menu/DropdownMenu.examples';
import { hoverCardUIExample } from './examples/hover-card/HoverCard.examples';
import { labelUIExample } from './examples/label/Label.examples';
import { menubarUIExample } from './examples/menubar/Menubar.examples';
import { navigationMenuUIExample } from './examples/navigation-menu/NavigationMenu.examples';
import { oneTimePasswordFieldUIExample } from './examples/one-time-password-field/OneTimePasswordField.examples';
import { passwordToggleFieldUIExample } from './examples/password-toggle-field/PasswordToggleField.examples';
import { popoverUIExample } from './examples/popover/Popover.examples';
import { progressUIExample } from './examples/progress/Progress.examples';
import { radioGroupUIExample } from './examples/radio-group/RadioGroup.examples';
import { scrollAreaUIExample } from './examples/scroll-area/ScrollArea.examples';
import { selectUIExample } from './examples/select/Select.examples';
import { separatorUIExample } from './examples/separator/Separator.examples';
import { sliderUIExample } from './examples/slider/Slider.examples';
import { switchUIExample } from './examples/switch/Switch.examples';
import { tabsUIExample } from './examples/tabs/Tabs.examples';
import { toastUIExample } from './examples/toast/Toast.examples';
import { toggleGroupUIExample } from './examples/toggle-group/ToggleGroup.examples';
import { toggleUIExample } from './examples/toggle/Toggle.examples';
import { toolbarUIExample } from './examples/toolbar/Toolbar.examples';
import { tooltipUIExample } from './examples/tooltip/Tooltip.examples';

const toc = (label: string, path: string, example: IExampleUIUnit<JSX.Element>): ExampleToc => ({
  label,
  path,
  ui: <ExampleList examples={[example]} />,
});

export const tocs: ExampleToc[] = [
  toc('Separator', '/separator', separatorUIExample),
  // Wave 2 (#1004)
  toc('Checkbox', '/checkbox', checkboxUIExample),
  toc('RadioGroup', '/radio-group', radioGroupUIExample),
  toc('Switch', '/switch', switchUIExample),
  toc('Toggle', '/toggle', toggleUIExample),
  toc('ToggleGroup', '/toggle-group', toggleGroupUIExample),
  toc('Tabs', '/tabs', tabsUIExample),
  toc('Label', '/label', labelUIExample),
  toc('Progress', '/progress', progressUIExample),
  toc('AspectRatio', '/aspect-ratio', aspectRatioUIExample),
  toc('Avatar', '/avatar', avatarUIExample),
  toc('Collapsible', '/collapsible', collapsibleUIExample),
  toc('Accordion', '/accordion', accordionUIExample),
  // Wave 4 (#1006)
  toc('Slider', '/slider', sliderUIExample),
  toc('ScrollArea', '/scroll-area', scrollAreaUIExample),
  toc('PasswordToggleField', '/password-toggle-field', passwordToggleFieldUIExample),
  toc('OneTimePasswordField', '/one-time-password-field', oneTimePasswordFieldUIExample),
  // Wave 1 (#1003)
  toc('Dialog', '/dialog', dialogUIExample),
  toc('DropdownMenu', '/dropdown-menu', dropdownMenuUIExample),
  toc('Popover', '/popover', popoverUIExample),
  toc('Select', '/select', selectUIExample),
  // Wave 3 (#1005)
  toc('AlertDialog', '/alert-dialog', alertDialogUIExample),
  toc('ContextMenu', '/context-menu', contextMenuUIExample),
  toc('HoverCard', '/hover-card', hoverCardUIExample),
  toc('Menubar', '/menubar', menubarUIExample),
  toc('NavigationMenu', '/navigation-menu', navigationMenuUIExample),
  toc('Toast', '/toast', toastUIExample),
  toc('Toolbar', '/toolbar', toolbarUIExample),
  toc('Tooltip', '/tooltip', tooltipUIExample),
];
