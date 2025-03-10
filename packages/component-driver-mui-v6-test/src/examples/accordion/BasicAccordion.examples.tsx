import { AccordionDriver } from '@atomic-testing/component-driver-mui-v6';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import React from 'react';

//#region Accordion
export const BasicAccordion: React.FunctionComponent = () => {
  return (
    <div>
      <Accordion data-testid="accordion-normal">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit
            leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled data-testid="accordion-disabled">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
          <Typography>Disabled Accordion</Typography>
        </AccordionSummary>
      </Accordion>
    </div>
  );
};

export const basicAccordionExampleScenePart = {
  normalAccordion: {
    locator: byDataTestId('accordion-normal'),
    driver: AccordionDriver,
  },
  disabledAccordion: {
    locator: byDataTestId('accordion-disabled'),
    driver: AccordionDriver,
  },
} satisfies ScenePart;

/**
 * Basic Alert example from MUI's website
 * @see https://mui.com/material-ui/react-accordion#description
 */
export const basicAccordionExample: IExampleUnit<typeof basicAccordionExampleScenePart, JSX.Element> = {
  title: 'Basic Accordion',
  scene: basicAccordionExampleScenePart,
  ui: <BasicAccordion />,
};
//#endregion

export const basicAccordionTestSuite: TestSuiteInfo<typeof basicAccordionExampleScenePart> = {
  title: 'Basic Accordion',
  url: '/accordion',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicAccordionExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicAccordionExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Normal Accordion is not disabled by default', async () => {
      const isDisabled = await testEngine.parts.normalAccordion.isDisabled();
      assertEqual(isDisabled, false);
    });

    test('Normal Accordion is not expanded by default', async () => {
      const isExpanded = await testEngine.parts.normalAccordion.isExpanded();
      assertEqual(isExpanded, false);
    });

    test('Normal Accordion can be expanded', async () => {
      await testEngine.parts.normalAccordion.expand();
      const isExpanded = await testEngine.parts.normalAccordion.isExpanded();
      assertEqual(isExpanded, true);
    });

    test('Normal Accordion can be collapsed', async () => {
      await testEngine.parts.normalAccordion.expand();
      await testEngine.parts.normalAccordion.collapse();
      const isExpanded = await testEngine.parts.normalAccordion.isExpanded();
      assertEqual(isExpanded, false);
    });

    test('Disabled Accordion is disabled', async () => {
      const isDisabled = await testEngine.parts.disabledAccordion.isDisabled();
      assertEqual(isDisabled, true);
    });
  },
};
