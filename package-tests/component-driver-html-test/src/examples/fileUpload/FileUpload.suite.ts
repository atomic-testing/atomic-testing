import { resolve } from 'node:path';

import { HTMLElementDriver, HTMLFileInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { fileUploadUIExample } from './FileUpload.examples';

// Resolve fixtures from the package CWD: both jest and Playwright are launched
// from package-tests/component-driver-html-test, and `__dirname` differs between
// the two runners' module systems, so process.cwd() is the portable anchor.
const fixture = (name: string): string => resolve(process.cwd(), 'src/examples/fileUpload/fixtures', name);

export const fileUploadExampleScenePart = {
  fileInput: {
    locator: byDataTestId('file-input'),
    driver: HTMLFileInputDriver,
  },
  fileInputMultiple: {
    locator: byDataTestId('file-input-multiple'),
    driver: HTMLFileInputDriver,
  },
  selectedName: {
    locator: byDataTestId('selected-name'),
    driver: HTMLElementDriver,
  },
  selectedNamesMultiple: {
    locator: byDataTestId('selected-names-multiple'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const fileUploadExample: IExampleUnit<typeof fileUploadExampleScenePart, JSX.Element> = {
  ...fileUploadUIExample,
  scene: fileUploadExampleScenePart,
};

export const fileUploadExampleTestSuite: TestSuiteInfo<typeof fileUploadExample.scene> = {
  title: 'File Upload: setInputFiles',
  url: '/file-upload',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${fileUploadExample.title}`, () => {
      const engine = useTestEngine(fileUploadExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`Initially selected name is empty`, async () => {
        assertEqual(await engine().parts.selectedName.getText(), '');
      });

      test(`uploadFiles reflects the uploaded file's basename`, async () => {
        await engine().parts.fileInput.uploadFiles(fixture('hello.txt'));
        assertEqual(await engine().parts.selectedName.getText(), 'hello.txt');
      });

      test(`uploadFiles with two files reflects both basenames on the multiple input`, async () => {
        await engine().parts.fileInputMultiple.uploadFiles([fixture('hello.txt'), fixture('world.txt')]);
        assertEqual(await engine().parts.selectedNamesMultiple.getText(), 'hello.txt,world.txt');
      });
    });
  },
};
