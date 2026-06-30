import { AlertDialog } from '@astryxdesign/core/AlertDialog';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { CheckboxList, CheckboxListItem } from '@astryxdesign/core/CheckboxList';
import { DateInput } from '@astryxdesign/core/DateInput';
import { Field } from '@astryxdesign/core/Field';
import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Selector } from '@astryxdesign/core/Selector';
import { Switch } from '@astryxdesign/core/Switch';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { Toast } from '@astryxdesign/core/Toast';
import { useState } from 'react';

import { AppDataTestId } from '../../AppDataTestId';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import {
  CHANNEL_OPTIONS,
  DENSITY_OPTIONS,
  MODEL_OPTIONS,
  PLAN_OPTIONS,
} from '../../models/SettingsModel';
import { ADMIN_TABS, AdminSettingsDataTestId, ORG_INPUT_ID, PLAN_LABEL } from './AdminSettingsDataTestId';

/**
 * The admin settings console: a TabList over Field-wrapped form controls, a persistent
 * footer with the unsaved-changes Banner + Save + Delete, a confirm AlertDialog, and a
 * success Toast. State lives in {@link useAdminSettings}, so switching tabs never loses
 * a draft edit.
 */
export function AdminSettings() {
  const { draft, dirty, savedToast, update, save, dismissToast, reset } = useAdminSettings();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <section data-testid={AppDataTestId.adminSection}>
      <TabList data-testid={AdminSettingsDataTestId.tabs} value={activeTab} onChange={setActiveTab}>
        {ADMIN_TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </TabList>

      {activeTab === 'general' && (
        <div>
          <Field
            data-testid={AdminSettingsDataTestId.orgField}
            label='Organization name'
            inputID={ORG_INPUT_ID}
            isRequired
            status={
              draft.orgName.trim().length > 0
                ? undefined
                : { type: 'error', message: 'Organization name is required' }
            }>
            <input
              id={ORG_INPUT_ID}
              data-testid={AdminSettingsDataTestId.orgInput}
              value={draft.orgName}
              onChange={(e) => update({ orgName: e.target.value })}
            />
          </Field>

          <SegmentedControl value={draft.plan} onChange={(plan) => update({ plan })} label={PLAN_LABEL}>
            {PLAN_OPTIONS.map((option) => (
              <SegmentedControlItem key={option.value} value={option.value} label={option.label} />
            ))}
          </SegmentedControl>

          <DateInput
            data-testid={AdminSettingsDataTestId.renewal}
            label='Renews'
            value={draft.renewal}
            onChange={(renewal) => renewal != null && update({ renewal })}
          />
        </div>
      )}

      {activeTab === 'notifications' && (
        <CheckboxList
          data-testid={AdminSettingsDataTestId.channels}
          label='Notification channels'
          value={draft.channels}
          onChange={(channels) => update({ channels })}>
          {CHANNEL_OPTIONS.map((option) => (
            <CheckboxListItem key={option.value} value={option.value} label={option.label} />
          ))}
        </CheckboxList>
      )}

      {activeTab === 'appearance' && (
        <div>
          <RadioList
            data-testid={AdminSettingsDataTestId.density}
            label='Density'
            value={draft.density}
            onChange={(density) => update({ density })}>
            {DENSITY_OPTIONS.map((option) => (
              <RadioListItem key={option.value} value={option.value} label={option.label} />
            ))}
          </RadioList>

          <div data-testid={AdminSettingsDataTestId.betaField}>
            <Switch label='Beta features' value={draft.beta} onChange={(beta) => update({ beta })} />
          </div>

          <Selector
            data-testid={AdminSettingsDataTestId.model}
            label='Default model'
            value={draft.model}
            onChange={(model) => update({ model })}
            options={[...MODEL_OPTIONS]}
          />
        </div>
      )}

      <footer>
        {dirty && (
          <Banner
            data-testid={AdminSettingsDataTestId.unsavedBanner}
            status='warning'
            title='You have unsaved changes'
            description='Save to apply your settings.'
          />
        )}
        <Button data-testid={AdminSettingsDataTestId.save} label='Save changes' variant='primary' onClick={save} />
        <Button
          data-testid={AdminSettingsDataTestId.deleteTrigger}
          label='Delete workspace'
          variant='secondary'
          onClick={() => setIsDeleteOpen(true)}
        />
      </footer>

      <AlertDialog
        data-testid={AdminSettingsDataTestId.deleteDialog}
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title='Delete workspace?'
        description='This permanently removes the workspace and cannot be undone.'
        actionLabel='Delete'
        cancelLabel='Cancel'
        onAction={() => {
          reset();
          setIsDeleteOpen(false);
        }}
      />

      {savedToast && (
        <Toast type='info' body='Settings saved' isAutoHide={false} autoHideDuration={5000} onDismiss={dismissToast} />
      )}
    </section>
  );
}
