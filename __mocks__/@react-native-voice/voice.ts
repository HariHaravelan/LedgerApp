const Voice = {
  onSpeechStart: jest.fn(),
  onSpeechResults: jest.fn(),
  onSpeechError: jest.fn(),
  removeAllListeners: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  destroy: jest.fn(),
};

export default Voice;
export const SpeechResultsEvent = {} as any;
export const SpeechErrorEvent = {} as any;
export const SpeechStartEvent = {} as any;
