import {
  BadgeDriver,
  ButtonDriver,
  CheckboxDriver,
  ChipDriver,
  SelectDriver,
  SliderDriver,
  SwitchDriver,
  TextFieldDriver,
  ToggleButtonGroupDriver,
} from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { stateAccessorsUIExample } from './StateAccessors.example';

export const stateAccessorsScenePart = {
  requiredErrorField: { locator: byDataTestId('required-error-field'), driver: TextFieldDriver },
  plainField: { locator: byDataTestId('plain-field'), driver: TextFieldDriver },
  requiredCheckbox: { locator: byDataTestId('required-checkbox'), driver: CheckboxDriver },
  requiredSwitch: { locator: byDataTestId('required-switch'), driver: SwitchDriver },
  multiSelect: { locator: byDataTestId('multi-select'), driver: SelectDriver },
  loadingButton: { locator: byDataTestId('loading-button'), driver: ButtonDriver },
  disabledLinkButton: { locator: byDataTestId('disabled-link-button'), driver: ButtonDriver },
  disabledChip: { locator: byDataTestId('disabled-chip'), driver: ChipDriver },
  dotBadge: { locator: byDataTestId('dot-badge'), driver: BadgeDriver },
  invisibleBadge: { locator: byDataTestId('invisible-badge'), driver: BadgeDriver },
  visibleBadge: { locator: byDataTestId('visible-badge'), driver: BadgeDriver },
  markedSlider: { locator: byDataTestId('marked-slider'), driver: SliderDriver },
  toggleGroup: { locator: byDataTestId('toggle-group'), driver: ToggleButtonGroupDriver },
} satisfies ScenePart;

export const stateAccessorsExample: IExampleUnit<typeof stateAccessorsScenePart, JSX.Element> = {
  ...stateAccessorsUIExample,
  scene: stateAccessorsScenePart,
};

export const stateAccessorsTestSuite: TestSuiteInfo<typeof stateAccessorsExample.scene> = {
  title: 'State Accessors',
  url: '/state-accessors',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(stateAccessorsExample.scene, getTestEngine, { beforeEach, afterEach });

    test('TextField reports required, error and placeholder', async () => {
      assertTrue(await engine().parts.requiredErrorField.isRequired());
      assertTrue(await engine().parts.requiredErrorField.isError());
      assertEqual(await engine().parts.requiredErrorField.getPlaceholder(), 'you@example.com');
    });

    test('A plain TextField reports not required, no error, no placeholder', async () => {
      assertFalse(await engine().parts.plainField.isRequired());
      assertFalse(await engine().parts.plainField.isError());
      assertEqual(await engine().parts.plainField.getPlaceholder(), undefined);
    });

    test('Checkbox and Switch report required', async () => {
      assertTrue(await engine().parts.requiredCheckbox.isRequired());
      assertTrue(await engine().parts.requiredSwitch.isRequired());
    });

    test('A multiple Select reports its values as an array and is required', async () => {
      assertEqual(await engine().parts.multiSelect.getSelectedValues(), ['1', '2']);
      assertTrue(await engine().parts.multiSelect.isRequired());
    });

    test('Button reports loading and link-button disabled', async () => {
      assertTrue(await engine().parts.loadingButton.isLoading());
      assertTrue(await engine().parts.disabledLinkButton.isDisabled());
    });

    test('Chip reports disabled', async () => {
      assertTrue(await engine().parts.disabledChip.isDisabled());
    });

    test('Badge distinguishes dot, invisible and visible', async () => {
      assertTrue(await engine().parts.dotBadge.isDot());
      assertTrue(await engine().parts.invisibleBadge.isInvisible());
      assertFalse(await engine().parts.invisibleBadge.isBadgeVisible());
      assertTrue(await engine().parts.visibleBadge.isBadgeVisible());
      assertFalse(await engine().parts.visibleBadge.isDot());
    });

    test('Slider reports min/max/step, marks and value text', async () => {
      assertEqual(await engine().parts.markedSlider.getMin(), 0);
      assertEqual(await engine().parts.markedSlider.getMax(), 100);
      assertEqual(await engine().parts.markedSlider.getStep(), 10);
      assertEqual(await engine().parts.markedSlider.getMarks(), ['0°C', '20°C', '37°C']);
      assertEqual(await engine().parts.markedSlider.getValueText(), '20 degrees');
    });

    test('ToggleButtonGroup exposes per-option access and disabled state', async () => {
      assertEqual(await engine().parts.toggleGroup.getButtonCount(), 3);
      assertTrue(await engine().parts.toggleGroup.isOptionDisabled('center'));
      assertFalse(await engine().parts.toggleGroup.isOptionDisabled('left'));
      const right = await engine().parts.toggleGroup.getButtonByLabel('Right');
      assertTrue((await right?.getValue()) === 'right');
    });
  },
};
