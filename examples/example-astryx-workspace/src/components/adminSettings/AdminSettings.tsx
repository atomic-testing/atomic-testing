import { AlertDialog } from '@astryxdesign/core/AlertDialog';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { CheckboxList, CheckboxListItem } from '@astryxdesign/core/CheckboxList';
import { DateInput } from '@astryxdesign/core/DateInput';
import { FormLayout } from '@astryxdesign/core/FormLayout';
import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Selector } from '@astryxdesign/core/Selector';
import { Stack } from '@astryxdesign/core/Stack';
import { Switch } from '@astryxdesign/core/Switch';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Toast } from '@astryxdesign/core/Toast';
import { useState } from 'react';

import { AppDataTestId } from '../../AppDataTestId';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import { CHANNEL_OPTIONS, DENSITY_OPTIONS, MODEL_OPTIONS, PLAN_OPTIONS } from '../../models/SettingsModel';
import { ADMIN_TABS, AdminSettingsDataTestId, PLAN_LABEL } from './AdminSettingsDataTestId';

/**
 * The admin settings console: a TabList over form controls (each tab's fields laid out
 * with FormLayout for uniform spacing), a persistent footer with the unsaved-changes
 * Banner + Save + Delete, a confirm AlertDialog, and a success Toast. State lives in
 * {@link useAdminSettings}, so switching tabs never loses a draft edit. The content is
 * width-capped so a settings form does not sprawl across a wide viewport.
 */
export function AdminSettings() {
  const { draft, dirty, savedToast, update, save, dismissToast, reset } = useAdminSettings();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <Stack as='section' data-testid={AppDataTestId.adminSection} gap={4} style={{ maxWidth: 720 }}>
      <TabList data-testid={AdminSettingsDataTestId.tabs} value={activeTab} onChange={setActiveTab} hasDivider>
        {ADMIN_TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </TabList>

      {activeTab === 'general' && (
        <FormLayout>
          <TextInput
            data-testid={AdminSettingsDataTestId.orgInput}
            label='Organization name'
            isRequired
            value={draft.orgName}
            onChange={(orgName) => update({ orgName })}
            status={
              draft.orgName.trim().length > 0
                ? undefined
                : { type: 'error', message: 'Organization name is required' }
            }
          />
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
        </FormLayout>
      )}

      {activeTab === 'notifications' && (
        <FormLayout>
          <CheckboxList
            data-testid={AdminSettingsDataTestId.channels}
            label='Notification channels'
            value={draft.channels}
            onChange={(channels) => update({ channels })}>
            {CHANNEL_OPTIONS.map((option) => (
              <CheckboxListItem key={option.value} value={option.value} label={option.label} />
            ))}
          </CheckboxList>
        </FormLayout>
      )}

      {activeTab === 'appearance' && (
        <FormLayout>
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
            width={280}
          />
        </FormLayout>
      )}

      <Stack gap={3}>
        {dirty && (
          <Banner
            data-testid={AdminSettingsDataTestId.unsavedBanner}
            status='warning'
            title='You have unsaved changes'
            description='Save to apply your settings.'
          />
        )}
        <Stack direction='horizontal' gap={2} align='center'>
          <Button data-testid={AdminSettingsDataTestId.save} label='Save changes' variant='primary' onClick={save} />
          <Button
            data-testid={AdminSettingsDataTestId.deleteTrigger}
            label='Delete workspace'
            variant='destructive'
            onClick={() => setIsDeleteOpen(true)}
          />
        </Stack>
      </Stack>

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
    </Stack>
  );
}
