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
import Act6StartPage from './screens/act6/StartPage';
import Act6AuthenticationPage from './screens/act6/AuthenticationPage';
import Act6EquipmentPage from './screens/act6/EquipmentPage';
import Act6InstructionPage from './screens/act6/InstructionPage';
import Act6InstructionPage2 from './screens/act6/InstructionPage2';
import Act6Phase1StartPage from './screens/act6/Phase1StartPage';
import Act6Phase2StartPage from './screens/act6/Phase2StartPage';
import Act6Phase3StartPage from './screens/act6/Phase3StartPage';
import Act6ExperimentPage1 from './screens/act6/ExperimentPage1';
import Act6ExperimentPage2 from './screens/act6/ExperimentPage2';
import Act6ExperimentPage3 from './screens/act6/ExperimentPage3';
import Act6Phase1ResultPage from './screens/act6/Phase1ResultPage';
import Act6Phase2ResultPage from './screens/act6/Phase2ResultPage';
import Act6Phase3ResultPage from './screens/act6/Phase3ResultPage';
import Act6Phase1And2ResultPage from './screens/act6/Phase1&2ResultPage';
import Act6ReflectionPage from './screens/act6/ReflectionPage';
import Act6DiscussionPage from './screens/act6/DiscussionPage';
import Act6CurriculumPage from './screens/act6/CurriculumPage';
import Act7StartPage from './screens/act7/StartPage';
import Act7AuthenticationPage from './screens/act7/AuthenticationPage';
import Act7EquipmentPage from './screens/act7/EquipmentPage';
import Act7InstructionPage from './screens/act7/InstructionPage';
import Act7ReflectionPage from './screens/act7/ReflectionPage';
import Act7DiscussionPage from './screens/act7/DiscussionPage';
import Act7CurriculumPage from './screens/act7/CurriculumPage';
import Act7ExperimentPage1 from './screens/act7/ExperimentPage1';
import Act7ExperimentPage2 from './screens/act7/ExperimentPage2';
import Act7ExperimentPage3 from './screens/act7/ExperimentPage3';
import Act7ResultPage1 from './screens/act7/ResultPage1';
import Act7ResultPage2 from './screens/act7/ResultPage2';
import Act7ResultPage3 from './screens/act7/ResultPage3';
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
import act6RateActivityPage from './screens/RateActivity/act6RateActivityPage';
import act7RateActivityPage from './screens/RateActivity/act7RateAcitivityPage';

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
          <Stack.Screen name="Act6Start" component={Act6StartPage} />
          <Stack.Screen name="Act6Authentication" component={Act6AuthenticationPage} />
          <Stack.Screen name="Act6Equipment" component={Act6EquipmentPage} />
          <Stack.Screen name="Act6Instruction" component={Act6InstructionPage} />
          <Stack.Screen name="Act6Instruction2" component={Act6InstructionPage2} />
          <Stack.Screen name="Act6Phase1Start" component={Act6Phase1StartPage} />
          <Stack.Screen name="Act6Phase2Start" component={Act6Phase2StartPage} />
          <Stack.Screen name="Act6Phase3Start" component={Act6Phase3StartPage} />
          <Stack.Screen name="Act6Experiment1" component={Act6ExperimentPage1} />
          <Stack.Screen name="Act6Experiment2" component={Act6ExperimentPage2} />
          <Stack.Screen name="Act6Experiment3" component={Act6ExperimentPage3} />
          <Stack.Screen name="Act6Phase1Result" component={Act6Phase1ResultPage} />
          <Stack.Screen name="Act6Phase2Result" component={Act6Phase2ResultPage} />
          <Stack.Screen name="Act6Phase3Result" component={Act6Phase3ResultPage} />
          <Stack.Screen name="Act6Phase1And2Result" component={Act6Phase1And2ResultPage} />
          <Stack.Screen name="Act6Reflection" component={Act6ReflectionPage} />
          <Stack.Screen name="Act6Discussion" component={Act6DiscussionPage} />
          <Stack.Screen name="Act6Curriculum" component={Act6CurriculumPage} />
          <Stack.Screen name="Act7Start" component={Act7StartPage} />
          <Stack.Screen name="Act7Authentication" component={Act7AuthenticationPage} />
          <Stack.Screen name="Act7Equipment" component={Act7EquipmentPage} />
          <Stack.Screen name="Act7Instruction" component={Act7InstructionPage} />
          <Stack.Screen name="Act7Reflection" component={Act7ReflectionPage} />
          <Stack.Screen name="Act7Discussion" component={Act7DiscussionPage} />
          <Stack.Screen name="Act7Curriculum" component={Act7CurriculumPage} />
          <Stack.Screen name="Act7Experiment1" component={Act7ExperimentPage1} />
          <Stack.Screen name="Act7Result1" component={Act7ResultPage1} />
          <Stack.Screen name="Act7Result2" component={Act7ResultPage2} />
          <Stack.Screen name="Act7Result3" component={Act7ResultPage3} />
          <Stack.Screen name="Act7Experiment2" component={Act7ExperimentPage2} />
          <Stack.Screen name="Act7Experiment3" component={Act7ExperimentPage3} />
          <Stack.Screen name="RateActivity" component={RateActivityPage} />
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
          <Stack.Screen name="Act6RateActivity" component={act6RateActivityPage} />
          <Stack.Screen name="Act7RateActivity" component={act7RateActivityPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
