import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { usStates } from '../../data/usStates';
import { AddressModel } from '../../models/Address';
import { HasDataTestId } from '../../models/types';
import { AddressEntryDataTestId } from './AddressEntryDataTestId';

export interface AddressEntryProps extends HasDataTestId {
  data: Partial<AddressModel>;
  disabled?: boolean;
}

export interface ValidGetAddressReturn {
  valid: true;
  address: AddressModel;
}

export interface InvalidGetAddressReturn {
  valid: false;
}

export type GetAddressReturn = ValidGetAddressReturn | InvalidGetAddressReturn;

export interface AddressEntryHandle {
  getAddress(): Promise<GetAddressReturn>;
}

export const AddressEntry = forwardRef<AddressEntryHandle, AddressEntryProps>((props, ref) => {
  const { data = {}, disabled = false } = props;
  const inputData = useMemo<AddressModel>(() => {
    return {
      address: data.address ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
      zip: data.zip ?? ''
    };
  }, [data]);
  const {
    control,
    register,
    formState: { errors },
    getValues,
    trigger,
    clearErrors
  } = useForm({ values: inputData });

  const getAddress = useCallback(async (): Promise<GetAddressReturn> => {
    const isValid = await trigger();
    if (isValid) {
      clearErrors();
      return { valid: true, address: getValues() };
    } else {
      return { valid: false };
    }
  }, [trigger, getValues, clearErrors]);

  useImperativeHandle(
    ref,
    () => ({
      getAddress
    }),
    [getAddress]
  );

  return (
    <Grid data-testid={props['data-testid']} container spacing={2}>
      <Grid item xs={12}>
        <TextField
          data-testid={AddressEntryDataTestId.addressInput}
          {...register('address', { required: 'Address is required' })}
          label="Address"
          variant="outlined"
          error={!!errors.address}
          helperText={errors.address?.message?.toString()}
          fullWidth
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          data-testid={AddressEntryDataTestId.cityInput}
          {...register('city', { required: 'City is required' })}
          label="City"
          variant="outlined"
          error={!!errors.city}
          helperText={errors.city?.message?.toString()}
          fullWidth
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={3}>
        <Controller
          control={control}
          name="state"
          rules={{ required: 'State is required' }}
          render={(props) => {
            return (
              <TextField
                data-testid={AddressEntryDataTestId.stateInput}
                select
                label="State"
                variant="outlined"
                error={!!errors.state}
                helperText={errors.state?.message?.toString()}
                fullWidth
                disabled={disabled}
                inputProps={{
                  ...props.field
                }}
              >
                {usStates.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            );
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          data-testid={AddressEntryDataTestId.zipInput}
          {...register('zip', {
            required: 'ZIP Code is required',
            pattern: {
              value: /^\d{5}(-\d{4})?$/,
              message: 'Invalid ZIP Code'
            }
          })}
          label="ZIP Code"
          variant="outlined"
          error={!!errors.zip}
          helperText={errors.zip?.message?.toString()}
          fullWidth
          disabled={disabled}
        />
      </Grid>
    </Grid>
  );
});
