import { IExampleUIUnit } from '@atomic-testing/core';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

//#region Basic Tooltip
export const BasicTooltipExample = () => {
  return (
    <div style={{ display: 'flex', gap: 32, padding: 64 }}>
      {/* enterDelay/leaveDelay 0 (no timers) and an instant transition (timeout 0)
          so hover shows/hides the tooltip synchronously — keeping the driver
          deterministic in jsdom and avoiding a lingering exit transition that could
          let one trigger's tooltip be read while another's is closing. */}
      <Tooltip title='Delete the item' enterDelay={0} leaveDelay={0} slotProps={{ transition: { timeout: 0 } }}>
        <Button data-testid='delete-button'>Delete</Button>
      </Tooltip>

      {/* A second tooltip verifies the driver reads its own trigger's tooltip. */}
      <Tooltip title='Add an item' enterDelay={0} leaveDelay={0} slotProps={{ transition: { timeout: 0 } }}>
        <Button data-testid='add-button'>Add</Button>
      </Tooltip>

      {/* A bare button with no tooltip exercises the absent case. */}
      <Button data-testid='plain-button'>Plain</Button>
    </div>
  );
};

/**
 * Basic tooltip example adapted from the MUI website.
 * @see https://mui.com/material-ui/react-tooltip/
 */
export const basicTooltipUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Tooltip',
  ui: <BasicTooltipExample />,
};
//#endregion
