export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  RegisterRole: undefined;
  RegisterInfo: { role: string };
  Loading: undefined;
  Home: undefined;
  NoTeam: undefined;
  
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