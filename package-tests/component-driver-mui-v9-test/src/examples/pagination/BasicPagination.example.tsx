import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import React from 'react';

//#region Basic Pagination
export const BasicPaginationExample = () => {
  // Two paginations verify locator scoping; `beta` starts on page 1 so its
  // previous/first controls are disabled (the bounds case).
  const [alpha, setAlpha] = React.useState(2);
  const [beta, setBeta] = React.useState(1);

  return (
    <Box>
      <Pagination
        data-testid='alpha-pagination'
        count={5}
        page={alpha}
        onChange={(_e, page: number) => setAlpha(page)}
        showFirstButton
        showLastButton
      />
      <Pagination
        data-testid='beta-pagination'
        count={3}
        page={beta}
        onChange={(_e, page: number) => setBeta(page)}
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

/**
 * Basic pagination example adapted from the MUI website.
 * @see https://mui.com/material-ui/react-pagination/
 */
export const basicPaginationUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Pagination',
  ui: <BasicPaginationExample />,
};
//#endregion
