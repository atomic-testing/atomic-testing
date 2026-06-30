import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit, IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

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
