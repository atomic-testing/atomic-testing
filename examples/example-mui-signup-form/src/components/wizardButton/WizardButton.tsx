import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { HasDataTestId } from '../../models/types';
import { WizardButtonDataTestId } from './WizardButtonDataTestId';

export interface WizardButtonProps extends HasDataTestId {
  isFirstStep?: boolean;
  isLastStep?: boolean;
  onPreviousStep?: () => void;
  onNextStep?: () => void;
}

export function WizardButton(props: WizardButtonProps) {
  const { isFirstStep = false, isLastStep = false, onPreviousStep, onNextStep } = props;
  return (
    <Stack data-testid={props['data-testid']} width="100%" direction="row" gap={2}>
      <Button
        data-testid={WizardButtonDataTestId.previousButton}
        variant="outlined"
        type="submit"
        fullWidth
        disabled={isFirstStep}
        onClick={onPreviousStep}
      >
        Previous
      </Button>
      <Button
        data-testid={WizardButtonDataTestId.nextButton}
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLastStep}
        onClick={onNextStep}
      >
        Next
      </Button>
    </Stack>
  );
}
