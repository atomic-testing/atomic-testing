import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import React from 'react';

//#region Basic SpeedDial
const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

const otherActions = [
  { icon: <SaveIcon />, name: 'Edit' },
  { icon: <ShareIcon />, name: 'Delete' },
];

export const BasicSpeedDialExample = () => {
  // Controlled so the FAB click toggles open/close deterministically in tests.
  const [open, setOpen] = React.useState(false);
  // A second dial (opposite corner so they don't overlap) verifies locator scoping.
  const [otherOpen, setOtherOpen] = React.useState(false);
  const [lastAction, setLastAction] = React.useState('');

  return (
    <Box sx={{ height: 360, position: 'relative' }}>
      <div data-testid='last-action'>{lastAction}</div>
      <SpeedDial
        data-testid='basic-speed-dial'
        ariaLabel='SpeedDial example'
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}>
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => setLastAction(action.name)}
          />
        ))}
      </SpeedDial>

      <SpeedDial
        data-testid='other-speed-dial'
        ariaLabel='Other SpeedDial'
        direction='down'
        sx={{ position: 'absolute', top: 16, left: 16 }}
        icon={<SpeedDialIcon />}
        open={otherOpen}
        onOpen={() => setOtherOpen(true)}
        onClose={() => setOtherOpen(false)}>
        {otherActions.map(action => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
        ))}
      </SpeedDial>
    </Box>
  );
};

/**
 * Basic speed dial example adapted from the MUI website.
 * @see https://mui.com/material-ui/react-speed-dial/
 */
export const basicSpeedDialUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic SpeedDial',
  ui: <BasicSpeedDialExample />,
};
//#endregion
