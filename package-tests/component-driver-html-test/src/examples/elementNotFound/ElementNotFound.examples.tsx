import { IExampleUIUnit } from '@atomic-testing/core';
import { JSX, useState } from 'react';

/**
 * Minimal page for the element-not-found contract suite: one present, clickable
 * element so the happy path can be exercised, while the suite queries a
 * deliberately-absent locator to assert the cross-adapter error contract.
 */
export const ElementNotFoundExample = () => {
  const [clicked, setClicked] = useState(false);
  return (
    <div>
      <button type='button' data-testid='present' onClick={() => setClicked(true)}>
        {clicked ? 'clicked' : 'not clicked'}
      </button>
    </div>
  );
};

export const elementNotFoundUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Element not found contract',
  ui: <ElementNotFoundExample />,
};
