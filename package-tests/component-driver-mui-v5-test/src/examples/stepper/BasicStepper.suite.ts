import { StepperDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicStepperUIExample } from './BasicStepper.example';

export const basicStepperExampleScenePart = {
  stepper: {
    locator: byDataTestId('basic-stepper'),
    driver: StepperDriver,
  },
  other: {
    locator: byDataTestId('other-stepper'),
    driver: StepperDriver,
  },
} satisfies ScenePart;

export const basicStepperExample: IExampleUnit<typeof basicStepperExampleScenePart, JSX.Element> = {
  ...basicStepperUIExample,
  scene: basicStepperExampleScenePart,
};

export const basicStepperTestSuite: TestSuiteInfo<typeof basicStepperExampleScenePart> = {
  title: 'Basic Stepper',
  url: '/stepper',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicStepperExample.scene, getTestEngine, { beforeEach, afterEach });

    test('reports the step count per instance', async () => {
      assertEqual(await engine().parts.stepper.getStepCount(), 3);
      assertEqual(await engine().parts.other.getStepCount(), 2);
    });

    test('reports the active step index per instance', async () => {
      assertEqual(await engine().parts.stepper.getActiveStepIndex(), 1);
      assertEqual(await engine().parts.other.getActiveStepIndex(), 0);
    });

    test('reports each step with label and state', async () => {
      assertEqual(await engine().parts.stepper.getSteps(), [
        { label: 'Select campaign', active: false, completed: true, disabled: false },
        { label: 'Create an ad group', active: true, completed: false, disabled: false },
        { label: 'Create an ad', active: false, completed: false, disabled: true },
      ]);
    });

    test('navigates to a step by index', async () => {
      assertTrue(await engine().parts.stepper.goToStep(0));
      assertEqual(await engine().parts.stepper.getActiveStepIndex(), 0);
    });

    test('refuses to navigate to a disabled step', async () => {
      assertFalse(await engine().parts.stepper.goToStep(2));
      assertEqual(await engine().parts.stepper.getActiveStepIndex(), 1);
    });

    test('returns false for an out-of-range step', async () => {
      assertFalse(await engine().parts.stepper.goToStep(99));
    });
  },
};
