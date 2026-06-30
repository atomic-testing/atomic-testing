import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { alertDialogUIExample } from './examples/alert-dialog/AlertDialog.examples';
import { bannerUIExample } from './examples/banner/Banner.examples';
import { buttonGroupUIExample } from './examples/button-group/ButtonGroup.examples';
import { buttonUIExample } from './examples/button/Button.examples';
import { calendarUIExample } from './examples/calendar/Calendar.examples';
import { carouselUIExample } from './examples/carousel/Carousel.examples';
import { checkboxInputUIExample } from './examples/checkbox-input/CheckboxInput.examples';
import { checkboxListUIExample } from './examples/checkbox-list/CheckboxList.examples';
import { collapsibleUIExample } from './examples/collapsible/Collapsible.examples';
import { commandPaletteUIExample } from './examples/command-palette/CommandPalette.examples';
import { dateInputUIExample } from './examples/date-input/DateInput.examples';
import { dateRangeInputUIExample } from './examples/date-range-input/DateRangeInput.examples';
import { dateTimeInputUIExample } from './examples/date-time-input/DateTimeInput.examples';
import { dialogUIExample } from './examples/dialog/Dialog.examples';
import { dropdownMenuUIExample } from './examples/dropdown-menu/DropdownMenu.examples';
import { fieldStatusUIExample } from './examples/field-status/FieldStatus.examples';
import { fieldUIExample } from './examples/field/Field.examples';
import { iconButtonUIExample } from './examples/icon-button/IconButton.examples';
import { inputGroupUIExample } from './examples/input-group/InputGroup.examples';
import { linkUIExample } from './examples/link/Link.examples';
import { listUIExample } from './examples/list/List.examples';
import { metadataListUIExample } from './examples/metadata-list/MetadataList.examples';
import { moreMenuUIExample } from './examples/more-menu/MoreMenu.examples';
import { multiSelectorUIExample } from './examples/multi-selector/MultiSelector.examples';
import { navMenuUIExample } from './examples/nav-menu/NavMenu.examples';
import { numberInputUIExample } from './examples/number-input/NumberInput.examples';
import { outlineUIExample } from './examples/outline/Outline.examples';
import { paginationUIExample } from './examples/pagination/Pagination.examples';
import { popoverUIExample } from './examples/popover/Popover.examples';
import { powerSearchUIExample } from './examples/power-search/PowerSearch.examples';
import { radioListUIExample } from './examples/radio-list/RadioList.examples';
import { segmentedControlUIExample } from './examples/segmented-control/SegmentedControl.examples';
import { selectableCardUIExample } from './examples/selectable-card/SelectableCard.examples';
import { selectorUIExample } from './examples/selector/Selector.examples';
import { sliderUIExample } from './examples/slider/Slider.examples';
import { switchControlUIExample } from './examples/switch/Switch.examples';
import { tabListUIExample } from './examples/tab-list/TabList.examples';
import { tableUIExample } from './examples/table/Table.examples';
import { textAreaUIExample } from './examples/text-area/TextArea.examples';
import { textInputUIExample } from './examples/text-input/TextInput.examples';
import { timeInputUIExample } from './examples/time-input/TimeInput.examples';
import { toastUIExample } from './examples/toast/Toast.examples';
import { toggleButtonGroupUIExample } from './examples/toggle-button-group/ToggleButtonGroup.examples';
import { toggleButtonUIExample } from './examples/toggle-button/ToggleButton.examples';
import { tokenizerUIExample } from './examples/tokenizer/Tokenizer.examples';
import { toolbarUIExample } from './examples/toolbar/Toolbar.examples';
import { treeListUIExample } from './examples/tree-list/TreeList.examples';
import { typeaheadUIExample } from './examples/typeahead/Typeahead.examples';

const toc = (label: string, path: string, example: IExampleUIUnit<JSX.Element>): ExampleToc => ({
  label,
  path,
  ui: <ExampleList examples={[example]} />,
});

export const tocs: ExampleToc[] = [
  toc('Button', '/button', buttonUIExample),
  toc('IconButton', '/icon-button', iconButtonUIExample),
  toc('ToggleButton', '/toggle-button', toggleButtonUIExample),
  toc('ButtonGroup', '/button-group', buttonGroupUIExample),
  toc('ToggleButtonGroup', '/toggle-button-group', toggleButtonGroupUIExample),
  toc('Link', '/link', linkUIExample),
  toc('TextInput', '/text-input', textInputUIExample),
  toc('TextArea', '/text-area', textAreaUIExample),
  toc('NumberInput', '/number-input', numberInputUIExample),
  toc('TimeInput', '/time-input', timeInputUIExample),
  toc('CheckboxInput', '/checkbox-input', checkboxInputUIExample),
  toc('RadioList', '/radio-list', radioListUIExample),
  toc('CheckboxList', '/checkbox-list', checkboxListUIExample),
  toc('Switch', '/switch', switchControlUIExample),
  toc('SegmentedControl', '/segmented-control', segmentedControlUIExample),
  toc('SelectableCard', '/selectable-card', selectableCardUIExample),
  toc('Slider', '/slider', sliderUIExample),
  toc('Field', '/field', fieldUIExample),
  toc('InputGroup', '/input-group', inputGroupUIExample),
  toc('FieldStatus', '/field-status', fieldStatusUIExample),
  toc('Banner', '/banner', bannerUIExample),
  toc('Pagination', '/pagination', paginationUIExample),
  toc('Collapsible', '/collapsible', collapsibleUIExample),
  toc('NavMenu', '/nav-menu', navMenuUIExample),
  toc('Toolbar', '/toolbar', toolbarUIExample),
  toc('Toast', '/toast', toastUIExample),
  toc('TabList', '/tab-list', tabListUIExample),
  toc('DropdownMenu', '/dropdown-menu', dropdownMenuUIExample),
  toc('MoreMenu', '/more-menu', moreMenuUIExample),
  toc('Popover', '/popover', popoverUIExample),
  toc('Dialog', '/dialog', dialogUIExample),
  toc('AlertDialog', '/alert-dialog', alertDialogUIExample),
  toc('List', '/list', listUIExample),
  toc('MetadataList', '/metadata-list', metadataListUIExample),
  toc('Outline', '/outline', outlineUIExample),
  toc('Carousel', '/carousel', carouselUIExample),
  toc('Table', '/table', tableUIExample),
  toc('TreeList', '/tree-list', treeListUIExample),
  toc('Selector', '/selector', selectorUIExample),
  toc('MultiSelector', '/multi-selector', multiSelectorUIExample),
  toc('Typeahead', '/typeahead', typeaheadUIExample),
  toc('Tokenizer', '/tokenizer', tokenizerUIExample),
  toc('CommandPalette', '/command-palette', commandPaletteUIExample),
  toc('Calendar', '/calendar', calendarUIExample),
  toc('DateInput', '/date-input', dateInputUIExample),
  toc('DateTimeInput', '/date-time-input', dateTimeInputUIExample),
  toc('DateRangeInput', '/date-range-input', dateRangeInputUIExample),
  toc('PowerSearch', '/power-search', powerSearchUIExample),
];
