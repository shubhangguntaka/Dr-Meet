import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type RouteParams = {
  PatientDisconnectedScreen: {
    appointment: any;
    patientName: string;
    callDuration: number;
  };
};

const { width } = Dimensions.get('window');

const PatientDisconnectedScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'PatientDisconnectedScreen'>>();
  const navigation = useNavigation();
  const { appointment, patientName, callDuration } = route.params;

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
    // Navigate to prescription upload screen
    navigation.navigate('MainTabs' as never);
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

        {/* Patient Name */}
        <Text style={styles.patientName}>{patientName || 'Patient'}</Text>
        <Text style={styles.concern}>{appointment?.concern || 'Headache'}</Text>

        {/* Call Disconnected Status */}
        <View style={styles.statusContainer}>
          <Ionicons name="call-outline" size={16} color="#DC2626" />
          <Text style={styles.statusText}>Call Disconnected</Text>
        </View>

        {/* Call Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color="#6B7280" />
              <Text style={styles.detailLabel}>Consultation Duration</Text>
            </View>
            <Text style={styles.detailValue}>{formatDuration(callDuration)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="wallet-outline" size={20} color="#6B7280" />
              <Text style={styles.detailLabel}>Total Amount Received</Text>
            </View>
            <Text style={styles.detailValue}>₹ {calculateAmount(callDuration)}</Text>
          </View>
        </View>

        {/* Low Balance Warning */}
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>User's name Low Balance</Text>
          <Text style={styles.warningText}>
            The call ended due to low wallet balance of {patientName}
          </Text>
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

export default PatientDisconnectedScreen;

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
  patientName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  concern: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  warningCard: {
    width: '100%',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 'auto',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
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
