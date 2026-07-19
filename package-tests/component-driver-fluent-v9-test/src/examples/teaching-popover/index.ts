import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { teachingPopoverExample, teachingPopoverExampleTestSuite } from './TeachingPopover.suite';

export { teachingPopoverUIExample } from './TeachingPopover.examples';
export { teachingPopoverExample, teachingPopoverExampleTestSuite };

export const teachingPopoverExamples = [teachingPopoverExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
