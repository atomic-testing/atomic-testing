import { FieldStatus } from '@astryxdesign/core/FieldStatus';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx FieldStatus scene.
 *
 * FieldStatus renders one `<div>` whose `role` is conditional (`alert` for error,
 * `status` otherwise) while the stable severity lives in `data-type`. It forwards
 * `data-testid` onto the root, so the scene anchors there.
 */
export const FieldStatusExample = () => (
  <div>
    <FieldStatus type='error' message='This field is required' data-testid='error-status' />
    <FieldStatus type='warning' message='Heads up' data-testid='warning-status' />
  </div>
);

export const fieldStatusUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx FieldStatus',
  ui: <FieldStatusExample />,
};
