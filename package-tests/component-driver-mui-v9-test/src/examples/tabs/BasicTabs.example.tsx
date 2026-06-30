import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';

//#region Basic Tabs
export const BasicTabsExample = () => {
  // Two independent tab groups verify a locator is correctly scoped to its own
  // root (disambiguation), and a third group with no selection (value={false})
  // exercises the "nothing selected" path.
  const [fruit, setFruit] = React.useState(0);
  const [color, setColor] = React.useState(2);

  return (
    <Box>
      <Tabs
        data-testid='fruit-tabs'
        value={fruit}
        onChange={(_e, next: number) => setFruit(next)}
        aria-label='fruit tabs'>
        <Tab label='Apple' />
        <Tab label='Banana' />
        <Tab label='Cherry' disabled />
      </Tabs>

      <Tabs
        data-testid='color-tabs'
        value={color}
        onChange={(_e, next: number) => setColor(next)}
        aria-label='color tabs'>
        <Tab label='Red' />
        <Tab label='Green' />
        <Tab label='Blue' />
      </Tabs>

      <Tabs data-testid='empty-tabs' value={false} aria-label='no selection tabs'>
        <Tab label='First' />
        <Tab label='Second' />
      </Tabs>
    </Box>
  );
};

/**
 * Basic tabs example adapted from the MUI website.
 * @see https://mui.com/material-ui/react-tabs/
 */
export const basicTabsUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Tabs',
  ui: <BasicTabsExample />,
};
//#endregion
