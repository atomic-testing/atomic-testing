import React, { useCallback } from 'react';

import { HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

export const FocusEventExample = () => {
  const [showDetail, setShowDetail] = React.useState<string>('');

  const onFocus = useCallback(() => {
    setShowDetail('focus');
  }, []);

  const onBlur = useCallback(() => {
    setShowDetail('blur');
  }, []);

  return (
    <React.Fragment>
      <div>
        <input data-testid='focus-target' onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        {/* Blur aid is used to incur blur event on focus target by focusing on the aid element */}
        <input data-testid='blur-aid' />
      </div>
      <div data-testid='focus-detail'>{showDetail}</div>
    </React.Fragment>
  );
};

export const focusEventExampleScenePart = {
  target: {
    locator: byDataTestId('focus-target'),
    driver: HTMLTextInputDriver,
  },
  blurAid: {
    locator: byDataTestId('blur-aid'),
    driver: HTMLTextInputDriver,
  },
  detail: {
    locator: byDataTestId('focus-detail'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const focusEventExample: IExampleUnit<typeof focusEventExampleScenePart, JSX.Element> = {
  title: 'Focus event',
  scene: focusEventExampleScenePart,
  ui: <FocusEventExample />,
};

export const focusEventExampleTestSuite: TestSuiteInfo<typeof focusEventExample.scene> = {
  title: 'Focus Event: Focus',
  url: '/focus-event',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${focusEventExample.title}`, () => {
      let testEngine: TestEngine<typeof focusEventExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(focusEventExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Initially detail is empty`, async () => {
        assertEqual(await testEngine.parts.detail.getText(), '');
      });

      test(`Detail is "focus" when element is focused`, async () => {
        await testEngine.parts.target.focus();
        assertEqual(await testEngine.parts.detail.getText(), 'focus');
      });

      test(`Detail is "blur" when element is blurred`, async () => {
        await testEngine.parts.target.focus();
        // Focus on another element to blur the target
        await testEngine.parts.blurAid.focus();
        assertEqual(await testEngine.parts.detail.getText(), 'blur');
      });
    });
  },
};
