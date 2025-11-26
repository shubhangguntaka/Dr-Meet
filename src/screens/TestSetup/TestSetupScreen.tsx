// src/screens/TestSetup/TestSetupScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../../authentication/storage';

export const TestSetupScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const setupTestData = async () => {
    try {
      setLoading(true);

      // Clear existing data first
      await StorageService.clearAll();

      // Initialize doctor users
      await StorageService.initializeDoctorUsers();

      setSetupComplete(true);
      Alert.alert(
        'Setup Complete!',
        'Test accounts created:\n\n' +
        'CUSTOMER ACCOUNT:\n' +
        'Email: example@gmail.com\n' +
        'Password: example\n\n' +
        'DOCTOR ACCOUNT:\n' +
        'Email: test@gmail.com\n' +
        'Password: test123\n\n' +
        'Use these accounts to test on both devices.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Setup error:', error);
      Alert.alert('Error', 'Failed to setup test data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flask" size={64} color="#3A643B" />
        <Text style={styles.title}>Test Setup</Text>
        <Text style={styles.subtitle}>
          Setup test accounts for multi-device testing
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={24} color="#3A643B" />
          <Text style={styles.cardTitle}>Important Information</Text>
        </View>
        <Text style={styles.cardText}>
          This will create test accounts that you can use on multiple devices:
        </Text>

        <View style={styles.accountBox}>
          <Text style={styles.accountRole}>👤 CUSTOMER ACCOUNT</Text>
          <Text style={styles.accountDetail}>Email: example@gmail.com</Text>
          <Text style={styles.accountDetail}>Password: example</Text>
          <Text style={styles.accountNote}>Use this to book appointments</Text>
        </View>

        <View style={styles.accountBox}>
          <Text style={styles.accountRole}>👨‍⚕️ DOCTOR ACCOUNT</Text>
          <Text style={styles.accountDetail}>Email: test@gmail.com</Text>
          <Text style={styles.accountDetail}>Password: test123</Text>
          <Text style={styles.accountNote}>Use this to view appointments</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="phone-portrait" size={24} color="#3A643B" />
          <Text style={styles.cardTitle}>Testing Steps</Text>
        </View>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>
            Run this setup on BOTH devices (scan QR code on each device)
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>
            On Device 1: Login with customer account (example@gmail.com)
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>
            On Device 2: Login with doctor account (test@gmail.com)
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <Text style={styles.stepNumber}>4</Text>
          <Text style={styles.stepText}>
            Book appointments from Device 1 (customer app)
          </Text>
        </View>

        <View style={styles.warningBox}>
          <Ionicons name="warning" size={20} color="#D97706" />
          <Text style={styles.warningText}>
            Note: Appointments won't sync between devices without a backend server.
            Each device has its own local storage.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="server" size={24} color="#EF4444" />
          <Text style={styles.cardTitle}>Real Multi-Device Solution</Text>
        </View>
        <Text style={styles.cardText}>
          For real multi-device functionality, you need:
        </Text>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Backend server (Firebase, Supabase, or custom API)</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Database to store users and appointments</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Real-time sync across devices</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.setupButton, loading && styles.setupButtonDisabled]}
        onPress={setupTestData}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="play-circle" size={24} color="#FFFFFF" />
            <Text style={styles.setupButtonText}>
              {setupComplete ? 'Setup Complete ✓' : 'Run Setup'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  accountBox: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  accountRole: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  accountDetail: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  accountNote: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3A643B',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    marginLeft: 8,
    lineHeight: 18,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#3A643B',
    marginRight: 8,
    width: 16,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  setupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3A643B',
    marginHorizontal: 20,
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  setupButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  setupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    alignItems: 'center',
    marginVertical: 20,
  },
  backButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
