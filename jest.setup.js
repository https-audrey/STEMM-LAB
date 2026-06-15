// jest.setup.js
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Platform.OS = 'ios';
  return RN;
});