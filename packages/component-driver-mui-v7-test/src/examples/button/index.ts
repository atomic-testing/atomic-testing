import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { complexButtonUIExample } from './ComplexButton.example';
import { complexButtonExample, complexButtonTestSuite } from './ComplexButton.suite';
import { iconAndLabelButtonUIExample } from './IconAndLabelButton.example';
import { iconAndLabelExample, iconAndLabelButtonTestSuite } from './IconAndLabelButton.suite';

export {
  complexButtonUIExample,
  complexButtonExample,
  complexButtonTestSuite,
  iconAndLabelButtonUIExample,
  iconAndLabelExample,
  iconAndLabelButtonTestSuite,
};

// For backward compatibility, export with old names
export { complexButtonExample as complexExample };

export const buttonExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  iconAndLabelExample,
  complexButtonExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
