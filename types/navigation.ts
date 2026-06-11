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
  Act6Start: undefined;
  Act6Authentication: undefined;
  Act6Equipment: undefined;
  Act6Instruction: undefined;
  Act6Phase1Start: undefined;
  Act6Experiment1: undefined;
  Act7Start: undefined;
  Act7Authentication: undefined;

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