import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { breadcrumbExample, breadcrumbExampleTestSuite } from './Breadcrumb.suite';

export { breadcrumbUIExample } from './Breadcrumb.examples';
export { breadcrumbExample, breadcrumbExampleTestSuite };

export const breadcrumbExamples = [breadcrumbExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
