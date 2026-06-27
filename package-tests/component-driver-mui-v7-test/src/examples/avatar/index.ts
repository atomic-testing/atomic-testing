import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicAvatarUIExample } from './BasicAvatar.example';
import { basicAvatarExample, basicAvatarTestSuite } from './BasicAvatar.suite';

export { basicAvatarUIExample, basicAvatarExample, basicAvatarTestSuite };

export const avatarExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicAvatarExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
