import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

//#region Accordion
export const BasicAccordion: React.FunctionComponent = () => {
  return (
    <div>
      <Accordion data-testid='accordion-normal'>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content'>
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit
            leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled data-testid='accordion-disabled'>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel3a-content' id='panel3a-header'>
          <Typography>Disabled Accordion</Typography>
        </AccordionSummary>
      </Accordion>
    </div>
  );
};

/**
 * Basic Alert example from MUI's website
 * @see https://mui.com/material-ui/react-accordion#description
 */
export const basicAccordionUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Accordion',
  ui: <BasicAccordion />,
};
//#endregion
