import { SelectComponentDriver } from '@testzilla/component-driver-mui-v5';
import { byDataTestId, ScenePart } from '@testzilla/core';

import { createTestEngine } from '../src/createTestEngine';

const testScenePart = {
  select: {
    locator: byDataTestId('demo-simple-select'),
    driver: SelectComponentDriver,
  },
} satisfies ScenePart;

it('happy path selection', async () => {
  cy.visit(
    'http://testzilla-mui-v5.s3-website-us-east-1.amazonaws.com/iframe.html?id=select--secondary-button&viewMode=story',
  );
  const testEngine = createTestEngine(testScenePart);
  const targetValue = '30';
  await testEngine.parts.select.setValue(targetValue);
  const val = await testEngine.parts.select.getValue();
  expect(val).to.equal(targetValue);
});
