import React, { useCallback, JSX } from 'react';
import { IExampleUIUnit } from '@atomic-testing/core';

export const HoverAnchorExample = () => {
  const [showDetail, setShowDetail] = React.useState(false);

  const onMouseOver = useCallback(() => {
    setShowDetail(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setShowDetail(false);
  }, []);

  return (
    <React.Fragment>
      <a data-testid='hover-target' onMouseOver={onMouseOver} onMouseOut={onMouseOut}>Hover me to show</a>
      {showDetail ? <div data-testid='hover-detail'>Details shown</div> : null}
    </React.Fragment>
  );
};

export const hoverAnchorUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Anchor hover event',
  ui: <HoverAnchorExample />,
};
