import React, { useCallback, JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

export const HoverMouseEventExample = () => {
  const [showDetail, setShowDetail] = React.useState(false);

  const onMouseOver = useCallback(() => {
    setShowDetail(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setShowDetail(false);
  }, []);

  return (
    <React.Fragment>
      <button data-testid='hover-target' onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
        Hover me to show
      </button>
      {showDetail ? <div data-testid='hover-detail'>Details shown</div> : null}
    </React.Fragment>
  );
};

export const hoverMouseEventUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Hover event',
  ui: <HoverMouseEventExample />,
};
