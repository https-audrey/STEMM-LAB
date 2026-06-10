// hooks/useBatteryWarning.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import * as Battery from 'expo-battery';

export const useBatteryWarning = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  const checkBatteryBeforeActivity = async (
    activityName: string,
    onContinue: () => void,
    requiredLevel: number = 0.15 // Default 15%
  ) => {
    try {
      const level = await Battery.getBatteryLevelAsync();
      
      // -1 means battery level not available
      if (level === -1) {
        // Battery info not available, just continue
        onContinue();
        return;
      }
      
      setBatteryLevel(level);
      const percentage = Math.round(level * 100);
      
      if (level < requiredLevel) {
        Alert.alert(
          '⚠️ Low Battery Warning',
          `Your battery is at ${percentage}%. "${activityName}" requires sensors and may drain your battery.\n\nDo you want to continue?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Continue Anyway', 
              style: 'destructive',
              onPress: onContinue
            }
          ]
        );
      } else {
        onContinue();
      }
    } catch (error) {
      console.error('Battery check error:', error);
      // If battery check fails, just continue
      onContinue();
    }
  };

  const getBatteryLevel = async (): Promise<number | null> => {
    try {
      const level = await Battery.getBatteryLevelAsync();
      if (level >= 0) {
        setBatteryLevel(level);
        return level;
      }
      return null;
    } catch (error) {
      console.error('Get battery error:', error);
      return null;
    }
  };

  return { checkBatteryBeforeActivity, getBatteryLevel, batteryLevel };
};