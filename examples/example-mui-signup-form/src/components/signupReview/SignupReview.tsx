import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import { userInterests } from '../../data/userInterests';
import { SignupModel } from '../../models/SignupModel';
import { WizardProps } from '../../models/WizardProps';
import { WizardButton } from '../wizardButton/WizardButton';
import { AddressDisplay } from './AddressDisplay';
import { LineItem } from './LineItem';
import { SignupReviewDataTestId } from './SignupReviewDataTestId';

export interface SignupReviewProps extends WizardProps<SignupModel> {
  onGotoStep?: (step: number) => void;
}

export function SignupReview(props: SignupReviewProps) {
  const { data, onGotoStep, onNextStep, onPreviousStep } = props;

  function onItemClick(step: number) {
    return () => onGotoStep?.(step);
  }

  return (
    <Stack data-testid={props['data-testid']} direction="column" gap={2}>
      <List>
        <ListSubheader>Credentials</ListSubheader>
        <LineItem
          data-testid={SignupReviewDataTestId.email}
          label="Email"
          value={data.credential.email}
          onClick={onItemClick(0)}
        />
        <LineItem
          data-testid={SignupReviewDataTestId.password}
          label="Password"
          value={new Array(data.credential.password.length).fill('*', 0, data.credential.password.length).join('')}
          onClick={onItemClick(0)}
        />
        <LineItem
          label="Birthday"
          value={new Date(data.credential.birthday).toLocaleDateString()}
          noDivider
          onClick={onItemClick(0)}
        />

        <ListSubheader>Shipping</ListSubheader>
        <LineItem
          data-testid={SignupReviewDataTestId.firstName}
          label="First Name"
          value={data.shipping.firstName}
          onClick={onItemClick(1)}
        />
        <LineItem label="Last Name" value={data.shipping.lastName} onClick={onItemClick(1)} />
        <AddressDisplay data={data.shipping.address} onClick={onItemClick(1)} />

        <ListSubheader>Billing</ListSubheader>
        <LineItem
          data-testid={SignupReviewDataTestId.sameAsShipping}
          label="Same as shipping"
          value={data.billing.sameAsShipping ? 'Yes' : 'No'}
          onClick={onItemClick(2)}
        />
        <AddressDisplay data={data.billing.address} onClick={onItemClick(2)} />

        <ListSubheader>Interests</ListSubheader>
        <LineItem
          data-testid={SignupReviewDataTestId.interest}
          value=""
          noDivider
          label={userInterests
            .filter((interest) => data.interest.interestIds.includes(interest.id))
            .map((interest) => interest.label)
            .join(', ')}
          onClick={onItemClick(3)}
        />
      </List>

      <WizardButton
        data-testid={SignupReviewDataTestId.navigation}
        onPreviousStep={() => onPreviousStep?.(data)}
        onNextStep={() => onNextStep?.(data)}
      />
    </Stack>
  );
}
