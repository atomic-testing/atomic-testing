import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { produce } from 'immer';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BillingModel, emptySignupModel } from '../../models/SignupModel';
import { WizardProps } from '../../models/WizardProps';
import { AddressEntry, AddressEntryHandle } from '../addressEntry/AddressEntry';
import { WizardButton } from '../wizardButton/WizardButton';
import { BillingAddressFormDataTestId } from './BillingAddressFormDataTestId';

export function BillingAddressForm(props: WizardProps) {
  const { onNextStep, onPreviousStep, data = emptySignupModel } = props;
  const [sameAsShipping, setSameAsShipping] = useState<boolean>(data.billing?.sameAsShipping ?? false);

  useEffect(() => {
    setSameAsShipping(data.billing?.sameAsShipping ?? false);
  }, [data]);
  const addressRef = useRef<AddressEntryHandle>(null);

  const inputData = useMemo<BillingModel>(() => {
    return {
      sameAsShipping,
      address: {
        address: (sameAsShipping ? data.shipping?.address?.address : data.billing?.address?.address) ?? '',
        city: (sameAsShipping ? data.shipping?.address?.city : data.billing?.address?.city) ?? '',
        state: (sameAsShipping ? data.shipping?.address?.state : data.billing?.address?.state) ?? '',
        zip: (sameAsShipping ? data.shipping?.address?.zip : data.billing?.address?.zip) ?? ''
      }
    };
  }, [data, sameAsShipping]);
  const { handleSubmit, control } = useForm({
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
      return async (submission: BillingModel) => {
        const addressResult = await validateAddress();
        if (addressResult?.valid) {
          const address = addressResult.address;
          const updated = produce(data, (draft) => {
            draft.billing = submission;
            draft.billing.address = address;
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
        <Controller
          control={control}
          name="sameAsShipping"
          render={(props) => {
            return (
              <FormControlLabel
                label="Same as shipping"
                control={
                  <Switch
                    {...props.field}
                    data-testid={BillingAddressFormDataTestId.sameAsShippingInput}
                    onChange={(_, checked) => setSameAsShipping(checked)}
                  />
                }
              />
            );
          }}
        />
        <AddressEntry
          data-testid={BillingAddressFormDataTestId.billingAddressInput}
          key={sameAsShipping.toString()}
          ref={addressRef}
          data={inputData.address}
          disabled={sameAsShipping}
        />
        <WizardButton
          data-testid={BillingAddressFormDataTestId.navigation}
          onPreviousStep={handleSubmit(onNavigate(onPreviousStep), validateAddress)}
          onNextStep={handleSubmit(onNavigate(onNextStep), validateAddress)}
        />
      </Stack>
    </form>
  );
}
