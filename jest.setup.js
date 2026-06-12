// jest.setup.js
// No imports needed - these are all mocks

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    runSync: jest.fn(),
    getAllSync: jest.fn().mockReturnValue([]),
    getFirstSync: jest.fn().mockReturnValue(null),
  })),
}));

// ADD THIS - Mock expo-asset (required by expo-font)
jest.mock('expo-asset', () => ({
  Asset: {
    loadAsync: jest.fn(() => Promise.resolve()),
    fromModule: jest.fn(() => ({ downloadAsync: jest.fn(() => Promise.resolve()) })),
  },
  useAssets: jest.fn(() => [null, true]),
}));

// Mock expo-font (required by vector-icons)
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
  useFonts: jest.fn(() => [true]),
}));

// Mock expo-constants (required by expo-asset)
jest.mock('expo-constants', () => ({
  default: {
    manifest: {},
    platform: { ios: false, android: true },
  },
  Constants: {
    manifest: {},
  },
}));

// Mock Expo Camera
jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  useCameraPermissions: jest.fn(() => [{
    status: 'granted',
    canAskAgain: true,
    granted: true
  }, jest.fn()]),
  useMicrophonePermissions: jest.fn(() => [{
    status: 'granted',
    canAskAgain: true,
    granted: true
  }, jest.fn()]),
  CameraType: { front: 'front', back: 'back' },
  FlashMode: { off: 'off', on: 'on', auto: 'auto' },
  AutoFocus: { on: 'on', off: 'off', auto: 'auto' }
}));

// Mock Expo Sensors
jest.mock('expo-sensors', () => ({
  Accelerometer: {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeAllListeners: jest.fn(),
    setUpdateInterval: jest.fn()
  }
}));

// Mock Expo AV
jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    setAudioModeAsync: jest.fn()
  }
}));

// Mock Expo Location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: { latitude: 37.7749, longitude: -122.4194, accuracy: 10 }
  }))
}));

// Mock Vibration
jest.mock('react-native/Libraries/Vibration/Vibration', () => ({
  vibrate: jest.fn(),
  cancel: jest.fn()
}));

// Mock Notifications
jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('mock-notification-id')),
  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
  setNotificationHandler: jest.fn()
}));

// Mock vector-icons (to avoid expo-font issues)
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'MockedIonicons',
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
}));

// jest.mock('@react-navigation/native', () => {
//   const actual = jest.requireActual('@react-navigation/native');

//   return {
//     ...actual,
//     useFocusEffect: (cb: any) => cb(),
//   };
// });