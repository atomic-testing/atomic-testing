import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';
import React from 'react';

//#region Basic Stepper
const steps = ['Select campaign', 'Create an ad group', 'Create an ad'];

const otherSteps = ['Cart', 'Address'];

export const BasicStepperExample = () => {
  // Non-linear so steps are clickable; step 0 completed, step 1 active, step 2 disabled.
  const [activeStep, setActiveStep] = React.useState(1);
  // A second stepper verifies locators stay scoped to their own root.
  const [otherStep, setOtherStep] = React.useState(0);

  return (
    // Space the two steppers apart: MUI StepButtons extend past the stepper box
    // via negative margins, so without a gap the rows overlap and a click on one
    // stepper can land on the other.
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Stepper data-testid='basic-stepper' nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={index === 0} disabled={index === 2}>
            <StepButton onClick={() => setActiveStep(index)}>{label}</StepButton>
          </Step>
        ))}
      </Stepper>

      <Stepper data-testid='other-stepper' nonLinear activeStep={otherStep}>
        {otherSteps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={() => setOtherStep(index)}>{label}</StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

/**
 * Basic stepper example adapted from the MUI website.
 * @see https://mui.com/material-ui/react-stepper/
 */
export const basicStepperUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Stepper',
  ui: <BasicStepperExample />,
};
//#endregion
