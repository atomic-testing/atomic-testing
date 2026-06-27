import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicStepperUIExample } from './BasicStepper.example';
import { basicStepperExample, basicStepperTestSuite } from './BasicStepper.suite';

export { basicStepperUIExample, basicStepperExample, basicStepperTestSuite };

export const stepperExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicStepperExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
