import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { produce } from 'immer';
import { useCallback, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ShippingModel, emptySignupModel } from '../../models/SignupModel';
import { WizardProps } from '../../models/WizardProps';
import { AddressEntry, AddressEntryHandle } from '../addressEntry/AddressEntry';
import { WizardButton } from '../wizardButton/WizardButton';
import { ShippingAddressFormDataTestId } from './ShippingAddressFormDataTestId';

export function ShippingAddressForm(props: WizardProps) {
  const { onNextStep, onPreviousStep, data = emptySignupModel } = props;
  const addressRef = useRef<AddressEntryHandle>(null);

  const inputData = useMemo<ShippingModel>(() => {
    return {
      lastName: data.shipping?.lastName ?? '',
      firstName: data.shipping?.firstName ?? '',
      address: {
        address: data.shipping?.address?.address ?? '',
        city: data.shipping?.address?.city ?? '',
        state: data.shipping?.address?.state ?? '',
        zip: data.shipping?.address?.zip ?? ''
      }
    };
  }, [data]);

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    values: inputData
  });

  const validateAddress = useCallback(async () => {
    if (addressRef.current == null) {
      return;
    }
    const addressResult = await addressRef.current.getAddress();
    return addressResult;
  }, [addressRef.current]);

  const onNavigate = useCallback(
    (callback?: WizardProps['onNextStep']) => {
      return async (submission: ShippingModel) => {
        const addressResult = await validateAddress();
        if (addressResult?.valid) {
          const address = addressResult.address;
          const updated = produce(data, (draft) => {
            draft.shipping = submission;
            draft.shipping.address = address;
          });
          callback?.(updated);
        }
      };
    },
    [data, validateAddress]
  );

  return (
    <form data-testid={props['data-testid']} onSubmit={handleSubmit(onNavigate(onNextStep), validateAddress)}>
      <Stack flexDirection="column" gap={2}>
        <TextField
          data-testid={ShippingAddressFormDataTestId.firstNameInput}
          label="First Name"
          variant="outlined"
          error={!!errors.firstName}
          helperText={errors.firstName?.message?.toString()}
          {...register('firstName', { required: 'First name is required' })}
        />
        <TextField
          data-testid={ShippingAddressFormDataTestId.lastNameInput}
          label="Last Name"
          variant="outlined"
          error={!!errors.lastName}
          helperText={errors.lastName?.message?.toString()}
          {...register('lastName', { required: 'Last name is required' })}
        />
        <AddressEntry
          data-testid={ShippingAddressFormDataTestId.addressInput}
          ref={addressRef}
          data={inputData.address}
        />
        <WizardButton
          data-testid={ShippingAddressFormDataTestId.navigation}
          onPreviousStep={handleSubmit(onNavigate(onPreviousStep), validateAddress)}
          onNextStep={handleSubmit(onNavigate(onNextStep), validateAddress)}
        />
      </Stack>
    </form>
  );
}
