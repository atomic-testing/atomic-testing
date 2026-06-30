import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppDataTestId } from './AppDataTestId';
import { AdminSettings } from './components/adminSettings/AdminSettings';
import { ChatPanel } from './components/chatPanel/ChatPanel';
import { WorkspaceShell } from './components/workspaceShell/WorkspaceShell';
import { ChatSessionProvider } from './hooks/ChatSessionProvider';

/**
 * The whole workspace behind one AppShell: the SideNav switches between the co-equal
 * Chat (`/`) and Admin (`/admin`) sections. The `data-testid` root is the single anchor
 * the shared {@link workspaceParts} scene resolves from — in both jsdom and the browser.
 */
export default function App() {
  return (
    <div data-testid={AppDataTestId.root}>
      <ChatSessionProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<WorkspaceShell />}>
              <Route index element={<ChatPanel />} />
              <Route path='admin' element={<AdminSettings />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChatSessionProvider>
    </div>
  );
}
