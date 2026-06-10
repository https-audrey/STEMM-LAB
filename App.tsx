import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { ShortStack_400Regular } from '@expo-google-fonts/short-stack';
import { DynaPuff_400Regular } from '@expo-google-fonts/dynapuff';

import { AuthProvider } from './context/AuthContext';

import { RootStackParamList } from './types/navigation';
import OnBoardingPage from './screens/OnBoardingPage';
import LoginScreen from './screens/LoginScreen';
import RegisterRoleScreen from './screens/RegisterRoleScreen';
import RegisterInfoScreen from './screens/RegisterInfoScreen';
import LoadingScreen from './screens/LoadingScreen';
import HomeScreen from './screens/HomeScreen';
import NoTeamFound from './screens/NoTeamFound';

import Parachute from './screens/Parachute/Parachute';
import ParachuteActivity from './screens/Parachute/ParachuteActivity';
import ParachutePrototype from './screens/Parachute/ParachutePrototype';
import ParachuteResult from './screens/Parachute/ParachuteResult';
import ParachuteVideoMarking from './screens/Parachute/ParachuteVideoMarking';

import HandFan from './screens/HandFan/HandFan';
import HandFanActivity from './screens/HandFan/HandFanActivity';
import HandFanPrototype from './screens/HandFan/HandFanPrototype';
import HandFanMarking from './screens/HandFan/HandFanMarking';
import HandFanResult from './screens/HandFan/HandFanResult';

import Earthquake from './screens/Earthquake/Earthquake';
import EarthquakeActivity from './screens/Earthquake/EarthquakeActivity';
import EarthquakePrototype from './screens/Earthquake/EarthquakePrototype';
import EarthquakeResult from './screens/Earthquake/EarthquakeResult';

import Sound from './screens/Sound/Sound';
import SoundActivity from './screens/Sound/SoundActivity';
import SoundRecord from './screens/Sound/SoundRecord';

import { initDatabase } from './services/db';
import CreateTeamPage from './screens/CreateTeamPage';
import Act5StartPage from './screens/act5/StartPage';
import AuthenticationPage from './screens/act5/AuthenticationPage';
import Act6StartPage from './screens/act6/StartPage';
import Act6AuthenticationPage from './screens/act6/AuthenticationPage';
import Act6EquipmentPage from './screens/act6/EquipmentPage';
import Act6InstructionPage from './screens/act6/InstructionPage';
import Act6Phase1StartPage from './screens/act6/Phase1StartPage';
import Act6ExperimentPage1 from './screens/act6/ExperimentPage1';
import Act7StartPage from './screens/act7/StartPage';
import Act7AuthenticationPage from './screens/act7/AuthenticationPage';
import EquipmentPage from './screens/act5/EquipmentPage';
import InstructionPage from './screens/act5/InstructionPage';
import ExperimentPage from './screens/act5/ExperimentPage';
import RecordingResultPage from './screens/act5/RecordingResultPage';
import ResultCompPage from './screens/act5/ResultCompPage';
import Reflection1Page from './screens/act5/Reflection1Page';
import Reflection2Page from './screens/act5/Reflection2Page';
import Reflection3Page from './screens/act5/Reflection3Page';
import Act5DiscussionPage from './screens/act5/Act5DiscussionPage';
import Act5CurriculumPage from './screens/act5/Act5CurriculumPage';
import TeamPageChem from './screens/TeamPageChem';
import LeaderboardPage from './screens/LeaderboardPage';
import ProfilePage from './screens/ProfilePage';
import ActivityPage from './screens/ActivityPage';
import RateActivityPage from './screens/RateActivity/RateActivityPage';

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
    <AuthProvider>
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
          <Stack.Screen name="CreateTeam" component={CreateTeamPage} />
          <Stack.Screen name="Act5Start" component={Act5StartPage} />
          <Stack.Screen name="Act6Start" component={Act6StartPage} />
          <Stack.Screen name="Act6Authentication" component={Act6AuthenticationPage} />
          <Stack.Screen name="Act6Equipment" component={Act6EquipmentPage} />
          <Stack.Screen name="Act6Instruction" component={Act6InstructionPage} />
          <Stack.Screen name="Act6Phase1Start" component={Act6Phase1StartPage} />
          <Stack.Screen name="Act6Experiment1" component={Act6ExperimentPage1} />
          <Stack.Screen name="Act7Start" component={Act7StartPage} />
          <Stack.Screen name="Act7Authentication" component={Act7AuthenticationPage} />
          <Stack.Screen name="Act5Authentication" component={AuthenticationPage} />
          <Stack.Screen name="Act5Equipment" component={EquipmentPage} />
          <Stack.Screen name="Act5Instruction" component={InstructionPage} />
          <Stack.Screen name="Act5Experiment" component={ExperimentPage} />
          <Stack.Screen name="Act5RecordingResult" component={RecordingResultPage} />
          <Stack.Screen name="Act5ResultComp" component={ResultCompPage} />
          <Stack.Screen name="Act5Reflection1" component={Reflection1Page} />
          <Stack.Screen name="Act5Reflection2" component={Reflection2Page} />
          <Stack.Screen name="Act5Reflection3" component={Reflection3Page} />
          <Stack.Screen name="Act5Discussion" component={Act5DiscussionPage} />
          <Stack.Screen name="Act5Curriculum" component={Act5CurriculumPage} />
          <Stack.Screen name="TeamPageChem" component={TeamPageChem} />
          <Stack.Screen name="Leaderboard" component={LeaderboardPage} />
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="Activity" component={ActivityPage} />
          <Stack.Screen name="RateActivity" component={RateActivityPage} />
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
          <Stack.Screen name="Sound" component={Sound} />
          <Stack.Screen name="SoundActivity" component={SoundActivity} />
          <Stack.Screen name="SoundRecord" component={SoundRecord} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}