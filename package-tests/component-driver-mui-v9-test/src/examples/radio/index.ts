import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicRadioGroupUIExample } from './BasicRadioGroup.example';
import { basicRadioGroupExample, basicRadioGroupTestSuite } from './BasicRadioGroup.suite';

export { basicRadioGroupUIExample, basicRadioGroupExample, basicRadioGroupTestSuite };

export const radioExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicRadioGroupExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
