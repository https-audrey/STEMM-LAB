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
  Act6RateActivity: undefined;
  Act7RateActivity: undefined;
  TeamPageChem: undefined;
  Leaderboard: undefined;
  Profile: undefined;
  Act6Start: undefined;
  Act6Authentication: undefined;
  Act6Equipment: undefined;
  Act6Instruction: undefined;
  Act6Instruction2: undefined;
  Act6Phase1Start: undefined;
  Act6Phase2Start: undefined;
  Act6Phase3Start: undefined;
  Act6Experiment1: undefined;
  Act6Experiment2: undefined;
  Act6Experiment3: undefined;
  Act6Phase1Result: undefined;
  Act6Phase2Result: undefined;
  Act6Phase3Result: undefined;
  Act6Phase1And2Result: undefined;
  Act6Reflection: { docIds: string[] };
  Act6Discussion: { docIds: string[] };
  Act6Curriculum: undefined;
  Act7Start: undefined;
  Act7Authentication: undefined;
  Act7Equipment: undefined;
  Act7Instruction: undefined;
  Act7Reflection: { docIds: string[] };
  Act7Discussion: { docIds: string[] };
  Act7Curriculum: undefined;
  Act7Experiment1: undefined;
  Act7Result1: { docIds: string[] };
  Act7Result2: { docIds: string[] };
  Act7Result3: { docIds: string[] };
  Act7Experiment2: { docIds?: string[] } | undefined;
  Act7Experiment3: { docIds?: string[] } | undefined;

  ActivityResult: undefined;

  HandFan: { currentSessionId: string };
  HandFanActivity: { currentSessionId: string; forceNewSession?: boolean; didSubmitSuccessfully?: boolean };
  HandFanPrototype: {
    currentSessionId: string;
    prototype: string;
    design: number;
    distance: number;  
    material: string;
    stiffness: number; 
    didSubmitSuccessfully?: boolean;
  };
  HandFanMarking: {
    currentSessionId: string;
    videoUri: string;
    prototypeKey: string;
    design: number;
    distance: number;
    material: string;
    stiffness: number;
  }
  HandFanResult: {
    data: {
      currentSessionId: string;
      videoUri: string;
      prototypeKey: string;
      design: number;
      distance: number;
      material: string;
      stiffness: number;
      bend_angle: number;
      top_point_x: number;
      top_point_y: number;
      bottom_point_x: number;
      bottom_point_y: number;
      isHistoricalView: boolean;
    };
  }

  Earthquake: { currentSessionId: string };
  EarthquakeActivity: { currentSessionId: string; forceNewSession?: boolean; didSubmitSuccessfully?: boolean };
  EarthquakePrototype: {
    currentSessionId: string;
    prototype: string;
    description: string;
  };
  EarthquakeResult: {
    data: {
      currentSessionId: string;
      prototypeKey: string;
      description: string;
      peakAccel: number;
      avgAccel: number;
      isHistoricalView: boolean;
    };
  }

  Sound: { currentSessionId: string };
  SoundActivity: { currentSessionId: string; forceNewSession?: boolean; didSubmitSuccessfully?: boolean };
  SoundRecord: {
    currentSessionId: string;
    latitude: number;
    longitude: number;
    accuracy: number | null;
    location_description: string;
    action: string;
  };

  Parachute: { currentSessionId: string };
  ParachuteActivity: { currentSessionId: string; forceNewSession?: boolean; didSubmitSuccessfully?: boolean };
  
  ParachutePrototype: {
    currentSessionId: string;
    prototype: string;
    mass: number;  
    height: number; 
    didSubmitSuccessfully?: boolean;
  };
  
  ParachuteVideoMarking: {
    currentSessionId: string;
    videoUri: string;
    prototypeKey: string;
    mass: number;
    height: number;
  };
  
  ParachuteResult: {
    data: {
      currentSessionId: string;
      videoUri: string;
      prototypeKey: string;
      mass: number;
      height: number;
      dropTime: number;
      hitGroundTime: number;
      bounceTime: number | null;
      stopTime: number;
      isHistoricalView: boolean;
    };
  };
};