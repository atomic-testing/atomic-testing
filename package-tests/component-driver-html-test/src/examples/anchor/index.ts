import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { hoverAnchorExample, hoverAnchorExampleTestSuite } from './HoverAnchor.suite';

export { hoverAnchorExampleTestSuite, hoverAnchorExample };

export const anchorExamples = [hoverAnchorExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
