import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { lightboxExample, lightboxExampleTestSuite } from './Lightbox.suite';

export { lightboxUIExample } from './Lightbox.examples';
export { lightboxExample, lightboxExampleTestSuite };

export const lightboxExamples = [lightboxExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
