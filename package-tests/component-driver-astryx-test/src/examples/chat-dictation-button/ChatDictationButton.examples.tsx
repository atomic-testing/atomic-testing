import { ChatDictationButton, UseSpeechRecognitionReturn } from '@astryxdesign/core/Chat';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ChatDictationButton scene.
 *
 * The button renders `null` when speech recognition is unsupported and
 * `isHiddenWhenUnsupported` is left at its default, and it forwards no
 * `data-testid`. So each instance is given a mock `dictation` (a stand-in for
 * `useSpeechRecognition`'s return) reporting `isSupported: true`, plus
 * `isHiddenWhenUnsupported={false}`, to force a render. The state shows as the
 * inner button's verbatim `aria-label`: `"Start dictation"` (idle) vs
 * `"Stop dictation"` (listening), so the scene anchors each instance on that label.
 */

// The full UseSpeechRecognitionReturn surface. The button only reads isSupported,
// isListening, bands, and volume; the no-op handlers and empty buffers stand in for
// the AudioContext-bound internals that have no meaning under jsdom.
const makeDictation = (isListening: boolean): UseSpeechRecognitionReturn => ({
  isSupported: true,
  isListening,
  isSpeaking: false,
  volume: 0,
  bands: [],
  rawBands: [],
  interimTranscript: '',
  start: () => {},
  stop: () => {},
  abort: () => {},
  toggle: () => {},
});

export const ChatDictationButtonExample = () => (
  <div>
    <ChatDictationButton dictation={makeDictation(false)} isHiddenWhenUnsupported={false} />
    <ChatDictationButton dictation={makeDictation(true)} isHiddenWhenUnsupported={false} />
  </div>
);

export const chatDictationButtonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ChatDictationButton',
  ui: <ChatDictationButtonExample />,
};
