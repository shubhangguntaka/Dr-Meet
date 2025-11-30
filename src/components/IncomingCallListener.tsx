// src/components/IncomingCallListener.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../authentication/AuthContext';
import { callNotificationService, IncomingCallData } from '../services/callNotificationService';
import IncomingCallScreen from '../screens/DoctorApp/CallScreens/IncomingCallScreen';
import { useNavigation } from '@react-navigation/native';

export const IncomingCallListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const [showIncomingCall, setShowIncomingCall] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'doctor') return;

    try {
      const callbackId = callNotificationService.startListening(user.id, (callData) => {
        console.log('📞 Received incoming call:', callData);
        setIncomingCall(callData);
        setShowIncomingCall(true);
      });

      return () => {
        try {
          callNotificationService.stopListening(callbackId);
        } catch (error) {
          // Listener cleanup
        }
      };
    } catch (error) {
      console.error('Failed to start listening for incoming calls:', error);
    }
  }, [user]);

  const handleAccept = () => {
    if (incomingCall) {
      setShowIncomingCall(false);
      // Navigate to video call screen
      navigation.navigate('VideoCall' as never, {
        appointment: incomingCall.appointment,
        userRole: 'doctor',
      } as never);
      setIncomingCall(null);
    }
  };

  const handleDecline = () => {
    setShowIncomingCall(false);
    setIncomingCall(null);
    // Optionally notify the patient that the call was declined
  };

  return (
    <>
      {children}
      {incomingCall && (
        <IncomingCallScreen
          visible={showIncomingCall}
          patientName={incomingCall.patientName}
          concern={incomingCall.concern}
          appointment={incomingCall.appointment}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </>
  );
};
