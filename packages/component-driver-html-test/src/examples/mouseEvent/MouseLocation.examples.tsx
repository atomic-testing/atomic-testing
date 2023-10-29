import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import React, { useCallback, useState } from 'react';
// import './ClickLocation.css';

export const MouseLocationMouseEventExample = () => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const [eventName, setEventName] = useState<string | null>(null);

  const displayEvent = useCallback((evt: React.MouseEvent<HTMLDivElement>, evtName: string) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    var x = evt.clientX - rect.left; //x position within the element.
    var y = evt.clientY - rect.top; //y position within the element.
    setMouseX(x);
    setMouseY(y);
    setEventName(evtName);
  }, []);

  const onMouseMove = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      displayEvent(evt, 'mouseMove');
    },
    [displayEvent],
  );

  const onMouseDown = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      displayEvent(evt, 'mouseDown');
    },
    [displayEvent],
  );

  const onMouseUp = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      displayEvent(evt, 'mouseUp');
    },
    [displayEvent],
  );

  return (
    <React.Fragment>
      <div
        style={{ cursor: 'crosshair', backgroundColor: '#22cc99', width: '20rem', height: '12rem' }}
        data-testid="mouse-target"
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      ></div>
      <div className="mouse-event">
        <span className="label">Event</span>
        <span className="value" data-testid="mouse-event-name">
          {eventName}
        </span>

        <span className="label">X</span>
        <span className="value" data-testid="mouse-x">
          {mouseX}
        </span>

        <span className="label">Y</span>
        <span className="value" data-testid="mouse-y">
          {mouseY}
        </span>
      </div>
    </React.Fragment>
  );
};

export const mouseLocationMouseEventExampleScenePart = {
  target: {
    locator: byDataTestId('mouse-target'),
    driver: HTMLButtonDriver,
  },
  eventDisplay: {
    locator: byDataTestId('mouse-event-name'),
    driver: HTMLElementDriver,
  },
  xDisplay: {
    locator: byDataTestId('mouse-x'),
    driver: HTMLElementDriver,
  },
  yDisplay: {
    locator: byDataTestId('mouse-y'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const mouseLocationMouseEventExample: IExampleUnit<typeof mouseLocationMouseEventExampleScenePart, JSX.Element> =
  {
    title: 'Mouse location',
    scene: mouseLocationMouseEventExampleScenePart,
    ui: <MouseLocationMouseEventExample />,
  };

export const mouseLocationMouseEventExampleTestSuite: TestSuiteInfo<typeof mouseLocationMouseEventExample.scene> = {
  title: 'Mouse event: Mouse move/up/click',
  url: '/mouse-event',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${mouseLocationMouseEventExample.title}`, () => {
      let testEngine: TestEngine<typeof mouseLocationMouseEventExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(mouseLocationMouseEventExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Mousemove on somewhere in the target should display the correct coordinates', async () => {
        await testEngine.parts.target.mouseMove({
          position: {
            x: 20,
            y: 15,
          },
        });
        const eventDisplay = await testEngine.parts.eventDisplay.getText();
        const xDisplay = await testEngine.parts.xDisplay.getText();
        const yDisplay = await testEngine.parts.yDisplay.getText();

        // The coordinates are rounded because e2e tests are not pixel perfect
        assertEqual(eventDisplay, 'mouseMove');
        assertEqual(Math.round(parseFloat(xDisplay ?? '')), 20);
        assertEqual(Math.round(parseFloat(yDisplay ?? '')), 15);
      });

      test('Mousedown on somewhere in the target should display the correct coordinates', async () => {
        await testEngine.parts.target.mouseMove({
          position: {
            x: 20,
            y: 15,
          },
        });
        await testEngine.parts.target.mouseDown({
          position: {
            x: 12,
            y: 16,
          },
        });
        const eventDisplay = await testEngine.parts.eventDisplay.getText();
        const xDisplay = await testEngine.parts.xDisplay.getText();
        const yDisplay = await testEngine.parts.yDisplay.getText();

        // The coordinates are rounded because e2e tests are not pixel perfect
        assertEqual(eventDisplay, 'mouseDown');
        assertEqual(Math.round(parseFloat(xDisplay ?? '')), 12);
        assertEqual(Math.round(parseFloat(yDisplay ?? '')), 16);
      });

      test('MouseUp on somewhere in the target should display the correct coordinates', async () => {
        await testEngine.parts.target.mouseMove({
          position: {
            x: 20,
            y: 15,
          },
        });
        await testEngine.parts.target.mouseDown({
          position: {
            x: 12,
            y: 16,
          },
        });
        await testEngine.parts.target.mouseUp({
          position: {
            x: 11,
            y: 15,
          },
        });
        const eventDisplay = await testEngine.parts.eventDisplay.getText();
        const xDisplay = await testEngine.parts.xDisplay.getText();
        const yDisplay = await testEngine.parts.yDisplay.getText();

        // The coordinates are rounded because e2e tests are not pixel perfect
        assertEqual(eventDisplay, 'mouseUp');
        assertEqual(Math.round(parseFloat(xDisplay ?? '')), 11);
        assertEqual(Math.round(parseFloat(yDisplay ?? '')), 15);
      });
    });
  },
};
