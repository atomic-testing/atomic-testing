import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { byDataTestId, ScenePart, TestEngine } from '@testzilla/core';
import { createTestEngine } from '@testzilla/react';
import React, { useCallback } from 'react';

import { SelectComponentDriver } from '../../src/components/SelectComponentDriver';

const options = [
  { value: '20', label: 'Twenty' },
  { value: '30', label: 'Thirty' },
  { value: '60', label: 'Sixty' },
];

const Component = () => {
  const [value, setValue] = React.useState('20');
  const onChange = useCallback((event: SelectChangeEvent<string>) => {
    setValue(event.target.value);
  }, []);
  return (
    <Select data-testid="select" value={value} onChange={onChange}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

const testScenePart = {
  select: {
    locator: byDataTestId('select'),
    driver: SelectComponentDriver,
  },
} satisfies ScenePart;

describe('SelectComponentDriver', () => {
  let testEngine: TestEngine<typeof testScenePart>;
  // let cleanup: () => void;
  beforeEach(() => {
    testEngine = createTestEngine(<Component />, testScenePart);
  });

  afterEach(() => {
    // cleanup();
  });

  test('happy path selection', async () => {
    const targetValue = '30';
    await testEngine.parts.select.setValue(targetValue);
    const val = await testEngine.parts.select.getValue();
    expect(val).toBe(targetValue);
  });
});
