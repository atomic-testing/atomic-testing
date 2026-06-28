import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { bannerExample, bannerExampleTestSuite } from './Banner.suite';

export { bannerUIExample } from './Banner.examples';
export { bannerExample, bannerExampleTestSuite };

export const bannerExamples = [bannerExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
