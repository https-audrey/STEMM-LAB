// services/notificationService.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const configureNotifications = async () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
        }),
    });

  // Request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }
  
  // For Android, set up notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('parachute-timer', {
      name: 'Parachute Timer',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }
  
  return true;
};

// Send immediate notification
export const sendNotification = async (
  title: string,
  body: string
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};