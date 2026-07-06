import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import { ThemeProvider } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AppDataTestId } from './AppDataTestId';
import { FilterBar } from './components/filterBar/FilterBar';
import { TeamNav } from './components/teamNav/TeamNav';
import { TicketEditor } from './components/ticketEditor/TicketEditor';
import { TicketGrid } from './components/ticketGrid/TicketGrid';
import { type TabView } from './data/filterTickets';
import { useTicketConsole } from './hooks/useTicketConsole';
import { theme } from './themes/theme';

const TABS: readonly TabView[] = ['All', 'Mine', 'Overdue'];

export function App() {
  const vm = useTicketConsole();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ p: 2 }}>
          <Typography variant='h5' sx={{ mb: 2 }}>
            Ticket triage console
          </Typography>
          <Box data-testid={AppDataTestId.console} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Paper variant='outlined' sx={{ width: 220, p: 1, flexShrink: 0 }}>
              <TeamNav selectedQueue={vm.selectedQueue} onSelectQueue={vm.selectQueue} />
            </Paper>

            <Paper variant='outlined' sx={{ flex: 1, minWidth: 0 }}>
              <FilterBar filters={vm.filters} onChange={vm.updateFilters} />
              <Tabs
                data-testid={AppDataTestId.tabs}
                value={vm.tab}
                onChange={(_event, value: TabView) => vm.selectTab(value)}
                sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
                {TABS.map(tab => (
                  <Tab key={tab} label={tab} value={tab} />
                ))}
              </Tabs>
              <Box sx={{ p: 2 }}>
                <TicketGrid
                  rows={vm.visible}
                  onOpen={vm.openEditor}
                  onAssignToMe={vm.assignToMe}
                  onClose={vm.closeTicket}
                />
              </Box>
            </Paper>
          </Box>
        </Box>

        <TicketEditor ticket={vm.editingTicket} onSave={vm.save} onCancel={vm.closeEditor} />

        <Snackbar
          data-testid={AppDataTestId.toast}
          open={vm.snackbar != null}
          message={vm.snackbar ?? ''}
          autoHideDuration={null}
          onClose={vm.dismissSnackbar}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
