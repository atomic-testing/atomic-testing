import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import { produce } from 'immer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { userInterests } from '../../data/userInterests';
import { InterestModel, emptySignupModel } from '../../models/SignupModel';
import { WizardProps } from '../../models/WizardProps';
import { WizardButton } from '../wizardButton/WizardButton';
import { InterestFormDataTestId } from './InterestFormDataTestId';

const minimumInterestCount = 2;

export function InterestForm(props: WizardProps) {
  const { onNextStep, onPreviousStep, data = emptySignupModel } = props;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set((data?.interest?.interestIds ?? []) as string[]));
  const inputData = useMemo<InterestModel>(() => {
    return {
      interestIds: (data?.interest?.interestIds ?? []) as string[]
    };
  }, [data]);

  useEffect(() => {
    const selectedIds: Set<string> = new Set((data?.interest?.interestIds ?? []) as string[]);
    setSelectedIds(selectedIds);
  }, [data]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
    setValue
  } = useForm<InterestModel>({
    values: inputData
  });

  function checkbox_onSelect(interestId: string) {
    const updated = new Set(selectedIds);
    if (selectedIds.has(interestId)) {
      updated.delete(interestId);
    } else {
      updated.add(interestId);
    }
    setSelectedIds(updated);
  }

  const onNavigate = useCallback(
    (callback?: WizardProps['onNextStep']) => {
      return (submission: InterestModel) => {
        if (submission.interestIds.length < minimumInterestCount) {
          setError('interestIds', {
            type: 'manual',
            message: `Please select at least ${minimumInterestCount} interests.`
          });
          return;
        }

        clearErrors();
        const updated = produce(data, (draft) => {
          draft.interest = submission;
        });
        callback?.(updated);
      };
    },
    [setError, clearErrors, data, handleSubmit]
  );

  useEffect(() => {
    setValue('interestIds', Array.from(selectedIds));
  }, [selectedIds, setValue]);

  return (
    <form data-testid={props['data-testid']} onSubmit={handleSubmit(onNavigate(onNextStep))}>
      <Stack flexDirection="column" gap={2}>
        <FormControl variant="outlined">
          <FormLabel component="legend">Please select at least {minimumInterestCount} interests</FormLabel>
          <Stack flexDirection="column" gap={0}>
            {userInterests.map((option) => (
              <FormControlLabel
                key={option.id}
                data-testid={InterestFormDataTestId.interestToggle}
                control={
                  <Controller
                    name="interestIds"
                    control={control}
                    render={(props) => {
                      return (
                        <Checkbox
                          {...props.field}
                          value={option.id}
                          checked={selectedIds.has(option.id)}
                          onChange={() => checkbox_onSelect(option.id)}
                        />
                      );
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </Stack>
        </FormControl>
        {errors.interestIds && (
          <FormHelperText data-testid={InterestFormDataTestId.selectedInterestError} error>
            {errors.interestIds.message?.toString()}
          </FormHelperText>
        )}
        <WizardButton
          data-testid={InterestFormDataTestId.navigation}
          onPreviousStep={handleSubmit(onNavigate(onPreviousStep))}
          onNextStep={handleSubmit(onNavigate(onNextStep))}
        />
      </Stack>
    </form>
  );
}
