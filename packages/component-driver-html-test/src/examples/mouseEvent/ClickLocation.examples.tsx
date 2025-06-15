import React, { useCallback, useState } from 'react';
import { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

import './ClickLocation.css';

export const ClickLocationMouseEventExample = () => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const [eventName, setEventName] = useState<string | null>(null);

  const displayEvent = useCallback((evt: React.MouseEvent<HTMLDivElement>, evtName: string) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    const x = evt.clientX - rect.left; //x position within the element.
    const y = evt.clientY - rect.top; //y position within the element.
    setMouseX(x);
    setMouseY(y);
    setEventName(evtName);
  }, []);

  const onClick = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      displayEvent(evt, 'click');
    },
    [displayEvent]
  );

  const onMouseDown = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      displayEvent(evt, 'mouseDown');
    },
    [displayEvent]
  );

  const onMouseUp = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      displayEvent(evt, 'mouseUp');
    },
    [displayEvent]
  );

  return (
    <React.Fragment>
      <div
        style={{ cursor: 'crosshair', backgroundColor: '#0099ff', width: '20rem', height: '12rem' }}
        data-testid='click-target'
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}></div>
      <div className='mouse-event'>
        <span className='label'>Event</span>
        <span className='value' data-testid='event-name'>
          {eventName}
        </span>

        <span className='label'>X</span>
        <span className='value' data-testid='position-x'>
          {mouseX}
        </span>

        <span className='label'>Y</span>
        <span className='value' data-testid='position-y'>
          {mouseY}
        </span>
      </div>
    </React.Fragment>
  );
};

export const clickLocationMouseEventUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Click location',
  ui: <ClickLocationMouseEventExample />,
};
