import { JSX } from 'react';

import { IExampleUnit, IExampleUIUnit, ScenePart } from '@atomic-testing/core';

import { basicSwitchUIExample } from './BasicSwitch.examples';
import { basicSwitchExample, basicSwitchTestSuite } from './BasicSwitch.suite';

export { basicSwitchUIExample, basicSwitchExample, basicSwitchTestSuite };

export const switchUIExamples: IExampleUIUnit<JSX.Element>[] = [
  basicSwitchUIExample,
] satisfies IExampleUIUnit<JSX.Element>[];

export const switchExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicSwitchExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
