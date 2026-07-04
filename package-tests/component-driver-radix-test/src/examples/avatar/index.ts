import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { avatarExample, avatarExampleTestSuite } from './Avatar.suite';

export { avatarUIExample } from './Avatar.examples';
export { avatarExample, avatarExampleTestSuite };

export const avatarExamples = [avatarExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
