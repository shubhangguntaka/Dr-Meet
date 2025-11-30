import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type RouteParams = {
  CallEndedScreen: {
    appointment: any;
    patientName?: string;
    callDuration: number;
    userRole: 'doctor' | 'customer';
  };
};

const { width } = Dimensions.get('window');

const CallEndedScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'CallEndedScreen'>>();
  const navigation = useNavigation();
  const { appointment, patientName, callDuration, userRole } = route.params;

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

  const handleSendChat = () => {
    navigation.navigate('MainTabs' as never, { screen: 'Chat' } as never);
  };

  const handleUploadPrescription = () => {
    // Reset navigation to Appointments tab, then navigate to AppointmentDetails
    navigation.reset({
      index: 1,
      routes: [
        { name: 'MainTabs' as never, params: { screen: 'Appointment' } as never },
        { name: 'AppointmentDetails' as never, params: { appointment } as never },
      ],
    });
  };

  const handleClose = () => {
    navigation.navigate('MainTabs' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close" size={24} color="#1F2937" />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Patient Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {patientName?.charAt(0).toUpperCase() || 'P'}
            </Text>
          </View>
        </View>

        {/* Concern */}
        <Text style={styles.concern}>{appointment?.concern || 'Headache'}</Text>

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

          <View style={styles.detailItem}>
            <Ionicons name="wallet-outline" size={24} color="#6B7280" />
            <Text style={styles.detailLabel}>Total Amount Received</Text>
            <Text style={styles.detailValue}>₹ {calculateAmount(callDuration)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.chatButton} onPress={handleSendChat}>
            <Text style={styles.chatButtonText}>Send a chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.prescriptionButton} onPress={handleUploadPrescription}>
            <Text style={styles.prescriptionButtonText}>Upload Prescription</Text>
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
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5B976',
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
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  concern: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 40,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
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
    fontSize: 13,
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
    gap: 12,
  },
  chatButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  prescriptionButton: {
    width: '100%',
    backgroundColor: '#2D5F30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  prescriptionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});