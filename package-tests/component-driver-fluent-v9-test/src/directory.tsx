import { IExampleUIUnit } from '@atomic-testing/core';
import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';
import { JSX } from 'react';

import { buttonUIExample } from './examples/button/Button.examples';
import { checkboxUIExample } from './examples/checkbox/Checkbox.examples';
import { colorPickerUIExample } from './examples/color-picker/ColorPicker.examples';
import { comboboxUIExample } from './examples/combobox/Combobox.examples';
import { compoundButtonUIExample } from './examples/compound-button/CompoundButton.examples';
import { dialogUIExample } from './examples/dialog/Dialog.examples';
import { dividerUIExample } from './examples/divider/Divider.examples';
import { drawerUIExample } from './examples/drawer/Drawer.examples';
import { dropdownUIExample } from './examples/dropdown/Dropdown.examples';
import { fieldUIExample } from './examples/field/Field.examples';
import { imageUIExample } from './examples/image/Image.examples';
import { inputUIExample } from './examples/input/Input.examples';
import { labelUIExample } from './examples/label/Label.examples';
import { linkUIExample } from './examples/link/Link.examples';
import { menuUIExample } from './examples/menu/Menu.examples';
import { popoverUIExample } from './examples/popover/Popover.examples';
import { radioUIExample } from './examples/radio/Radio.examples';
import { ratingUIExample } from './examples/rating/Rating.examples';
import { searchBoxUIExample } from './examples/search/SearchBox.examples';
import { selectUIExample } from './examples/select/Select.examples';
import { sliderUIExample } from './examples/slider/Slider.examples';
import { spinButtonUIExample } from './examples/spinbutton/SpinButton.examples';
import { swatchPickerUIExample } from './examples/swatch-picker/SwatchPicker.examples';
import { switchUIExample } from './examples/switch/Switch.examples';
import { tagPickerUIExample } from './examples/tag-picker/TagPicker.examples';
import { tagsUIExample } from './examples/tags/Tags.examples';
import { teachingPopoverUIExample } from './examples/teaching-popover/TeachingPopover.examples';
import { textUIExample } from './examples/text/Text.examples';
import { textareaUIExample } from './examples/textarea/Textarea.examples';
import { toastUIExample } from './examples/toast/Toast.examples';
import { toggleButtonUIExample } from './examples/toggle-button/ToggleButton.examples';
import { tooltipUIExample } from './examples/tooltip/Tooltip.examples';

const toc = (label: string, path: string, example: IExampleUIUnit<JSX.Element>): ExampleToc => ({
  label,
  path,
  ui: <ExampleList examples={[example]} />,
});

export const tocs: ExampleToc[] = [
  toc('Button', '/button', buttonUIExample),
  toc('CompoundButton', '/compound-button', compoundButtonUIExample),
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
];
