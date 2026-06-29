import { Toast } from '@astryxdesign/core/Toast';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx Toast scene.
 *
 * `Toast` renders directly (no provider needed) as a `.astryx-toast` root whose
 * `role` flips with severity (`status` vs `alert`) and whose stable type marker is
 * `data-type`. The info toast is removed by its `onDismiss` so a dismiss can be
 * observed; the error toast stays so the role/type flip can be compared. Auto-hide
 * is disabled to keep the DOM deterministic.
 */
export const ToastExample = () => {
  const [showInfo, setShowInfo] = useState(true);
  return (
    <div>
      {showInfo && (
        <Toast
          type='info'
          body='Changes saved'
          isAutoHide={false}
          autoHideDuration={5000}
          onDismiss={() => setShowInfo(false)}
        />
      )}
      <Toast type='error' body='Save failed' isAutoHide={false} autoHideDuration={5000} onDismiss={() => {}} />
      <div data-testid='info-present'>{showInfo ? 'yes' : 'no'}</div>
    </div>
  );
};

export const toastUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Toast',
  ui: <ToastExample />,
};
