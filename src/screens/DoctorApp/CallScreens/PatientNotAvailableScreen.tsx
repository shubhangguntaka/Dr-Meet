import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type RouteParams = {
  PatientNotAvailable: {
    appointment: any;
    patientName: string;
  };
};

const { width } = Dimensions.get('window');

const PatientNotAvailableScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'PatientNotAvailable'>>();
  const navigation = useNavigation();
  const { appointment, patientName } = route.params;

  const handleGoBack = () => {
    navigation.navigate('MainTabs' as never);
  };

  const handleCallAgain = () => {
    navigation.navigate('VideoCall' as never, {
      appointment,
      userRole: 'doctor',
    } as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleGoBack}>
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

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Consultation Duration</Text>
              <Text style={styles.infoValue}>00:00</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="wallet-outline" size={20} color="#6B7280" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Total Amount Received</Text>
              <Text style={styles.infoValue}>₹ 0</Text>
            </View>
          </View>
        </View>

        {/* User Not Available Message */}
        <View style={styles.messageCard}>
          <Ionicons name="information-circle" size={24} color="#DC2626" />
          <Text style={styles.messageText}>
            User is not available{'\n'}
            <Text style={styles.messageSubtext}>
              User is not picking up the call, wait or try again later
            </Text>
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.callAgainButton} onPress={handleCallAgain}>
            <Text style={styles.callAgainButtonText}>Call Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PatientNotAvailableScreen;

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
    marginBottom: 32,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  messageCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 'auto',
    alignItems: 'flex-start',
  },
  messageText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
    lineHeight: 22,
  },
  messageSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 20,
    gap: 12,
  },
  goBackButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  goBackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  callAgainButton: {
    width: '100%',
    backgroundColor: '#2D5F30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  callAgainButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
