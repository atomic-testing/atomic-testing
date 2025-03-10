import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { basicSwitchExample as basicSwitch } from './BasicSwitch.examples';
export { basicSwitchTestSuite } from './BasicSwitch.examples';
export const basicSwitchExample = basicSwitch;
export const switchExamples = [basicSwitchExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
