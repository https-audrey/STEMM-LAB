import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { ShortStack_400Regular } from '@expo-google-fonts/short-stack';
import { DynaPuff_400Regular } from '@expo-google-fonts/dynapuff';

import { RootStackParamList } from './types/navigation';
import OnBoardingPage from './screens/OnBoardingPage';
import LoginScreen from './screens/LoginScreen';
import RegisterRoleScreen from './screens/RegisterRoleScreen';
import RegisterInfoScreen from './screens/RegisterInfoScreen';
import LoadingScreen from './screens/LoadingScreen';
import HomeScreen from './screens/HomeScreen';
import NoTeamFound from './screens/NoTeamFound';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    ShortStack_400Regular,
    DynaPuff_400Regular,
    'Oliver-Regular': require('./assets/fonts/Oliver-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0e1a' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        id="RootStack"
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0a0e1a' },
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              opacity: current.progress,
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width * 0.3, 0],
                  }),
                },
              ],
            },
          }),
        }}
      >
        <Stack.Screen name="Onboarding" component={OnBoardingPage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterRole" component={RegisterRoleScreen} />
        <Stack.Screen name="RegisterInfo" component={RegisterInfoScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NoTeam" component={NoTeamFound} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
