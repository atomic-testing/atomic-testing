import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import React, { useCallback } from 'react';

export const ClickLocationMouseEventExample = () => {
  const [clickX, setClickX] = React.useState<number | null>(null);
  const [clickY, setClickY] = React.useState<number | null>(null);

  const onClick = useCallback((evt: React.MouseEvent<HTMLDivElement>) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    var x = evt.clientX - rect.left; //x position within the element.
    var y = evt.clientY - rect.top; //y position within the element.
    setClickX(x);
    setClickY(y);
  }, []);

  return (
    <React.Fragment>
      <div
        style={{ cursor: 'crosshair', backgroundColor: '#0099ff', width: '20rem', height: '12rem' }}
        data-testid="click-target"
        onClick={onClick}
      ></div>
      <p>
        Click on <span data-testid="position-x">{clickX}</span>, <span data-testid="position-y">{clickY}</span>
      </p>
    </React.Fragment>
  );
};

export const clickLocationMouseEventExampleScenePart = {
  target: {
    locator: byDataTestId('click-target'),
    driver: HTMLButtonDriver,
  },
  xDisplay: {
    locator: byDataTestId('position-x'),
    driver: HTMLElementDriver,
  },
  yDisplay: {
    locator: byDataTestId('position-y'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const clickLocationMouseEventExample: IExampleUnit<typeof clickLocationMouseEventExampleScenePart, JSX.Element> =
  {
    title: 'Click location',
    scene: clickLocationMouseEventExampleScenePart,
    ui: <ClickLocationMouseEventExample />,
  };

export const clickLocationMouseEventExampleTestSuite: TestSuiteInfo<typeof clickLocationMouseEventExample.scene> = {
  title: 'Mouse event: Click',
  url: '/mouse-event',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${clickLocationMouseEventExample.title}`, () => {
      let testEngine: TestEngine<typeof clickLocationMouseEventExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(clickLocationMouseEventExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Click on somewhere in the target should display the correct coordinates', async () => {
        await testEngine.parts.target.click({
          position: {
            x: 10,
            y: 5,
          },
        });
        const xDisplay = await testEngine.parts.xDisplay.getText();
        const yDisplay = await testEngine.parts.yDisplay.getText();

        // The coordinates are rounded because e2e tests are not pixel perfect
        assertEqual(Math.round(parseFloat(xDisplay ?? '')), 10);
        assertEqual(Math.round(parseFloat(yDisplay ?? '')), 5);
      });
    });
  },
};
