import { HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { typeTextUIExample } from './TypeText.examples';

export const typeTextExampleScenePart = {
  target: {
    locator: byDataTestId('type-target'),
    driver: HTMLTextInputDriver,
  },
  keydownCount: {
    locator: byDataTestId('type-keydown-count'),
    driver: HTMLElementDriver,
  },
  editable: {
    locator: byDataTestId('editable-target'),
    driver: HTMLElementDriver,
  },
  editableMirror: {
    locator: byDataTestId('editable-mirror'),
    driver: HTMLElementDriver,
  },
  editableInputCount: {
    locator: byDataTestId('editable-input-count'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const typeTextExample: IExampleUnit<typeof typeTextExampleScenePart, JSX.Element> = {
  ...typeTextUIExample,
  scene: typeTextExampleScenePart,
};

export const typeTextExampleTestSuite: TestSuiteInfo<typeof typeTextExample.scene> = {
  title: 'Type Text: typeText',
  url: '/type-text',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${typeTextExample.title}`, () => {
      const engine = useTestEngine(typeTextExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`typeText types every character into an empty input`, async () => {
        await engine().parts.target.typeText('hello');
        assertEqual(await engine().parts.target.getValue(), 'hello');
      });

      test(`each character arrives as its own keystroke`, async () => {
        await engine().parts.target.typeText('hello');
        assertEqual(await engine().parts.keydownCount.getText(), '5');
      });

      test(`sequential typeText calls append instead of replacing`, async () => {
        await engine().parts.target.typeText('ab');
        await engine().parts.target.typeText('cd');
        assertEqual(await engine().parts.target.getValue(), 'abcd');
      });

      // Braces/brackets are descriptor syntax in the jsdom path's user-event
      // dispatcher; this pins that both engines type them literally.
      test(`braces and brackets are typed literally`, async () => {
        await engine().parts.target.typeText('{a}[b]');
        assertEqual(await engine().parts.target.getValue(), '{a}[b]');
        assertEqual(await engine().parts.keydownCount.getText(), '6');
      });

      // The reason this primitive exists: a contenteditable editor has no value
      // to fill, so only real per-character key/input events can change what
      // the component observes (cf. the MUI X picker section field, #903).
      test(`typeText drives a contenteditable editor through real input events`, async () => {
        await engine().parts.editable.typeText('abc');
        assertEqual(await engine().parts.editableMirror.getText(), 'abc');
        assertEqual(await engine().parts.editableInputCount.getText(), '3');
      });

      test(`typeText with an empty string focuses but types nothing`, async () => {
        await engine().parts.target.typeText('');
        assertEqual(await engine().parts.target.getValue(), '');
        assertEqual(await engine().parts.keydownCount.getText(), '0');
      });
    });
  },
};
