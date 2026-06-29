import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { breadcrumbsExample, breadcrumbsExampleTestSuite } from './Breadcrumbs.suite';

export { breadcrumbsUIExample } from './Breadcrumbs.examples';
export { breadcrumbsExample, breadcrumbsExampleTestSuite };

export const breadcrumbsExamples = [breadcrumbsExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
