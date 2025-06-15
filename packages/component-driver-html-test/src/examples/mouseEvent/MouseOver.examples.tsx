import React, { useCallback, useState } from 'react';
import { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

import './ClickLocation.css';

export const MouseOverMouseEventExample = () => {
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [mouseOut, setMouseOut] = useState<boolean>(false);
  const [mouseEnter, setMouseEnter] = useState<boolean>(false);
  const [mouseLeave, setMouseLeave] = useState<boolean>(false);

  const onMouseOver = useCallback(() => {
    setMouseOver(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setMouseOut(true);
  }, []);

  const onMouseEnter = useCallback(() => {
    setMouseEnter(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setMouseLeave(true);
  }, []);

  return (
    <React.Fragment>
      <div
        style={{ cursor: 'crosshair', backgroundColor: '#9922cc', width: '20rem', height: '12rem' }}
        data-testid='mouse-over-target'
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}></div>
      <div className='mouse-event'>
        <span className='label'>MouseOver</span>
        <span className='value' data-testid='mouse-over'>
          {mouseOver ? 'true' : 'false'}
        </span>

        <span className='label'>MouseOut</span>
        <span className='value' data-testid='mouse-out'>
          {mouseOut ? 'true' : 'false'}
        </span>

        <span className='label'>MouseEnter</span>
        <span className='value' data-testid='mouse-enter'>
          {mouseEnter ? 'true' : 'false'}
        </span>

        <span className='label'>MouseLeave</span>
        <span className='value' data-testid='mouse-leave'>
          {mouseLeave ? 'true' : 'false'}
        </span>
      </div>
    </React.Fragment>
  );
};

export const mouseOverMouseEventUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Mouse over/out/enter/leave',
  ui: <MouseOverMouseEventExample />,
};
