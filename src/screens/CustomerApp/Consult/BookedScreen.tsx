import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/CustomerAppNavigator'
import { ActiveAppointmentsService } from '../../../services/storageAdapter'
import { useAuth } from '../../../authentication/AuthContext'

type BookedScreenRouteProp = RouteProp<RootStackParamList, 'Booked'>
type BookedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Booked'>

const BookedScreen = () => {
  const route = useRoute<BookedScreenRouteProp>()
  const navigation = useNavigation<BookedScreenNavigationProp>()
  const { user } = useAuth()
  const { 
    doctor, 
    appointmentDate, 
    appointmentTime, 
    consultationType, 
    price,
    concern,
    severity,
    duration,
    durationType,
    gender,
    age,
    height,
    weight
  } = route.params

  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const consultationFee = 50 // Fixed consultation fee
  const currentWalletBalance = 660 // This should come from user context/state

  useEffect(() => {
    // Save appointment when screen loads
    saveAppointment()
  }, [])

  const saveAppointment = async () => {
    try {
      if (!user) return

      const appointmentData: any = {
        doctorId: doctor.id,
        doctorName: doctor.name,
        patientName: user.name,
        patientId: user.id,
        concern,
        severity,
        duration: parseInt(duration) || 0,
        durationType,
        date: appointmentDate,
        time: appointmentTime,
        consultationType: consultationType as 'phone' | 'video',
        price,
        paymentStatus: 'pending' as const,
        status: 'booked' as const,
        gender,
        age: parseInt(age) || 0,
        height: parseFloat(height) || 0,
        weight: parseFloat(weight) || 0,
      }

      const appointment = await ActiveAppointmentsService.saveAppointment(appointmentData)

      setAppointmentId(appointment.id)
    } catch (error) {
      console.error('Error saving appointment:', error)
      Alert.alert('Error', 'Failed to save appointment')
    }
  }

  const handlePayment = async () => {
    try {
      if (!appointmentId) {
        Alert.alert('Error', 'Appointment not found')
        return
      }

      // Update payment status to paid
      await ActiveAppointmentsService.updatePaymentStatus(appointmentId, 'paid')

      // Show success screen
      setPaymentCompleted(true)
    } catch (error) {
      console.error('Error processing payment:', error)
      Alert.alert('Error', 'Payment failed. Please try again.')
    }
  }

  const handleCheckBookings = () => {
    navigation.navigate('ShowAppointments')
  }

  const handlePaymentLater = () => {
    navigation.navigate('ShowAppointments')
  }

  const handleGoBack = () => {
    navigation.navigate('MainTabs')
  }

  if (paymentCompleted) {
    // Payment Success Screen
    return (
      <SafeAreaView style={styles.successContainer} edges={['top']}>
        <View style={styles.successContent}>
          {/* Doctor Image with Checkmark and Badge */}
          <View style={styles.successImageContainer}>
            <Image 
              source={{ uri: doctor.profileImage || 'https://via.placeholder.com/140x140' }}
              style={styles.successDoctorImage}
            />
            <View style={styles.successCheckmark}>
              <Ionicons name="checkmark" size={28} color="#FFFFFF" />
            </View>
          </View>

          {/* Payment Info */}
          <Text style={styles.successTitle}>Paid ₹{consultationFee}</Text>
          <Text style={styles.successSubtitle}>Chat Consultation Booked Successfully</Text>

          {/* Available Balance */}
          <View style={styles.balanceContainer}>
            <Ionicons name="wallet-outline" size={24} color="#7C3AED" />
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>₹ {currentWalletBalance - consultationFee}</Text>
          </View>
        </View>

        {/* Check Bookings Button */}
        <TouchableOpacity 
          style={styles.checkBookingsButton}
          onPress={handleCheckBookings}
        >
          <Text style={styles.checkBookingsButtonText}>Check Bookings</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  // Pre-Payment Screen
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Confirmation</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Doctor Image with Checkmark */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: doctor.profileImage || 'https://via.placeholder.com/120x120' }}
              style={styles.doctorImage}
            />
            <View style={styles.checkmarkBadge}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Appointment Confirmed</Text>
          <Text style={styles.subtitle}>
            Thank you for choosing our Experts to help guide you
          </Text>

          {/* Appointment Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expert</Text>
              <Text style={styles.detailValue}>{doctor.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Appointment Date</Text>
              <Text style={styles.detailValue}>{appointmentDate}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Appointment Time</Text>
              <Text style={styles.detailValue}>{appointmentTime}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Consultation Type</Text>
              <Text style={styles.detailValue}>
                {consultationType === 'phone' ? 'Phone Consultation' : 'Video Consultation'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Current Wallet Balance</Text>
              <Text style={styles.detailValue}>₹ {currentWalletBalance}</Text>
            </View>

            <View style={[styles.detailRow, styles.feeRow]}>
              <Text style={styles.detailLabel}>Consultation Fee</Text>
              <Text style={styles.feeValue}>₹ {consultationFee}</Text>
            </View>
          </View>

          {/* Payment Buttons */}
          <View style={styles.paymentButtonsContainer}>
            <TouchableOpacity 
              style={styles.paymentLaterButton}
              onPress={handlePaymentLater}
            >
              <Text style={styles.paymentLaterButtonText}>Payment Later</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.paymentButton}
              onPress={handlePayment}
            >
              <Text style={styles.paymentButtonText}>Make payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BookedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 20,
    marginBottom: 24,
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  checkmarkBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  feeRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  feeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A643B',
  },
  paymentButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 32,
  },
  paymentLaterButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3A643B',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  paymentLaterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A643B',
  },
  paymentButton: {
    flex: 1,
    backgroundColor: '#3A643B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Payment Success Screen Styles
  successContainer: {
    flex: 1,
    backgroundColor: '#D4E8D4',
    justifyContent: 'space-between',
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  successImageContainer: {
    position: 'relative',
    marginBottom: 32,
    alignItems: 'center',
  },
  successDoctorImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  successCheckmark: {
    position: 'absolute',
    bottom: 5,
    left: '50%',
    marginLeft: -20,
    backgroundColor: '#4CAF50',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  balanceContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 40,
    borderRadius: 16,
    minWidth: 200,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  checkBookingsButton: {
    backgroundColor: '#2D5F30',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  checkBookingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})