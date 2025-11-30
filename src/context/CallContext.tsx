import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CallState {
  isMinimized: boolean;
  isActive: boolean;
  appointment: any;
  userRole: 'doctor' | 'customer';
  callDuration: number;
  isMuted: boolean;
  isVideoOff: boolean;
  remoteUserConnected: boolean;
  remoteUserName: string;
}

interface CallContextType {
  callState: CallState | null;
  setCallState: (state: CallState | null) => void;
  minimizeCall: () => void;
  maximizeCall: () => void;
  endMinimizedCall: () => void;
}

const CallContext = createContext<CallContextType>({
  callState: null,
  setCallState: () => {},
  minimizeCall: () => {},
  maximizeCall: () => {},
  endMinimizedCall: () => {},
});

export const useCall = () => useContext(CallContext);

export function CallProvider({ children }: { children: ReactNode }) {
  const [callState, setCallState] = useState<CallState | null>(null);

  const minimizeCall = () => {
    if (callState) {
      setCallState({ ...callState, isMinimized: true });
    }
  };

  const maximizeCall = () => {
    if (callState) {
      setCallState({ ...callState, isMinimized: false });
    }
  };

  const endMinimizedCall = () => {
    setCallState(null);
  };

  return (
    <CallContext.Provider
      value={{
        callState,
        setCallState,
        minimizeCall,
        maximizeCall,
        endMinimizedCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}
