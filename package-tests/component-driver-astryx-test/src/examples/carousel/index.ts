import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { carouselExample, carouselExampleTestSuite } from './Carousel.suite';

export { carouselUIExample } from './Carousel.examples';
export { carouselExample, carouselExampleTestSuite };

export const carouselExamples = [carouselExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
