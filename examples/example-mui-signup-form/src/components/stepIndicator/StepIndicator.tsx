import { Step, StepLabel, Stepper } from '@mui/material';
import { steps } from '../../data/steps';
import { HasDataTestId } from '../../models/types';

export interface StepIndicatorProps extends HasDataTestId {
  currentStep: number;
}

export function StepIndicator(props: StepIndicatorProps) {
  const { currentStep } = props;
  return (
    <Stepper data-testid={props['data-testid']} activeStep={currentStep - 1} alternativeLabel>
      {steps.map((step) => (
        <Step key={step.sequence}>
          <StepLabel>{step.name}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
