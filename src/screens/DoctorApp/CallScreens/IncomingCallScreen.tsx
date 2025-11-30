import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Modal } from 'react-native';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { soundService, SoundKeys } from '../../../services/soundService';

const { width } = Dimensions.get('window');

interface IncomingCallScreenProps {
  visible: boolean;
  patientName: string;
  concern: string;
  appointment: any;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallScreen: React.FC<IncomingCallScreenProps> = ({
  visible,
  patientName,
  concern,
  appointment,
  onAccept,
  onDecline,
}) => {
  // Play ringtone when call comes in
  useEffect(() => {
    if (visible) {
      try {
        // Play incoming call sound (if available)
        soundService.playSound(SoundKeys.INCOMING_CALL, true); // Loop the ringtone
      } catch (error) {
        console.log('Sound not available:', error);
      }
    } else {
      try {
        // Stop ringtone when modal closes
        soundService.stopSound(SoundKeys.INCOMING_CALL);
      } catch (error) {
        // Ignore
      }
    }

    return () => {
      try {
        soundService.stopSound(SoundKeys.INCOMING_CALL);
      } catch (error) {
        // Ignore
      }
    };
  }, [visible]);

  const handleAccept = () => {
    try {
      soundService.stopSound(SoundKeys.INCOMING_CALL);
      soundService.playSound(SoundKeys.CALL_CONNECTED);
    } catch (error) {
      // Sound not available
    }
    onAccept();
  };

  const handleDecline = () => {
    try {
      soundService.stopSound(SoundKeys.INCOMING_CALL);
    } catch (error) {
      // Sound not available
    }
    onDecline();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Background Overlay */}
        <View style={styles.overlay} />

        {/* Call Info Card */}
        <View style={styles.callCard}>
          {/* Patient Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {patientName?.charAt(0).toUpperCase() || 'P'}
              </Text>
            </View>
            {/* Pulse Animation Rings */}
            <View style={[styles.pulseRing, styles.pulseRing1]} />
            <View style={[styles.pulseRing, styles.pulseRing2]} />
          </View>

          {/* Patient Info */}
          <Text style={styles.incomingText}>Incoming Call</Text>
          <Text style={styles.patientName}>{patientName}</Text>
          <Text style={styles.concern}>{concern}</Text>

          {/* Call Type Badge */}
          <View style={styles.callTypeBadge}>
            <Ionicons name="videocam" size={16} color="#3A643B" />
            <Text style={styles.callTypeText}>Video Call</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
              <View style={[styles.buttonIconContainer, { backgroundColor: '#EF4444' }]}>
                <Ionicons name="close" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
              <View style={[styles.buttonIconContainer, { backgroundColor: '#3A643B' }]}>
                <Ionicons name="call" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default IncomingCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  callCard: {
    width: width - 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  avatarContainer: {
    marginBottom: 24,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5B976',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 3,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3A643B',
    opacity: 0.6,
  },
  pulseRing1: {
    opacity: 0.4,
  },
  pulseRing2: {
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.2,
  },
  incomingText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  patientName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  concern: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 16,
  },
  callTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 32,
  },
  callTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A643B',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 24,
    width: '100%',
    justifyContent: 'center',
  },
  declineButton: {
    alignItems: 'center',
    gap: 8,
  },
  acceptButton: {
    alignItems: 'center',
    gap: 8,
  },
  buttonIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A643B',
  },
});
