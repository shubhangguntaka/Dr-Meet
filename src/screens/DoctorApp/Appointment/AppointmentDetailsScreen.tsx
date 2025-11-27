import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRoute, useNavigation } from '@react-navigation/native'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../../../navigation/DoctorAppNavigator'

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
    medicalReports: false,
    addPrescription: false,
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
        {/* Patient Info Card */}
        <View style={styles.patientCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(appointment.patientName)}</Text>
            </View>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientLabel}>Patient name:</Text>
            <Text style={styles.patientName}>{appointment.patientName}</Text>
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
                <Text style={styles.detailLabel}>Patient name</Text>
                <Text style={styles.detailValue}>{appointment.patientName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Appointment Type</Text>
                <Text style={styles.detailValue}>{appointment.consultationType === 'video' ? 'Video' : 'Phone'} Audio</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Appointment Duration</Text>
                <Text style={styles.detailValue}>{appointment.duration} {appointment.durationType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Appointment Date</Text>
                <Text style={styles.detailValue}>{appointment.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Appointment Time</Text>
                <Text style={styles.detailValue}>{appointment.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Booking Status</Text>
                <Text style={styles.detailValue}>{appointment.doctorName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Status</Text>
                <Text style={styles.detailValue}>{appointment.paymentStatus === 'paid' ? 'Paid' : 'Not Assigned'}</Text>
              </View>
            </View>
          )}

          {/* Symptom Details */}
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('symptomDetails')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Symptom Details</Text>
            <Ionicons 
              name={expandedSections.symptomDetails ? "chevron-down" : "chevron-forward"} 
              size={24} 
              color="#2D5F30" 
            />
          </TouchableOpacity>
          {expandedSections.symptomDetails && (
            <View style={styles.sectionContent}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Concern</Text>
                <Text style={styles.detailValue}>{appointment.concern}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Severity</Text>
                <Text style={styles.detailValue}>{appointment.severity}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Symptom Duration</Text>
                <Text style={styles.detailValue}>{appointment.duration} {appointment.durationType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Body Location</Text>
                <Text style={styles.detailValue}>Two part often</Text>
              </View>
            </View>
          )}

          {/* Coupon Details */}
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('couponDetails')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Coupon Details</Text>
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
                <Text style={styles.detailValue}>-</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Discount Applied</Text>
                <Text style={styles.detailValue}>-</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Discount Amount</Text>
                <Text style={styles.detailValue}>0 undefined</Text>
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
                <Text style={styles.detailLabel}>Booking Date</Text>
                <Text style={styles.detailValue}>{appointment.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Booking Time</Text>
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

          {/* Medical Reports */}
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('medicalReports')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Medical Reports</Text>
            <Ionicons 
              name={expandedSections.medicalReports ? "chevron-down" : "chevron-forward"} 
              size={24} 
              color="#2D5F30" 
            />
          </TouchableOpacity>
          {expandedSections.medicalReports && (
            <View style={styles.sectionContent}>
              <View style={styles.medicalReportItem}>
                <Ionicons name="document-text-outline" size={20} color="#6B7280" />
                <Text style={styles.medicalReportText}>1246890_medical_reports_current.jpg</Text>
                <TouchableOpacity>
                  <Ionicons name="download-outline" size={20} color="#2D5F30" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Add Prescription */}
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('addPrescription')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Add Prescription</Text>
            <Ionicons 
              name={expandedSections.addPrescription ? "chevron-down" : "chevron-forward"} 
              size={24} 
              color="#2D5F30" 
            />
          </TouchableOpacity>
          {expandedSections.addPrescription && (
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.updateButton}>
                <Text style={styles.updateButtonText}>Update Prescription</Text>
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
  patientCard: {
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
  patientInfo: {
    alignItems: 'center',
  },
  patientLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  patientName: {
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
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 8,
  },
  medicalReportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  medicalReportText: {
    flex: 1,
    fontSize: 13,
    color: '#000000',
  },
  updateButton: {
    backgroundColor: '#2D5F30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})