import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { avatarGroupExample, avatarGroupExampleTestSuite } from './AvatarGroup.suite';

export { avatarGroupUIExample } from './AvatarGroup.examples';
export { avatarGroupExample, avatarGroupExampleTestSuite };

export const avatarGroupExamples = [avatarGroupExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
