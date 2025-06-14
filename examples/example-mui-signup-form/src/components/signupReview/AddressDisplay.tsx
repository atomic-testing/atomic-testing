import { type DeepReadonly } from 'utility-types';
import { AddressModel } from '../../models/Address';
import { HasDataTestId } from '../../models/types';
import { LineItem } from './LineItem';

export interface AddressDisplayProps extends HasDataTestId {
  data: DeepReadonly<AddressModel>;
  onClick?: () => void;
}

export const AddressDisplayDataTestId = {
  address: 'address',
  cityStateZip: 'city-state-zip'
} as const;

export function AddressDisplay(props: AddressDisplayProps) {
  const { data, onClick } = props;

  return (
    <>
      <LineItem data-testid={AddressDisplayDataTestId.address} label="Address" value={data.address} onClick={onClick} />
      <LineItem
        data-testid={AddressDisplayDataTestId.cityStateZip}
        label="City, State, Zip"
        noDivider
        value={`${data.city}, ${data.state} ${data.zip}`}
        onClick={onClick}
      />
    </>
  );
}
