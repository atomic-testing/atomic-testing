import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AppDataTestId } from './AppDataTestId';
import { ProfileSettings } from './components/profileSettings/ProfileSettings';
import { WorkspaceHeader } from './components/workspaceHeader/WorkspaceHeader';

/**
 * A small "Workspace settings" dashboard built entirely from unmodified
 * `npx shadcn add` output (src/components/ui, style "radix-vega"): a header
 * with an account `DropdownMenu`, and a `Tabs` pair — the Profile tab holds
 * the form (`Input` + `Select` + Save) and the delete-workspace `Dialog`.
 * The `data-testid` root is the single anchor the shared {@link workspaceParts}
 * scene resolves from — in both jsdom and the browser.
 */
export default function App() {
  return (
    <div data-testid={AppDataTestId.root} className='min-h-screen bg-background text-foreground'>
      <WorkspaceHeader />
      <main className='mx-auto flex max-w-2xl flex-col gap-4 px-6 py-6'>
        <Tabs defaultValue='profile'>
          <TabsList data-testid={AppDataTestId.settingsTabs}>
            <TabsTrigger value='profile'>Profile</TabsTrigger>
            <TabsTrigger value='notifications'>Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value='profile'>
            <ProfileSettings />
          </TabsContent>
          <TabsContent value='notifications'>
            <div className='rounded-lg border p-4'>
              <h2 className='text-sm font-medium'>Notifications</h2>
              <p className='text-sm text-muted-foreground'>
                Email notifications are enabled for mentions and weekly digests. Routing rules are managed by your
                organization admin.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
