import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { DeepPartial } from 'react-hook-form';
import { AppDataTestId } from './AppDataTestId';
import { BillingAddressForm } from './components/billingAddressForm/BillingAddressForm';
import { Confirmation } from './components/confirmation/Confirmation';
import { CredentialForm } from './components/credentialForm/CredentialForm';
import { InterestForm } from './components/interestForm/InterestForm';
import { ShippingAddressForm } from './components/shippingAddressForm/ShippingAddressForm';
import { SignupReview } from './components/signupReview/SignupReview';
import { StepIndicator } from './components/stepIndicator/StepIndicator';
import { SignupModel, emptySignupModel } from './models/SignupModel';

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DeepPartial<SignupModel>>(emptySignupModel);

  const nextStep = (data: DeepPartial<SignupModel>) => {
    setFormData(data);
    setCurrentStep(currentStep + 1);
  };

  const previousStep = (data: DeepPartial<SignupModel>) => {
    setFormData(data);
    setCurrentStep(currentStep - 1);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmitFinal = () => {
    setCurrentStep(currentStep + 1);
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <CredentialForm data-testid={AppDataTestId.credential} data={formData} onNextStep={nextStep} />;
      case 2:
        return (
          <ShippingAddressForm
            data-testid={AppDataTestId.shipping}
            data={formData}
            onNextStep={nextStep}
            onPreviousStep={previousStep}
          />
        );
      case 3:
        return (
          <BillingAddressForm
            data-testid={AppDataTestId.billing}
            data={formData}
            onNextStep={nextStep}
            onPreviousStep={previousStep}
          />
        );
      case 4:
        return (
          <InterestForm
            data-testid={AppDataTestId.interest}
            data={formData}
            onNextStep={nextStep}
            onPreviousStep={previousStep}
          />
        );
      case 5:
        return (
          <SignupReview
            data-testid={AppDataTestId.review}
            data={formData as SignupModel}
            onGotoStep={goToStep}
            onNextStep={handleSubmitFinal}
          />
        );
      case 6:
        return <Confirmation data-testid={AppDataTestId.confirmation} />;
      default:
        return <CredentialForm data-testid={AppDataTestId.credential} data={formData} onNextStep={nextStep} />;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 10 }}>
      <Stack width="100%" direction="column" alignItems="stretch" gap={3}>
        <Stack width="100%" direction="column" alignItems="center" gap={1}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h5" variant="h5">
            Sign up
          </Typography>
        </Stack>
        {currentStep <= 5 && <StepIndicator data-testid={AppDataTestId.stepper} currentStep={currentStep} />}
        {renderStepComponent()}
      </Stack>
    </Container>
  );
};

export default App;
