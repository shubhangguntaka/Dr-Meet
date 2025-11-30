import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type RouteParams = {
  NotAnsweredCall: {
    appointment: any;
    doctorName: string;
  };
};

const { width } = Dimensions.get('window');

const NotAnsweredCall = () => {
  const route = useRoute<RouteProp<RouteParams, 'NotAnsweredCall'>>();
  const navigation = useNavigation();
  const { appointment, doctorName } = route.params;

  const handleStartChat = () => {
    // Navigate to chat or consultation
    navigation.navigate('MainTabs' as never);
  };

  const handleSeeExperts = () => {
    navigation.navigate('MainTabs' as never, { screen: 'Consult' } as never);
  };

  const handleGoBack = () => {
    navigation.navigate('MainTabs' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Doctor Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={60} color="#FFFFFF" />
          </View>
        </View>

        {/* Doctor Name */}
        <Text style={styles.doctorName}>{doctorName}</Text>
        <Text style={styles.specialty}>{appointment?.concern || 'Male-Female Infertility'}</Text>

        {/* No Answer Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>No Answer</Text>
        </View>

        {/* Info Message */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="information-circle" size={24} color="#2D5F30" />
          </View>
          <Text style={styles.infoText}>
            Tap on the bell icon to get notified when {doctorName} is online.
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionTitle}>
            Start a Chat Consultation with {doctorName} or consult another expert now.
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleSeeExperts}
            >
              <Text style={styles.secondaryButtonText}>See More Experts</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleStartChat}
            >
              <Text style={styles.primaryButtonText}>Start Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleGoBack}
      >
        <Ionicons name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NotAnsweredCall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  avatarContainer: {
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
  doctorName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  statusContainer: {
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
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 32,
  },
  infoIconContainer: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  actionsContainer: {
    width: '100%',
  },
  actionTitle: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2D5F30',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D5F30',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2D5F30',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});