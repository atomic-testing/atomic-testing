import { Lightbox } from '@astryxdesign/core/Lightbox';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

const galleryMedia = [
  { src: '/photo-a.jpg', alt: 'Photo A', caption: 'Caption A' },
  { src: '/photo-b.jpg', alt: 'Photo B', caption: 'Caption B' },
  { src: '/photo-c.jpg', alt: 'Photo C' },
];

const singleMedia = { src: '/photo-solo.jpg', alt: 'Solo photo' };

/**
 * Two independent Lightbox triggers: a 3-item gallery (exercises next/prev,
 * counter, and per-item captions) and a single-item lightbox (exercises the
 * outside-gallery-mode absent case for counter/prev/next).
 */
export const LightboxExample = () => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [singleOpen, setSingleOpen] = useState(false);
  return (
    <div>
      <button type='button' data-testid='open-gallery-lightbox' onClick={() => setGalleryOpen(true)}>
        Open gallery lightbox
      </button>
      <Lightbox
        isOpen={galleryOpen}
        onOpenChange={setGalleryOpen}
        media={galleryMedia}
        hasZoom
        data-testid='gallery-lightbox'
      />
      <button type='button' data-testid='open-single-lightbox' onClick={() => setSingleOpen(true)}>
        Open single lightbox
      </button>
      <Lightbox isOpen={singleOpen} onOpenChange={setSingleOpen} media={singleMedia} data-testid='single-lightbox' />
    </div>
  );
};

export const lightboxUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Lightbox',
  ui: <LightboxExample />,
};
