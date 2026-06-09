export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  RegisterRole: undefined;
  RegisterInfo: { role: string };
  Loading: undefined;
  Home: undefined;
  NoTeam: undefined;

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