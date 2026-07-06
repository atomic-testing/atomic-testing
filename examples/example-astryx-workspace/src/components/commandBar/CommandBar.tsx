import { Button } from '@astryxdesign/core/Button';
import { CommandPalette } from '@astryxdesign/core/CommandPalette';
import { createStaticSource } from '@astryxdesign/core/Typeahead';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppDataTestId } from '../../AppDataTestId';
import { useChatSession } from '../../hooks/ChatSessionProvider';
import { COMMAND_PALETTE_LABEL, CommandBarDataTestId } from './CommandBarDataTestId';

interface CommandItem {
  id: string;
  label: string;
}

const COMMANDS: CommandItem[] = [
  { id: 'new-chat', label: 'New chat' },
  { id: 'clear-chat', label: 'Clear chat' },
  { id: 'open-settings', label: 'Open settings' },
];

const commandSource = createStaticSource<CommandItem>(COMMANDS);

/**
 * The ⌘K command bar: a trigger button plus the Astryx CommandPalette. Selecting an
 * item routes ("Open settings" → /admin) or acts on the shared chat session. The
 * wrapper carries the {@link AppDataTestId.commandBar} anchor; the palette dialog
 * (a descendant) is reached by its accessible label.
 */
export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { clear } = useChatSession();

  // ⌘K / Ctrl+K opens the palette, mirroring the on-screen hint.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const run = (id: string) => {
    switch (id) {
      case 'open-settings':
        navigate('/admin');
        break;
      case 'new-chat':
        clear();
        navigate('/');
        break;
      case 'clear-chat':
        clear();
        break;
    }
    setIsOpen(false);
  };

  return (
    <div data-testid={AppDataTestId.commandBar}>
      <Button
        data-testid={CommandBarDataTestId.trigger}
        label='⌘K'
        variant='secondary'
        onClick={() => setIsOpen(true)}
      />
      <CommandPalette<CommandItem>
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        searchSource={commandSource}
        label={COMMAND_PALETTE_LABEL}
        onValueChange={run}
      />
    </div>
  );
}
