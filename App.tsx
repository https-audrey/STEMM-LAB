import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
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

import Parachute from './screens/Parachute';
import ParachuteActivity from './screens/ParachuteActivity';
import ParachutePrototype from './screens/ParachutePrototype';
import ParachuteResult from './screens/ParachuteResult';
import ParachuteVideoMarking from './screens/ParachuteVideoMarking';

import HandFan from './screens/HandFan';
import HandFanActivity from './screens/HandFanActivity';
import HandFanPrototype from './screens/HandFanPrototype';
import HandFanMarking from './screens/HandFanMarking';
import HandFanResult from './screens/HandFanResult';

import Earthquake from './screens/Earthquake';
import EarthquakeActivity from './screens/EarthquakeActivity';
import EarthquakePrototype from './screens/EarthquakePrototype';
import EarthquakeResult from './screens/EarthquakeResult';

import { initDatabase } from './src/services/db';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    ShortStack_400Regular,
    DynaPuff_400Regular,
    'Oliver-Regular': require('./assets/fonts/Oliver-Regular.ttf'),
  });
  
  const [isReady, setIsReady] = useState(false);
  const dbInitialized = useRef(false);

  useEffect(() => {
    if (fontsLoaded && !dbInitialized.current) {
      dbInitialized.current = true;
      try {
        initDatabase();
      } catch (error) {
        console.error('Database init failed:', error);
      }
      setIsReady(true);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isReady) {
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
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0a0e1a' },
          transitionSpec:{
            open: { animation: 'timing', config: { duration: 0 } },
            close: { animation: 'timing', config: { duration: 0 } },
          }
        }}
      >
        <Stack.Screen name="Onboarding" component={OnBoardingPage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterRole" component={RegisterRoleScreen} />
        <Stack.Screen name="RegisterInfo" component={RegisterInfoScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NoTeam" component={NoTeamFound} />
        <Stack.Screen name="Parachute" component={Parachute} />
        <Stack.Screen name="ParachuteActivity" component={ParachuteActivity} />
        <Stack.Screen name="ParachutePrototype" component={ParachutePrototype} />
        <Stack.Screen name="ParachuteVideoMarking" component={ParachuteVideoMarking} />
        <Stack.Screen name="ParachuteResult" component={ParachuteResult} />
        <Stack.Screen name="HandFan" component={HandFan} />
        <Stack.Screen name="HandFanActivity" component={HandFanActivity} />
        <Stack.Screen name="HandFanPrototype" component={HandFanPrototype} />
        <Stack.Screen name="HandFanMarking" component={HandFanMarking} />
        <Stack.Screen name="HandFanResult" component={HandFanResult} />
        <Stack.Screen name="Earthquake" component={Earthquake} />
        <Stack.Screen name="EarthquakeActivity" component={EarthquakeActivity} />
        <Stack.Screen name="EarthquakePrototype" component={EarthquakePrototype} />
        <Stack.Screen name="EarthquakeResult" component={EarthquakeResult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}