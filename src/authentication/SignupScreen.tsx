// src/authentication/SignupScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './AuthContext';
import { UserRole } from './types';

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Doctor specific fields
  const [specialty, setSpecialty] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  const validateForm = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }

    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (selectedRole === 'doctor') {
      if (!specialty || !registrationNumber) {
        Alert.alert('Error', 'Please fill in specialty and registration number');
        return false;
      }
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await signup({
      name,
      email,
      password,
      phone,
      role: selectedRole,
      specialty: selectedRole === 'doctor' ? specialty : undefined,
      registrationNumber: selectedRole === 'doctor' ? registrationNumber : undefined,
    });
    setIsLoading(false);

    if (result.success) {
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Signup Failed', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBackground}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Create your account to get started</Text>

        {/* Role Selection */}
        <View style={styles.roleContainer}>
          <Text style={styles.label}>I am a</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[styles.roleButton, selectedRole === 'customer' && styles.roleButtonActive]}
              onPress={() => setSelectedRole('customer')}
            >
              <Ionicons
                name="person"
                size={24}
                color={selectedRole === 'customer' ? '#FFFFFF' : '#3A643B'}
              />
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === 'customer' && styles.roleButtonTextActive,
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, selectedRole === 'doctor' && styles.roleButtonActive]}
              onPress={() => setSelectedRole('doctor')}
            >
              <Ionicons
                name="medkit"
                size={24}
                color={selectedRole === 'doctor' ? '#FFFFFF' : '#3A643B'}
              />
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === 'doctor' && styles.roleButtonTextActive,
                ]}
              >
                Doctor
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Doctor Specific Fields */}
        {selectedRole === 'doctor' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specialty *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="medical-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Cardiologist, Dermatologist"
                  value={specialty}
                  onChangeText={setSpecialty}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Registration Number *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="card-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter medical registration number"
                  value={registrationNumber}
                  onChangeText={setRegistrationNumber}
                />
              </View>
            </View>
          </>
        )}

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Create a password (min 6)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signupButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3A643B',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  headerBackground: {
    backgroundColor: '#3A643B',
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginTop: -10,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  roleContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3A643B',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: '#3A643B',
    borderColor: '#3A643B',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A643B',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 8,
  },
  signupButton: {
    backgroundColor: '#3A643B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#3A643B',
    fontWeight: '600',
  },
});
