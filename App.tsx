import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
import CreateTeamPage from './screens/CreateTeamPage';
import Act5StartPage from './screens/act5/StartPage';
import AuthenticationPage from './screens/act5/AuthenticationPage';
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
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
}
