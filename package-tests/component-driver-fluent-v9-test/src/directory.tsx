import { IExampleUIUnit } from '@atomic-testing/core';
import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';
import { JSX } from 'react';

import { buttonUIExample } from './examples/button/Button.examples';
import { checkboxUIExample } from './examples/checkbox/Checkbox.examples';
import { compoundButtonUIExample } from './examples/compound-button/CompoundButton.examples';
import { dividerUIExample } from './examples/divider/Divider.examples';
import { fieldUIExample } from './examples/field/Field.examples';
import { imageUIExample } from './examples/image/Image.examples';
import { inputUIExample } from './examples/input/Input.examples';
import { labelUIExample } from './examples/label/Label.examples';
import { linkUIExample } from './examples/link/Link.examples';
import { radioUIExample } from './examples/radio/Radio.examples';
import { selectUIExample } from './examples/select/Select.examples';
import { switchUIExample } from './examples/switch/Switch.examples';
import { textUIExample } from './examples/text/Text.examples';
import { textareaUIExample } from './examples/textarea/Textarea.examples';
import { toggleButtonUIExample } from './examples/toggle-button/ToggleButton.examples';

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
  toc('Image', '/image', imageUIExample),
  toc('Text', '/text', textUIExample),
];
