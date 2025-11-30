import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type RouteParams = {
  DisconnectedCallScreen: {
    appointment: any;
    doctorName: string;
    callDuration: number;
  };
};

const { width } = Dimensions.get('window');

const DisconnectedCallScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'DisconnectedCallScreen'>>();
  const navigation = useNavigation();
  const { appointment, doctorName, callDuration } = route.params;

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

  const handleRecharge = () => {
    // Navigate to recharge/payment screen
    navigation.navigate('MainTabs' as never);
  };

  const handleClose = () => {
    navigation.navigate('MainTabs' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close" size={24} color="#000000" />
      </TouchableOpacity>

      {/* Balance Icon */}
      <View style={styles.balanceIconContainer}>
        <Ionicons name="wallet-outline" size={24} color="#6B7280" />
        <Text style={styles.balanceAmount}>₹ 150</Text>
      </View>

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

        {/* Disconnected Status */}
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
              <Text style={styles.detailLabel}>Total Amount Deducted</Text>
            </View>
            <Text style={styles.detailValue}>₹ {calculateAmount(callDuration)}</Text>
          </View>
        </View>

        {/* Low Balance Warning */}
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Low Balance</Text>
          <Text style={styles.warningText}>
            Your call ended due to low balance. Add at least ₹25 to continue speaking with {doctorName}.
          </Text>
        </View>

        {/* Recharge Button */}
        <TouchableOpacity style={styles.rechargeButton} onPress={handleRecharge}>
          <Text style={styles.rechargeButtonText}>Recharge now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DisconnectedCallScreen;

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
    backgroundColor: '#EF4444',
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
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 6,
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
    marginBottom: 24,
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
  rechargeButton: {
    width: '100%',
    backgroundColor: '#2D5F30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  rechargeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});