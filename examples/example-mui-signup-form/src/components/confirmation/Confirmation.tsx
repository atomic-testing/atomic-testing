import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { HasDataTestId } from '../../models/types';

export interface ConfirmationProps extends HasDataTestId {}

export function Confirmation(props: ConfirmationProps) {
  return (
    <Box data-testid={props['data-testid']} textAlign="center" p={5}>
      <Typography variant="h3" gutterBottom>
        Congratulations!
      </Typography>
      <Typography variant="h5" gutterBottom>
        You've successfully signed up.
      </Typography>
      <Typography paragraph>Welcome to the community. We're thrilled to have you onboard!</Typography>
    </Box>
  );
}
