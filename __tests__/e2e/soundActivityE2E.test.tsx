import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import Sound from '../../screens/Sound/Sound';
import SoundActivity from '../../screens/Sound/SoundActivity';
import SoundRecord from '../../screens/Sound/SoundRecord';

// ================= MOCK NAVIGATION =================
const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      replace: mockReplace,
      goBack: mockGoBack,
      addListener: jest.fn(() => jest.fn()),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({
      params: { currentSessionId: 'e2e_session_1' },
    }),
  };
});

// ================= MOCK SERVICES =================
jest.mock('../../services/db', () => ({
  saveSoundRecord: jest.fn(),
}));

jest.mock('../../hooks/useBatteryWarning', () => ({
  useBatteryWarning: () => ({
    checkBatteryBeforeActivity: (_: string, fn: Function) => fn(),
  }),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: -6.2,
        longitude: 106.8,
        accuracy: 10,
      },
    })
  ),
}));

jest.mock('expo-av', () => {
  const mockRecording = {
    prepareToRecordAsync: jest.fn(),
    startAsync: jest.fn(),
    stopAndUnloadAsync: jest.fn(),
    getStatusAsync: jest.fn(() =>
      Promise.resolve({
        isRecording: true,
        metering: -30,
      })
    ),
  };

  return {
    Audio: {
      requestPermissionsAsync: jest.fn(() =>
        Promise.resolve({ status: 'granted' })
      ),
      setAudioModeAsync: jest.fn(),
      Recording: jest.fn(() => mockRecording),
    },
    RecordingOptionsPresets: {
      HIGH_QUALITY: {},
    },
  };
});

// ================= TEST =================
describe('Sound Pollution Hunter - E2E Flow Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes full user journey: start → setup → record → save', async () => {
    // =====================================================
    // STEP 1: USER STARTS FROM SOUND SCREEN
    // =====================================================
    const soundScreen = render(<Sound />);

    fireEvent.press(soundScreen.getByText('Initialize Experiment 🚀'));

    expect(mockNavigate).toHaveBeenCalledWith(
      'SoundActivity',
      expect.objectContaining({
        forceNewSession: true,
      })
    );

    // =====================================================
    // STEP 2: USER IS ON SOUND ACTIVITY SCREEN
    // =====================================================
    const activityScreen = render(
      <SoundActivity
        navigation={{
          navigate: mockNavigate,
          replace: mockReplace,
          goBack: mockGoBack,
          addListener: jest.fn(() => jest.fn()),
          dispatch: jest.fn(),
          setOptions: jest.fn(),
        } as any}
        route={{
          params: { currentSessionId: 'e2e_session_1' },
        } as any}
      />
    );

    expect(activityScreen.getByText('Record Sound')).toBeTruthy();

    // OPEN SETUP MODAL
    fireEvent.press(activityScreen.getByText('Record Sound'));

    await waitFor(() => {
      expect(activityScreen.getByText('Start Recording')).toBeTruthy();
    });

    // ENTER USER INPUT
    fireEvent.changeText(
      activityScreen.getByPlaceholderText(
        'e.g., Near window, Front of class, By the door'
      ),
      'Near door'
    );

    fireEvent.changeText(
      activityScreen.getByPlaceholderText(
        'e.g., Dropping book, Talking, Stamping feet'
      ),
      'Dropping book'
    );

    // START RECORDING NAVIGATION
    fireEvent.press(activityScreen.getByText('Start Recording'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        'SoundRecord',
        expect.objectContaining({
          currentSessionId: 'e2e_session_1',
          location_description: 'Near door',
          action: 'Dropping book',
        })
      );
    });

    // =====================================================
    // STEP 3: SOUND RECORD SCREEN
    // =====================================================
    const recordScreen = render(
      <SoundRecord
        navigation={{
          replace: mockReplace,
          goBack: mockGoBack,
        } as any}
        route={{
          params: {
            currentSessionId: 'e2e_session_1',
            latitude: -6.2,
            longitude: 106.8,
            accuracy: 10,
            location_description: 'Near door',
            action: 'Dropping book',
          },
        } as any}
      />
    );

    // START RECORDING
    fireEvent.press(recordScreen.getByText('Start Recording'));

    // STOP AND SAVE
    await waitFor(() => {
      fireEvent.press(recordScreen.getByText('Stop & Save'));
    });

    // =====================================================
    // FINAL ASSERTION (END OF USER FLOW)
    // =====================================================
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        'SoundActivity',
        expect.objectContaining({
          currentSessionId: 'e2e_session_1',
        })
      );
    });
  }, 15000);
});