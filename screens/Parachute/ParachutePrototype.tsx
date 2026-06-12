import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useBatteryWarning } from '../../hooks/useBatteryWarning';

type Props =
  NativeStackScreenProps<
    RootStackParamList,
    'ParachutePrototype'
  >;

export default function ParachutePrototype({
  route,
  navigation,
}: Props) {
  const {
    currentSessionId,
    prototype,
    mass,
    height,
  } = route.params;

  const {checkBatteryBeforeActivity} = useBatteryWarning();

  const cameraRef = useRef<any>(null);

  const [permission, requestPermission] =
    useCameraPermissions();
  
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const [recording, setRecording] =
    useState(false);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          Camera permission required
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!micPermission) {
    return null;
  }

  if (!micPermission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          Microphone permission required
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startRecording = () => {
    checkBatteryBeforeActivity('Parachute Video Recording', () => {
      startParachuteRecording();
    })
  }

  const startParachuteRecording = async () => {
    try {
      if (!cameraRef.current) return;

      setRecording(true);

      const video =
        await cameraRef.current.recordAsync();

      if (video?.uri) {
        navigation.replace(
          'ParachuteVideoMarking',
          {
            currentSessionId,
            videoUri: video.uri,
            prototypeKey: prototype,
            mass,
            height,
          }
        );
      }
    } catch (e) {
      console.log(e);
      Alert.alert(
        'Error',
        'Failed to record video.'
      );
    } finally {
      setRecording(false);
    }
  };

  const stopRecording = () => {
    cameraRef.current?.stopRecording();
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        mode="video"
      />

      <View style={styles.overlay}>
        <Text style={styles.title}>
          {prototype.toUpperCase()}
        </Text>

        <Text style={styles.text}>
          Mass: {mass} kg
        </Text>

        <Text style={styles.text}>
          Height: {height} m
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                recording
                  ? '#ff4757'
                  : '#2ed573',
            },
          ]}
          onPress={
            recording
              ? stopRecording
              : startRecording
          }
        >
          <Text style={styles.buttonText}>
            {recording
              ? 'Stop Recording'
              : 'Start Recording'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#071A3D',
    padding: 20,
  },

  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    padding: 20,
  },

  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },

  button: {
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});