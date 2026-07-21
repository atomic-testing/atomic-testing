import { IExampleUIUnit } from '@atomic-testing/core';
import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';
import { JSX } from 'react';

import { accordionUIExample } from './examples/accordion/Accordion.examples';
import { alertUIExample } from './examples/alert/Alert.examples';
import { avatarUIExample } from './examples/avatar/Avatar.examples';
import { badgeUIExample } from './examples/badge/Badge.examples';
import { breadcrumbUIExample } from './examples/breadcrumb/Breadcrumb.examples';
import { buttonUIExample } from './examples/button/Button.examples';
import { cardUIExample } from './examples/card/Card.examples';
import { carouselUIExample } from './examples/carousel/Carousel.examples';
import { checkboxUIExample } from './examples/checkbox/Checkbox.examples';
import { colorPickerUIExample } from './examples/color-picker/ColorPicker.examples';
import { comboboxUIExample } from './examples/combobox/Combobox.examples';
import { compoundButtonUIExample } from './examples/compound-button/CompoundButton.examples';
import { dataGridUIExample } from './examples/data-grid/DataGrid.examples';
import { dialogUIExample } from './examples/dialog/Dialog.examples';
import { dividerUIExample } from './examples/divider/Divider.examples';
import { drawerUIExample } from './examples/drawer/Drawer.examples';
import { dropdownUIExample } from './examples/dropdown/Dropdown.examples';
import { fieldUIExample } from './examples/field/Field.examples';
import { flatTreeUIExample } from './examples/flat-tree/FlatTree.examples';
import { imageUIExample } from './examples/image/Image.examples';
import { infoLabelUIExample } from './examples/infolabel/InfoLabel.examples';
import { inputUIExample } from './examples/input/Input.examples';
import { labelUIExample } from './examples/label/Label.examples';
import { linkUIExample } from './examples/link/Link.examples';
import { listUIExample } from './examples/list/List.examples';
import { menuUIExample } from './examples/menu/Menu.examples';
import { messageBarUIExample } from './examples/message-bar/MessageBar.examples';
import { navUIExample } from './examples/nav/Nav.examples';
import { overflowUIExample } from './examples/overflow/Overflow.examples';
import { personaUIExample } from './examples/persona/Persona.examples';
import { popoverUIExample } from './examples/popover/Popover.examples';
import { progressBarUIExample } from './examples/progress/ProgressBar.examples';
import { radioUIExample } from './examples/radio/Radio.examples';
import { ratingUIExample } from './examples/rating/Rating.examples';
import { searchBoxUIExample } from './examples/search/SearchBox.examples';
import { selectUIExample } from './examples/select/Select.examples';
import { skeletonUIExample } from './examples/skeleton/Skeleton.examples';
import { sliderUIExample } from './examples/slider/Slider.examples';
import { spinButtonUIExample } from './examples/spinbutton/SpinButton.examples';
import { spinnerUIExample } from './examples/spinner/Spinner.examples';
import { swatchPickerUIExample } from './examples/swatch-picker/SwatchPicker.examples';
import { switchUIExample } from './examples/switch/Switch.examples';
import { tableUIExample } from './examples/table/Table.examples';
import { tabListUIExample } from './examples/tabs/TabList.examples';
import { tagPickerUIExample } from './examples/tag-picker/TagPicker.examples';
import { tagsUIExample } from './examples/tags/Tags.examples';
import { teachingPopoverUIExample } from './examples/teaching-popover/TeachingPopover.examples';
import { textUIExample } from './examples/text/Text.examples';
import { textareaUIExample } from './examples/textarea/Textarea.examples';
import { toastUIExample } from './examples/toast/Toast.examples';
import { toggleButtonUIExample } from './examples/toggle-button/ToggleButton.examples';
import { toolbarUIExample } from './examples/toolbar/Toolbar.examples';
import { tooltipUIExample } from './examples/tooltip/Tooltip.examples';
import { treeUIExample } from './examples/tree/Tree.examples';

const toc = (label: string, path: string, example: IExampleUIUnit<JSX.Element>): ExampleToc => ({
  label,
  path,
  ui: <ExampleList examples={[example]} />,
});

export const tocs: ExampleToc[] = [
  toc('Fluent Accordion', '/accordion', accordionUIExample),
  toc('Fluent Breadcrumb', '/breadcrumb', breadcrumbUIExample),
  toc('Button', '/button', buttonUIExample),
  toc('CompoundButton', '/compound-button', compoundButtonUIExample),
  toc('Fluent Table', '/table', tableUIExample),
  toc('Fluent DataGrid', '/data-grid', dataGridUIExample),
  toc('Fluent Tree', '/tree', treeUIExample),
  toc('Fluent FlatTree', '/flat-tree', flatTreeUIExample),
  toc('Fluent Carousel', '/carousel', carouselUIExample),
  toc('ToggleButton', '/toggle-button', toggleButtonUIExample),
  toc('Input', '/input', inputUIExample),
  toc('Textarea', '/textarea', textareaUIExample),
  toc('Checkbox', '/checkbox', checkboxUIExample),
  toc('Switch', '/switch', switchUIExample),
  toc('RadioGroup', '/radio', radioUIExample),
  toc('Select', '/select', selectUIExample),
  toc('Label', '/label', labelUIExample),
  toc('Field', '/field', fieldUIExample),
  toc('Link', '/link', linkUIExample),
  toc('Divider', '/divider', dividerUIExample),
  toc('Dialog', '/dialog', dialogUIExample),
  toc('Popover', '/popover', popoverUIExample),
  toc('Drawer', '/drawer', drawerUIExample),
  toc('Menu', '/menu', menuUIExample),
  toc('Fluent Nav', '/nav', navUIExample),
  toc('Fluent Overflow', '/overflow', overflowUIExample),
  toc('Fluent Toolbar', '/toolbar', toolbarUIExample),
  toc('Fluent TabList', '/tabs', tabListUIExample),
  toc('Tooltip', '/tooltip', tooltipUIExample),
  toc('Toast', '/toast', toastUIExample),
  toc('TeachingPopover', '/teaching-popover', teachingPopoverUIExample),
  toc('Image', '/image', imageUIExample),
  toc('Text', '/text', textUIExample),
  toc('Combobox', '/combobox', comboboxUIExample),
  toc('Fluent Dropdown', '/dropdown', dropdownUIExample),
  toc('Slider', '/slider', sliderUIExample),
  toc('SpinButton', '/spinbutton', spinButtonUIExample),
  toc('Fluent SwatchPicker', '/swatch-picker', swatchPickerUIExample),
  toc('Rating', '/rating', ratingUIExample),
  toc('Fluent Tags', '/tags', tagsUIExample),
  toc('TagPicker', '/tag-picker', tagPickerUIExample),
  toc('SearchBox', '/search', searchBoxUIExample),
  toc('Fluent Color Picker', '/color-picker', colorPickerUIExample),
  toc('Fluent Avatar', '/avatar', avatarUIExample),
  toc('Fluent Badge', '/badge', badgeUIExample),
  toc('Fluent Card', '/card', cardUIExample),
  toc('Fluent Persona', '/persona', personaUIExample),
  toc('Fluent List', '/list', listUIExample),
  toc('Fluent Skeleton', '/skeleton', skeletonUIExample),
  toc('Fluent Spinner', '/spinner', spinnerUIExample),
  toc('Fluent ProgressBar', '/progress', progressBarUIExample),
  toc('Fluent InfoLabel', '/infolabel', infoLabelUIExample),
  toc('Fluent MessageBar', '/message-bar', messageBarUIExample),
  toc('Fluent Alert', '/alert', alertUIExample),
];
