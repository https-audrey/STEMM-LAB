export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  RegisterRole: undefined;
  RegisterInfo: { role: string };
  Loading: undefined;
  Home: undefined;
  NoTeam: undefined;
  CreateTeam: undefined;
  Act5Start: undefined;
  Act5Authentication: undefined;
  Act5Equipment: undefined;
  Act5Instruction: undefined;
  Act5Experiment: { docIds?: string[] } | undefined;
  Act5RecordingResult: { docIds: string[] };
  Act5ResultComp: { docIds: string[] };
  TeamPageChem: undefined;
  Leaderboard: undefined;
  Profile: undefined;
  Activity: undefined;
};


