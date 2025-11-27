import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../../../navigation/CustomerAppNavigator'

type AppointmentDetailsRouteProp = RouteProp<RootStackParamList, 'AppointmentDetails'>;

const AppointmentDetailsScreen = () => {
  const route = useRoute<AppointmentDetailsRouteProp>()
  const navigation = useNavigation()
  const { appointment } = route.params

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    appointmentDetails: false,
    symptomDetails: false,
    couponDetails: false,
    bookingDetails: false,
    medicalReport: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    const words = name.trim().split(' ')
    if (words.length === 1) return words[0].charAt(0).toUpperCase()
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Doctor Info Card */}
        <View style={styles.doctorCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(appointment.doctorName)}</Text>
            </View>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorLabel}>Doctor name:</Text>
            <Text style={styles.doctorName}>{appointment.doctorName}</Text>
          </View>
        </View>

        {/* Expandable Sections */}
        <View style={styles.sectionsContainer}>
            {/* Appointment Details */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('appointmentDetails')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>Appointment Details</Text>
              <Ionicons 
                name={expandedSections.appointmentDetails ? "chevron-down" : "chevron-forward"} 
                size={24} 
                color="#2D5F30" 
              />
            </TouchableOpacity>
            {expandedSections.appointmentDetails && (
              <View style={styles.sectionContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Appointment Id</Text>
                  <Text style={styles.detailValue}>{appointment.id}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Appointment Type</Text>
                  <Text style={styles.detailValue}>{appointment.consultationType === 'video' ? 'Freecalls' : 'Freecalls'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Appointment Duration</Text>
                  <Text style={styles.detailValue}>{appointment.duration} {appointment.durationType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{appointment.duration} {appointment.durationType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Appointment date</Text>
                  <Text style={styles.detailValue}>{appointment.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Appointment time</Text>
                  <Text style={styles.detailValue}>{appointment.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Booking Status</Text>
                  <Text style={styles.detailValue}>{appointment.status}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Status</Text>
                  <Text style={styles.detailValue}>{appointment.paymentStatus === 'paid' ? 'Completed' : 'Not Assigned'}</Text>
                </View>
              </View>
            )}

            {/* Symptoms Details */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('symptomDetails')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>Symptoms Details</Text>
              <Ionicons 
                name={expandedSections.symptomDetails ? "chevron-down" : "chevron-forward"} 
                size={24} 
                color="#2D5F30" 
              />
            </TouchableOpacity>
            {expandedSections.symptomDetails && (
              <View style={styles.sectionContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Symptoms</Text>
                  <Text style={styles.detailValue}>{appointment.concern}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.detailValue}>{appointment.severity}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>Moderate</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Symptom Duration</Text>
                  <Text style={styles.detailValue}>weeks</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Body pattern</Text>
                  <Text style={styles.detailValue}>N/A</Text>
                </View>
              </View>
            )}

            {/* Coupons Details */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('couponDetails')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>Coupons Details</Text>
              <Ionicons 
                name={expandedSections.couponDetails ? "chevron-down" : "chevron-forward"} 
                size={24} 
                color="#2D5F30" 
              />
            </TouchableOpacity>
            {expandedSections.couponDetails && (
              <View style={styles.sectionContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Coupon Code</Text>
                  <Text style={styles.detailValue}>N/A</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Coupon Applied</Text>
                  <Text style={styles.detailValue}>N/A</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Discount amount</Text>
                  <Text style={styles.detailValue}>0</Text>
                </View>
              </View>
            )}

            {/* Booking Details */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('bookingDetails')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>Booking Details</Text>
              <Ionicons 
                name={expandedSections.bookingDetails ? "chevron-down" : "chevron-forward"} 
                size={24} 
                color="#2D5F30" 
              />
            </TouchableOpacity>
            {expandedSections.bookingDetails && (
              <View style={styles.sectionContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>BookingAs</Text>
                  <Text style={styles.detailValue}>Patient</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Booking date</Text>
                  <Text style={styles.detailValue}>{appointment.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Booking time</Text>
                  <Text style={styles.detailValue}>{appointment.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Date</Text>
                  <Text style={styles.detailValue}>{appointment.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Time</Text>
                  <Text style={styles.detailValue}>{appointment.time}</Text>
                </View>
              </View>
            )}

            {/* Medical Report */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('medicalReport')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>Medical Report</Text>
              <Ionicons 
                name={expandedSections.medicalReport ? "chevron-down" : "chevron-forward"} 
                size={24} 
                color="#2D5F30" 
              />
            </TouchableOpacity>
            {expandedSections.medicalReport && (
              <View style={styles.sectionContent}>
                <TouchableOpacity style={styles.attachButton}>
                  <Text style={styles.attachButtonText}>Attach report</Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AppointmentDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F5B976',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doctorInfo: {
    alignItems: 'center',
  },
  doctorLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  sectionsContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  sectionContent: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: -4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '400',
    color: '#000000',
    flex: 1,
    textAlign: 'right',
  },
  attachButton: {
    backgroundColor: '#2D5F30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  attachButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})