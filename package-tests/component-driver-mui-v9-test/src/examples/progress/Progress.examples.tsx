import { IExampleUIUnit } from '@atomic-testing/core';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// import Typography from '@mui/material/Typography';

//#region Basic Progress
export const BasicProgress: React.FunctionComponent = () => {
  return (
    <Stack direction='column' gap={5}>
      <Stack direction='column'>
        <Typography>Circular</Typography>
        <CircularProgress data-testid='circular' variant='determinate' value={25} />
      </Stack>

      <Divider />

      <Stack direction='column'>
        <Typography>Circular Indeterminate</Typography>
        <CircularProgress data-testid='circular-indeterminate' variant='indeterminate' value={30} />
      </Stack>

      <Divider />

      <Stack direction='column'>
        <Typography>Linear Indeterminate</Typography>
        <LinearProgress data-testid='linear-indeterminate' />
      </Stack>

      <Divider />

      <Stack direction='column'>
        <Typography>Linear Determinate</Typography>
        <LinearProgress data-testid='linear-determinate' variant='determinate' value={50} />
      </Stack>

      <Divider />

      <Stack direction='column'>
        <Typography>Linear with Buffer</Typography>
        <LinearProgress data-testid='linear-buffer' variant='buffer' value={70} valueBuffer={85} />
      </Stack>
    </Stack>
  );
};

/**
 * Basic Progress example from MUI's website
 * @see https://mui.com/material-ui/react-progress
 */
export const basicProgressUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Progress',
  ui: <BasicProgress />,
};
//#endregion
