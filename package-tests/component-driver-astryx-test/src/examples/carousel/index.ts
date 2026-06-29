import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { carouselExample, carouselExampleTestSuite } from './Carousel.suite';

export { carouselUIExample } from './Carousel.examples';
export { carouselExample, carouselExampleTestSuite };

export const carouselExamples = [carouselExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
