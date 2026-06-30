import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { CSSProperties, JSX, useCallback } from 'react';

// Mirrors MUI Rating's `.MuiRating-visuallyHidden` inputs: a 1px clipped radio a
// user cannot click by pointer, reachable only by a coordinate-free activation.
const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export const ActivateExample = () => {
  const [selected, setSelected] = React.useState<string>('');

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.value);
  }, []);

  return (
    <React.Fragment>
      <input
        data-testid='activate-first'
        style={visuallyHidden}
        type='radio'
        name='activate-group'
        value='first'
        onChange={onChange}
      />
      <input
        data-testid='activate-second'
        style={visuallyHidden}
        type='radio'
        name='activate-group'
        value='second'
        onChange={onChange}
      />
      {/* Records the value of the radio that activation selected. */}
      <div data-testid='activate-detail'>{selected}</div>
    </React.Fragment>
  );
};

export const activateUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Activate (coordinate-free)',
  ui: <ActivateExample />,
};
