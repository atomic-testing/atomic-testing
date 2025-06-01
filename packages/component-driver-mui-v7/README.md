# @atomic-testing/component-driver-mui-v7

This package provides component drivers for Material-UI v7 components to help with testing.

## Installation

```bash
npm install @atomic-testing/component-driver-mui-v7
```

## Usage

```typescript
import { ButtonDriver } from '@atomic-testing/component-driver-mui-v7';

// Create a button driver
const button = new ButtonDriver(interactor, locator);

// Interact with the button
await button.click();
```

## Available Components

- Button
- TextField
- Select
- Checkbox
- Radio
- Switch
- Slider
- Table
- Dialog
- Menu
- List
- Card
- AppBar
- Drawer
- Tabs
- Accordion
- Alert
- Badge
- Chip
- IconButton
- Link
- Paper
- Progress
- Skeleton
- Snackbar
- Tooltip
- Typography
