import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/CustomerAppNavigator'

type BookedScreenRouteProp = RouteProp<RootStackParamList, 'Booked'>
type BookedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Booked'>

const BookedScreen = () => {
  const route = useRoute<BookedScreenRouteProp>()
  const navigation = useNavigation<BookedScreenNavigationProp>()
  const { doctor, appointmentDate, appointmentTime, consultationType, price } = route.params

  const consultationFee = 50 // Fixed consultation fee
  const currentWalletBalance = 660 // This should come from user context/state

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
            onPress={() => {
              // Handle payment logic here
              navigation.navigate('MainTabs')
            }}
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