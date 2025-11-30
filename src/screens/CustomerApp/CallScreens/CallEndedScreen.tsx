import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ActiveAppointmentsService } from '../../../services/storageAdapter';

type RouteParams = {
  CallEndedScreen: {
    appointment: any;
    doctorName: string;
    callDuration: number;
    userRole: 'doctor' | 'customer';
  };
};

const { width } = Dimensions.get('window');

const CallEndedScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'CallEndedScreen'>>();
  const navigation = useNavigation();
  const { appointment, doctorName, callDuration, userRole } = route.params;

  // Mark appointment as call completed when screen mounts
  useEffect(() => {
    const markCallCompleted = async () => {
      if (appointment?.id) {
        try {
          await ActiveAppointmentsService.markCallCompleted(appointment.id);
          console.log('✅ Appointment marked as call completed');
        } catch (error) {
          console.error('❌ Error marking call as completed:', error);
        }
      }
    };

    markCallCompleted();
  }, [appointment?.id]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateAmount = (duration: number) => {
    // ₹6.15 per minute
    const minutes = duration / 60;
    return Math.ceil(minutes * 6.15);
  };

  const handleCallAgain = () => {
    // Navigate back to video call
    navigation.navigate('VideoCall' as never, {
      appointment,
      userRole,
    } as never);
  };

  const handleDone = () => {
    navigation.navigate('MainTabs' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Balance Icon */}
      {userRole === 'customer' && (
        <View style={styles.balanceIconContainer}>
          <Ionicons name="wallet-outline" size={20} color="#6B7280" />
          <Text style={styles.balanceAmount}>₹ 150</Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Doctor Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={60} color="#FFFFFF" />
          </View>
          <View style={styles.onlineIndicator} />
        </View>

        {/* Doctor Name */}
        <Text style={styles.doctorName}>{doctorName}</Text>

        {/* Call Ended Status */}
        <View style={styles.statusContainer}>
          <Ionicons name="call-outline" size={16} color="#6B7280" />
          <Text style={styles.statusText}>Call Ended</Text>
        </View>

        {/* Call Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={24} color="#6B7280" />
            <Text style={styles.detailLabel}>Consultation Duration</Text>
            <Text style={styles.detailValue}>{formatDuration(callDuration)}</Text>
          </View>

          {userRole === 'customer' && (
            <View style={styles.detailItem}>
              <Ionicons name="wallet-outline" size={24} color="#6B7280" />
              <Text style={styles.detailLabel}>Total Amount Deducted</Text>
              <Text style={styles.detailValue}>₹ {calculateAmount(callDuration)}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.callAgainButton} onPress={handleCallAgain}>
            <Text style={styles.callAgainButtonText}>Call Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CallEndedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  balanceIconContainer: {
    position: 'absolute',
    top: 16,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  balanceAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2D5F30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  doctorName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 40,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 'auto',
  },
  detailItem: {
    alignItems: 'center',
    marginBottom: 32,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  callAgainButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2D5F30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  callAgainButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5F30',
  },
  doneButton: {
    width: '100%',
    backgroundColor: '#2D5F30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});