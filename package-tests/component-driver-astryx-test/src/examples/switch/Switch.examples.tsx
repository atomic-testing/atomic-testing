import { Switch } from '@astryxdesign/core/Switch';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx Switch scene.
 *
 * Astryx puts `role="switch"` on the inner `<input type="checkbox">` and does NOT
 * forward `data-testid`, so each switch is wrapped in a testid'd container and the
 * scene scopes to `byRole('switch')`. The "Org-wide" instance is disabled with
 * a `disabledMessage`, reaching a `role="tooltip"` layer through the composed
 * `aria-describedby`.
 */
export const SwitchExample = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div>
      <div data-testid='notif-wrap'>
        <Switch label='Notifications' value={notifications} onChange={c => setNotifications(c)} />
      </div>
      <div data-testid='dark-wrap'>
        <Switch label='Dark mode' value={darkMode} onChange={c => setDarkMode(c)} />
      </div>
      <div data-testid='orgwide-wrap'>
        <Switch
          label='Org-wide setting'
          value={false}
          onChange={() => {}}
          isDisabled
          disabledMessage='Notifications are turned off org-wide'
        />
      </div>
    </div>
  );
};

export const switchControlUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Switch',
  ui: <SwitchExample />,
};
