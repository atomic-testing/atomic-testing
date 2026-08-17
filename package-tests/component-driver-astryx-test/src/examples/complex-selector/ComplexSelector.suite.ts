import { ComplexSelectorDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { complexSelectorUIExample } from './ComplexSelector.examples';

export const complexSelectorExampleScenePart = {
  palette: {
    locator: byDataTestId('palette'),
    driver: ComplexSelectorDriver,
  },
  density: {
    locator: byDataTestId('density'),
    driver: ComplexSelectorDriver,
  },
  locked: {
    locator: byDataTestId('locked'),
    driver: ComplexSelectorDriver,
  },
} satisfies ScenePart;

/** The popup's interior — owned by the scene, not the driver (ADR-019). */
const paletteInterior = {
  dusk: { locator: byDataTestId('swatch-Dusk'), driver: HTMLButtonDriver },
} satisfies ScenePart;

export const complexSelectorExample: IExampleUnit<typeof complexSelectorExampleScenePart, JSX.Element> = {
  ...complexSelectorUIExample,
  scene: complexSelectorExampleScenePart,
};

export const complexSelectorExampleTestSuite: TestSuiteInfo<typeof complexSelectorExample.scene> = {
  title: 'Astryx ComplexSelector',
  url: '/complex-selector',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${complexSelectorExample.title}`, () => {
      const engine = useTestEngine(complexSelectorExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // The label is resolved through the trigger's aria-labelledby, not a class.
      test(`getLabel and getTriggerText read the shell`, async () => {
        assertEqual(await engine().parts.palette.getLabel(), 'Palette');
        assertEqual(await engine().parts.palette.getTriggerText(), 'Sunrise');
      });

      // aria-expanded is React-state-driven, so it is faithful in jsdom too.
      test(`starts closed`, async () => {
        assertFalse(await engine().parts.palette.isOpen());
      });

      // Required/invalid/description all come off the trigger's ARIA.
      test(`reads the validation state`, async () => {
        assertTrue(await engine().parts.density.isRequired());
        assertTrue(await engine().parts.density.isInvalid());
        assertEqual(await engine().parts.density.getStatus(), 'error');
        assertEqual(await engine().parts.density.getStatusMessage(), 'Pick a density');
        assertEqual(await engine().parts.density.getDescription(), 'Controls row height across the table');
      });

      // The disabled trigger is a natively disabled <button>.
      test(`reads the disabled state`, async () => {
        assertTrue(await engine().parts.locked.isDisabled());
        assertFalse(await engine().parts.palette.isDisabled());
      });

      // within() resolves the caller's interior against the popup the trigger's
      // aria-controls points at — the interior is scene-owned, not driver-owned.
      test(`within reaches the popup interior`, async () => {
        const inside = engine().parts.palette.within(paletteInterior);
        assertTrue(await inside.dusk.exists());
        assertEqual(await inside.dusk.getText(), 'Dusk');
      });

      // Opening is a native-popover interaction, so WebKit is gated as elsewhere.
      test(`open commits a selection from the popup interior`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.palette.open();
        assertTrue(await engine().parts.palette.isOpen());
        await engine().parts.palette.within(paletteInterior).dusk.click();
        assertEqual(await engine().parts.palette.getTriggerText(), 'Dusk');
      });
    });
  },
};
