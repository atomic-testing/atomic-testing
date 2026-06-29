import { IExampleUIUnit } from '@atomic-testing/core';
import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';
import { JSX } from 'react';

import { bannerUIExample } from './examples/banner/Banner.examples';
import { buttonGroupUIExample } from './examples/button-group/ButtonGroup.examples';
import { buttonUIExample } from './examples/button/Button.examples';
import { checkboxInputUIExample } from './examples/checkbox-input/CheckboxInput.examples';
import { checkboxListUIExample } from './examples/checkbox-list/CheckboxList.examples';
import { collapsibleUIExample } from './examples/collapsible/Collapsible.examples';
import { fieldStatusUIExample } from './examples/field-status/FieldStatus.examples';
import { fieldUIExample } from './examples/field/Field.examples';
import { iconButtonUIExample } from './examples/icon-button/IconButton.examples';
import { inputGroupUIExample } from './examples/input-group/InputGroup.examples';
import { linkUIExample } from './examples/link/Link.examples';
import { numberInputUIExample } from './examples/number-input/NumberInput.examples';
import { paginationUIExample } from './examples/pagination/Pagination.examples';
import { radioListUIExample } from './examples/radio-list/RadioList.examples';
import { segmentedControlUIExample } from './examples/segmented-control/SegmentedControl.examples';
import { selectableCardUIExample } from './examples/selectable-card/SelectableCard.examples';
import { sliderUIExample } from './examples/slider/Slider.examples';
import { switchControlUIExample } from './examples/switch/Switch.examples';
import { textAreaUIExample } from './examples/text-area/TextArea.examples';
import { textInputUIExample } from './examples/text-input/TextInput.examples';
import { timeInputUIExample } from './examples/time-input/TimeInput.examples';
import { toggleButtonGroupUIExample } from './examples/toggle-button-group/ToggleButtonGroup.examples';
import { toggleButtonUIExample } from './examples/toggle-button/ToggleButton.examples';

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
];
