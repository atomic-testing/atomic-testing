import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useCallback } from 'react';

export const FileUploadExample = () => {
  const [singleName, setSingleName] = React.useState<string>('');
  const [multipleNames, setMultipleNames] = React.useState<string>('');

  const onSingleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(event.target.files ?? []).map(file => file.name);
    setSingleName(names.join(','));
  }, []);

  const onMultipleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(event.target.files ?? []).map(file => file.name);
    setMultipleNames(names.join(','));
  }, []);

  return (
    <React.Fragment>
      <div>
        <input type='file' data-testid='file-input' onChange={onSingleChange} />
      </div>
      <div>
        <input type='file' multiple data-testid='file-input-multiple' onChange={onMultipleChange} />
      </div>
      {/* Reflects the basename(s) of the file(s) chosen on the single-file input,
          comma-joined, so a test can assert the upload took effect. */}
      <div data-testid='selected-name'>{singleName}</div>
      {/* Reflects the comma-joined basenames chosen on the multiple-file input. */}
      <div data-testid='selected-names-multiple'>{multipleNames}</div>
    </React.Fragment>
  );
};

export const fileUploadUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'File Upload',
  ui: <FileUploadExample />,
};
