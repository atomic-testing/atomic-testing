import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { personaExample, personaExampleTestSuite } from './Persona.suite';

export { personaUIExample } from './Persona.examples';
export { personaExample, personaExampleTestSuite };

export const personaExamples = [personaExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
