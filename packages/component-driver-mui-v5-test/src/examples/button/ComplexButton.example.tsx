import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import { Stack } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';

//#region Complex example

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

export const ComplexExample = () => {
  const [target, setTarget] = React.useState('');
  return (
    <Stack direction="row" spacing={10}>
      <ImageButton
        data-testid="image-button"
        focusRipple
        style={{
          width: '50%',
        }}
        onClick={() => setTarget('image-button')}
      >
        <ImageSrc style={{ backgroundImage: `url(https://mui.com/static/images/buttons/camera.jpg)` }} />
        <ImageBackdrop className="MuiImageBackdrop-root" />
        <Image>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            sx={{
              position: 'relative',
              p: 4,
              pt: 2,
              pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
            }}
          >
            Camera
            <ImageMarked className="MuiImageMarked-root" />
          </Typography>
        </Image>
      </ImageButton>
      <div data-testid="image-button-target">{target}</div>
    </Stack>
  );
};

export const complexExampleScenePart = {
  imageButton: {
    locator: byDataTestId('image-button'),
    driver: ButtonDriver,
  },
  target: {
    locator: byDataTestId('image-button-target'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Icon button complex example from MUI's website
 * @see https://mui.com/material-ui/react-button/#complex-button
 */
export const complexExample: IExampleUnit<typeof complexExampleScenePart, JSX.Element> = {
  title: 'Complex button',
  scene: complexExampleScenePart,
  ui: <ComplexExample />,
};
//#endregion

export const complexButtonTestSuite: TestSuiteInfo<typeof complexExample.scene> = {
  title: 'Complex button',
  url: '/button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${complexExample.title}`, () => {
      let testEngine: TestEngine<typeof complexExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(complexExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Image target should be empty initially`, async () => {
        const text = await testEngine.parts.target.getText();
        assertEqual(text, '');
      });

      test(`Click on image-button should display image-button`, async () => {
        await testEngine.parts.imageButton.click();
        const text = await testEngine.parts.target.getText();
        assertEqual(text, 'image-button');
      });
    });
  },
};
