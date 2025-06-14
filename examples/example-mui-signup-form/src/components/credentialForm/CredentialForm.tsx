import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { differenceInYears, parseISO } from 'date-fns';
import { produce } from 'immer';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { emptySignupModel } from '../../models/SignupModel';
import { WizardProps } from '../../models/WizardProps';
import { WizardButton } from '../wizardButton/WizardButton';
import { CredentialFormDataTestId } from './CredentialFormDataTestId';

export interface CredentialFormData {
  email: string;
  password: string;
  confirmPassword: string;
  birthday: string;
}

export function CredentialForm(props: WizardProps) {
  const { onNextStep, data = emptySignupModel } = props;

  const inputData = useMemo<CredentialFormData>(() => {
    return {
      email: data.credential?.email ?? '',
      password: data.credential?.password ?? '',
      confirmPassword: data.credential?.password ?? '',
      birthday: data.credential?.birthday ?? ''
    };
  }, [data]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors
  } = useForm<CredentialFormData>({
    values: inputData
  });

  const onNavigate = useCallback(
    (callback?: WizardProps['onNextStep']) => {
      return (submission: CredentialFormData) => {
        if (submission.password.length < 8) {
          setError('password', {
            type: 'manual',
            message: 'Password must be at least 8 characters long'
          });
          return;
        }

        // Check if user is at least 18 years old
        const age = differenceInYears(new Date(), parseISO(submission.birthday));
        if (age < 18) {
          setError('birthday', {
            type: 'manual',
            message: 'You must be at least 18 years old to sign up.'
          });
          return;
        }

        clearErrors();
        const updated = produce(data, (draft) => {
          draft.credential = submission;
        });
        callback?.(updated);
      };
    },
    [setError, clearErrors, data, handleSubmit]
  );

  return (
    <form data-testid={props['data-testid']} onSubmit={handleSubmit(onNavigate(onNextStep))}>
      <Stack flexDirection="column" gap={2}>
        <TextField
          data-testid={CredentialFormDataTestId.emailInput}
          label="Email"
          variant="outlined"
          error={!!errors.email}
          helperText={errors.email?.message?.toString()}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Invalid email address'
            }
          })}
        />
        <TextField
          data-testid={CredentialFormDataTestId.passwordInput}
          label="Password"
          type="password"
          variant="outlined"
          error={!!errors.password}
          helperText={errors.password?.message?.toString()}
          {...register('password', { required: 'Password is required' })}
        />
        <TextField
          data-testid={CredentialFormDataTestId.confirmPasswordInput}
          label="Confirm Password"
          type="password"
          variant="outlined"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword && 'Passwords do not match'}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === watch('password') || 'Passwords do not match'
          })}
        />
        <TextField
          data-testid={CredentialFormDataTestId.birthdayInput}
          label="Birthday"
          type="date"
          InputLabelProps={{ shrink: true }}
          error={!!errors.birthday}
          helperText={errors.birthday?.message?.toString()}
          {...register('birthday', { required: 'Birthday is required' })}
        />
        <WizardButton
          data-testid={CredentialFormDataTestId.navigation}
          isFirstStep
          onNextStep={handleSubmit(onNavigate(onNextStep))}
        />
      </Stack>
    </form>
  );
}
