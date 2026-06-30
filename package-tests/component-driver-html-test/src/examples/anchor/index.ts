import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { hoverAnchorExample, hoverAnchorExampleTestSuite } from './HoverAnchor.suite';

export { hoverAnchorExampleTestSuite, hoverAnchorExample };

export const anchorExamples = [hoverAnchorExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
