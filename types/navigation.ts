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
  Act5Reflection1: { docIds: string[] };
  Act5Reflection2: { docIds: string[] };
  Act5Reflection3: { docIds: string[] };
  Act5Discussion: { docIds: string[] };
  Act5Curriculum: undefined;
  RateActivity: undefined;
  TeamPageChem: undefined;
  Leaderboard: undefined;
  Profile: undefined;
  Activity: undefined;
};


