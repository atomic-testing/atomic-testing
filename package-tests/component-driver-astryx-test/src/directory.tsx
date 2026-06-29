import { IExampleUIUnit } from '@atomic-testing/core';
import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';
import { JSX } from 'react';

import { alertDialogUIExample } from './examples/alert-dialog/AlertDialog.examples';
import { appShellUIExample } from './examples/app-shell/AppShell.examples';
import { avatarGroupUIExample } from './examples/avatar-group/AvatarGroup.examples';
import { avatarUIExample } from './examples/avatar/Avatar.examples';
// Wave 4 — display & typography
import { badgeUIExample } from './examples/badge/Badge.examples';
import { bannerUIExample } from './examples/banner/Banner.examples';
import { blockquoteUIExample } from './examples/blockquote/Blockquote.examples';
import { breadcrumbsUIExample } from './examples/breadcrumbs/Breadcrumbs.examples';
import { buttonGroupUIExample } from './examples/button-group/ButtonGroup.examples';
import { buttonUIExample } from './examples/button/Button.examples';
import { calendarUIExample } from './examples/calendar/Calendar.examples';
import { carouselUIExample } from './examples/carousel/Carousel.examples';
import { chatComposerInputUIExample } from './examples/chat-composer-input/ChatComposerInput.examples';
import { chatComposerUIExample } from './examples/chat-composer/ChatComposer.examples';
import { chatDictationButtonUIExample } from './examples/chat-dictation-button/ChatDictationButton.examples';
import { chatLayoutUIExample } from './examples/chat-layout/ChatLayout.examples';
import { chatMessageBubbleUIExample } from './examples/chat-message-bubble/ChatMessageBubble.examples';
import { chatMessageListUIExample } from './examples/chat-message-list/ChatMessageList.examples';
// Wave 4 — chat suite
import { chatMessageUIExample } from './examples/chat-message/ChatMessage.examples';
import { chatSendButtonUIExample } from './examples/chat-send-button/ChatSendButton.examples';
import { chatSystemMessageUIExample } from './examples/chat-system-message/ChatSystemMessage.examples';
import { chatToolCallsUIExample } from './examples/chat-tool-calls/ChatToolCalls.examples';
import { checkboxInputUIExample } from './examples/checkbox-input/CheckboxInput.examples';
import { checkboxListUIExample } from './examples/checkbox-list/CheckboxList.examples';
import { citationUIExample } from './examples/citation/Citation.examples';
import { codeBlockUIExample } from './examples/code-block/CodeBlock.examples';
import { codeUIExample } from './examples/code/Code.examples';
import { collapsibleUIExample } from './examples/collapsible/Collapsible.examples';
import { commandPaletteUIExample } from './examples/command-palette/CommandPalette.examples';
import { contextMenuUIExample } from './examples/context-menu/ContextMenu.examples';
import { dateInputUIExample } from './examples/date-input/DateInput.examples';
import { dateRangeInputUIExample } from './examples/date-range-input/DateRangeInput.examples';
import { dateTimeInputUIExample } from './examples/date-time-input/DateTimeInput.examples';
import { dialogUIExample } from './examples/dialog/Dialog.examples';
import { dividerUIExample } from './examples/divider/Divider.examples';
import { dropdownMenuUIExample } from './examples/dropdown-menu/DropdownMenu.examples';
// Wave 4 — feedback & misc
import { emptyStateUIExample } from './examples/empty-state/EmptyState.examples';
import { fieldStatusUIExample } from './examples/field-status/FieldStatus.examples';
import { fieldUIExample } from './examples/field/Field.examples';
// Wave 4 — hard set (best-effort v1)
import { fileInputUIExample } from './examples/file-input/FileInput.examples';
import { headingUIExample } from './examples/heading/Heading.examples';
import { hoverCardUIExample } from './examples/hover-card/HoverCard.examples';
import { iconButtonUIExample } from './examples/icon-button/IconButton.examples';
import { inputGroupUIExample } from './examples/input-group/InputGroup.examples';
import { itemUIExample } from './examples/item/Item.examples';
import { linkUIExample } from './examples/link/Link.examples';
import { listUIExample } from './examples/list/List.examples';
import { markdownUIExample } from './examples/markdown/Markdown.examples';
import { metadataListUIExample } from './examples/metadata-list/MetadataList.examples';
import { mobileNavUIExample } from './examples/mobile-nav/MobileNav.examples';
import { moreMenuUIExample } from './examples/more-menu/MoreMenu.examples';
import { multiSelectorUIExample } from './examples/multi-selector/MultiSelector.examples';
import { navIconUIExample } from './examples/nav-icon/NavIcon.examples';
import { navMenuUIExample } from './examples/nav-menu/NavMenu.examples';
import { numberInputUIExample } from './examples/number-input/NumberInput.examples';
import { outlineUIExample } from './examples/outline/Outline.examples';
import { paginationUIExample } from './examples/pagination/Pagination.examples';
import { popoverUIExample } from './examples/popover/Popover.examples';
import { powerSearchUIExample } from './examples/power-search/PowerSearch.examples';
import { progressBarUIExample } from './examples/progress-bar/ProgressBar.examples';
import { radioListUIExample } from './examples/radio-list/RadioList.examples';
import { segmentedControlUIExample } from './examples/segmented-control/SegmentedControl.examples';
import { selectableCardUIExample } from './examples/selectable-card/SelectableCard.examples';
import { selectorUIExample } from './examples/selector/Selector.examples';
import { sideNavItemUIExample } from './examples/side-nav-item/SideNavItem.examples';
import { sideNavUIExample } from './examples/side-nav/SideNav.examples';
import { sliderUIExample } from './examples/slider/Slider.examples';
import { spinnerUIExample } from './examples/spinner/Spinner.examples';
// Wave 4 — media & status
import { statusDotUIExample } from './examples/status-dot/StatusDot.examples';
import { switchControlUIExample } from './examples/switch/Switch.examples';
import { tabListUIExample } from './examples/tab-list/TabList.examples';
import { tableUIExample } from './examples/table/Table.examples';
import { textAreaUIExample } from './examples/text-area/TextArea.examples';
import { textInputUIExample } from './examples/text-input/TextInput.examples';
import { textUIExample } from './examples/text/Text.examples';
import { thumbnailUIExample } from './examples/thumbnail/Thumbnail.examples';
import { timeInputUIExample } from './examples/time-input/TimeInput.examples';
import { timestampUIExample } from './examples/timestamp/Timestamp.examples';
import { toastUIExample } from './examples/toast/Toast.examples';
import { toggleButtonGroupUIExample } from './examples/toggle-button-group/ToggleButtonGroup.examples';
import { toggleButtonUIExample } from './examples/toggle-button/ToggleButton.examples';
import { tokenUIExample } from './examples/token/Token.examples';
import { tokenizerUIExample } from './examples/tokenizer/Tokenizer.examples';
import { toolbarUIExample } from './examples/toolbar/Toolbar.examples';
import { tooltipUIExample } from './examples/tooltip/Tooltip.examples';
import { topNavItemUIExample } from './examples/top-nav-item/TopNavItem.examples';
import { topNavMegaMenuUIExample } from './examples/top-nav-mega-menu/TopNavMegaMenu.examples';
import { topNavMenuUIExample } from './examples/top-nav-menu/TopNavMenu.examples';
// Wave 4 — nav chrome
import { topNavUIExample } from './examples/top-nav/TopNav.examples';
import { treeListUIExample } from './examples/tree-list/TreeList.examples';
import { typeaheadUIExample } from './examples/typeahead/Typeahead.examples';

const toc = (label: string, path: string, example: IExampleUIUnit<JSX.Element>): ExampleToc => ({
  label,
  path,
  ui: <ExampleList examples={[example]} />,
});

export const tocs: ExampleToc[] = [
  toc('Button', '/button', buttonUIExample),
  toc('IconButton', '/icon-button', iconButtonUIExample),
  toc('ToggleButton', '/toggle-button', toggleButtonUIExample),
  toc('ButtonGroup', '/button-group', buttonGroupUIExample),
  toc('ToggleButtonGroup', '/toggle-button-group', toggleButtonGroupUIExample),
  toc('Link', '/link', linkUIExample),
  toc('TextInput', '/text-input', textInputUIExample),
  toc('TextArea', '/text-area', textAreaUIExample),
  toc('NumberInput', '/number-input', numberInputUIExample),
  toc('TimeInput', '/time-input', timeInputUIExample),
  toc('CheckboxInput', '/checkbox-input', checkboxInputUIExample),
  toc('RadioList', '/radio-list', radioListUIExample),
  toc('CheckboxList', '/checkbox-list', checkboxListUIExample),
  toc('Switch', '/switch', switchControlUIExample),
  toc('SegmentedControl', '/segmented-control', segmentedControlUIExample),
  toc('SelectableCard', '/selectable-card', selectableCardUIExample),
  toc('Slider', '/slider', sliderUIExample),
  toc('Field', '/field', fieldUIExample),
  toc('InputGroup', '/input-group', inputGroupUIExample),
  toc('FieldStatus', '/field-status', fieldStatusUIExample),
  toc('Banner', '/banner', bannerUIExample),
  toc('Pagination', '/pagination', paginationUIExample),
  toc('Collapsible', '/collapsible', collapsibleUIExample),
  toc('NavMenu', '/nav-menu', navMenuUIExample),
  toc('Toolbar', '/toolbar', toolbarUIExample),
  toc('Toast', '/toast', toastUIExample),
  toc('TabList', '/tab-list', tabListUIExample),
  toc('DropdownMenu', '/dropdown-menu', dropdownMenuUIExample),
  toc('MoreMenu', '/more-menu', moreMenuUIExample),
  toc('Popover', '/popover', popoverUIExample),
  toc('Dialog', '/dialog', dialogUIExample),
  toc('AlertDialog', '/alert-dialog', alertDialogUIExample),
  toc('List', '/list', listUIExample),
  toc('MetadataList', '/metadata-list', metadataListUIExample),
  toc('Outline', '/outline', outlineUIExample),
  toc('Carousel', '/carousel', carouselUIExample),
  toc('Table', '/table', tableUIExample),
  toc('TreeList', '/tree-list', treeListUIExample),
  toc('Selector', '/selector', selectorUIExample),
  toc('MultiSelector', '/multi-selector', multiSelectorUIExample),
  toc('Typeahead', '/typeahead', typeaheadUIExample),
  toc('Tokenizer', '/tokenizer', tokenizerUIExample),
  toc('CommandPalette', '/command-palette', commandPaletteUIExample),
  toc('Calendar', '/calendar', calendarUIExample),
  toc('DateInput', '/date-input', dateInputUIExample),
  toc('DateTimeInput', '/date-time-input', dateTimeInputUIExample),
  toc('DateRangeInput', '/date-range-input', dateRangeInputUIExample),
  toc('PowerSearch', '/power-search', powerSearchUIExample),
  // Wave 4 — display & typography
  toc('Badge', '/badge', badgeUIExample),
  toc('Text', '/text', textUIExample),
  toc('Heading', '/heading', headingUIExample),
  toc('Code', '/code', codeUIExample),
  toc('Blockquote', '/blockquote', blockquoteUIExample),
  toc('Timestamp', '/timestamp', timestampUIExample),
  toc('Divider', '/divider', dividerUIExample),
  // Wave 4 — media & status
  toc('StatusDot', '/status-dot', statusDotUIExample),
  toc('Citation', '/citation', citationUIExample),
  toc('Token', '/token', tokenUIExample),
  toc('Avatar', '/avatar', avatarUIExample),
  toc('AvatarGroup', '/avatar-group', avatarGroupUIExample),
  toc('Thumbnail', '/thumbnail', thumbnailUIExample),
  // Wave 4 — feedback & misc
  toc('EmptyState', '/empty-state', emptyStateUIExample),
  toc('ProgressBar', '/progress-bar', progressBarUIExample),
  toc('Spinner', '/spinner', spinnerUIExample),
  toc('NavIcon', '/nav-icon', navIconUIExample),
  toc('Item', '/item', itemUIExample),
  toc('Markdown', '/markdown', markdownUIExample),
  toc('CodeBlock', '/code-block', codeBlockUIExample),
  // Wave 4 — nav chrome
  toc('TopNav', '/top-nav', topNavUIExample),
  toc('TopNavItem', '/top-nav-item', topNavItemUIExample),
  toc('TopNavMenu', '/top-nav-menu', topNavMenuUIExample),
  toc('TopNavMegaMenu', '/top-nav-mega-menu', topNavMegaMenuUIExample),
  toc('Breadcrumbs', '/breadcrumbs', breadcrumbsUIExample),
  toc('SideNav', '/side-nav', sideNavUIExample),
  toc('SideNavItem', '/side-nav-item', sideNavItemUIExample),
  toc('MobileNav', '/mobile-nav', mobileNavUIExample),
  // Wave 4 — hard set (best-effort v1)
  toc('FileInput', '/file-input', fileInputUIExample),
  toc('ContextMenu', '/context-menu', contextMenuUIExample),
  toc('AppShell', '/app-shell', appShellUIExample),
  toc('ChatComposerInput', '/chat-composer-input', chatComposerInputUIExample),
  toc('ChatComposer', '/chat-composer', chatComposerUIExample),
  toc('HoverCard', '/hover-card', hoverCardUIExample),
  toc('Tooltip', '/tooltip', tooltipUIExample),
  // Wave 4 — chat suite
  toc('ChatMessage', '/chat-message', chatMessageUIExample),
  toc('ChatMessageBubble', '/chat-message-bubble', chatMessageBubbleUIExample),
  toc('ChatMessageList', '/chat-message-list', chatMessageListUIExample),
  toc('ChatSystemMessage', '/chat-system-message', chatSystemMessageUIExample),
  toc('ChatToolCalls', '/chat-tool-calls', chatToolCallsUIExample),
  toc('ChatLayout', '/chat-layout', chatLayoutUIExample),
  toc('ChatSendButton', '/chat-send-button', chatSendButtonUIExample),
  toc('ChatDictationButton', '/chat-dictation-button', chatDictationButtonUIExample),
];
