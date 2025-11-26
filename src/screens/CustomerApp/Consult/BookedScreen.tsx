import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/CustomerAppNavigator'
import { AppointmentsService } from '../../../services/appointments'
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
  const consultationFee = 50 // Fixed consultation fee
  const currentWalletBalance = 660 // This should come from user context/state

  useEffect(() => {
    // Save appointment when screen loads
    saveAppointment()
  }, [])

  const saveAppointment = async () => {
    try {
      if (!user) return

      const appointment = await AppointmentsService.saveAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        patientName: user.name,
        patientId: user.id,
        concern,
        severity,
        duration,
        durationType,
        date: appointmentDate,
        time: appointmentTime,
        consultationType: consultationType as 'phone' | 'video',
        price,
        paymentStatus: 'pending', // Initially pending until payment
        gender,
        age,
        height,
        weight,
      })

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
      await AppointmentsService.updatePaymentStatus(appointmentId, 'paid')

      Alert.alert(
        'Payment Successful',
        'Your payment has been processed successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('MainTabs') }]
      )
    } catch (error) {
      console.error('Error processing payment:', error)
      Alert.alert('Error', 'Payment failed. Please try again.')
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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

          {/* Make Payment Button */}
          <TouchableOpacity 
            style={styles.paymentButton}
            onPress={handlePayment}
          >
            <Text style={styles.paymentButtonText}>Make payment</Text>
          </TouchableOpacity>
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
  paymentButton: {
    backgroundColor: '#3A643B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
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
})