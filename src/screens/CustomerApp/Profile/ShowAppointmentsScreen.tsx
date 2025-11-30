import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ActiveAppointmentsService } from '../../../services/storageAdapter'
import { useAuth } from '../../../authentication/AuthContext'
import { RootStackParamList } from '../../../navigation/CustomerAppNavigator'

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientId: string;
  concern: string;
  severity: string;
  duration: number | string;
  durationType: string;
  date: string;
  time: string;
  consultationType: 'phone' | 'video';
  price: number;
  paymentStatus: 'paid' | 'pending';
  status: 'booked' | 'completed' | 'cancelled';
  gender?: string;
  age?: number | string;
  height?: number | string;
  weight?: number | string;
  createdAt?: string;
  updatedAt?: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppointmentDetails'>;

const ShowAppointments = () => {
  const navigation = useNavigation<NavigationProp>()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'appointments' | 'orders'>('appointments')
  const [showFilter, setShowFilter] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      if (!user?.id) return
      
      // Load all appointments and filter by patient ID
      const allAppointments = await ActiveAppointmentsService.getAllAppointments()
      const userAppointments = allAppointments.filter(
        (apt: Appointment) => apt.patientId === user.id
      )
      setAppointments(userAppointments)
    } catch (error) {
      console.error('Error loading appointments:', error)
    }
  }

  const handleMakePayment = async (appointmentId: string) => {
    try {
      await ActiveAppointmentsService.updatePaymentStatus(appointmentId, 'paid')
      // Reload appointments to reflect the change
      await loadAppointments()
    } catch (error) {
      console.error('Error processing payment:', error)
    }
  }

  const handleStartCall = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowDisclaimerModal(true)
  }

  const handleProceedCall = () => {
    setShowDisclaimerModal(false)
    if (selectedAppointment) {
      navigation.navigate('VideoCall', {
        appointment: selectedAppointment,
        userRole: 'customer'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981'
      case 'cancelled':
        return '#EF4444'
      default:
        return '#F59E0B'
    }
  }

  const getStatusText = (appointment: Appointment) => {
    if (appointment.status === 'completed') return 'Completed'
    if (appointment.status === 'cancelled') return 'Cancelled'
    return appointment.paymentStatus === 'paid' ? 'Upcoming' : 'Pending Payment'
  }

  const renderAppointmentCard = (appointment: Appointment) => {
    const status = getStatusText(appointment)
    const statusColor = getStatusColor(appointment.status)

    return (
      <View key={appointment.id} style={styles.appointmentCard}>
        <View style={styles.cardHeader}>
          <View style={styles.doctorInfo}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/50x50' }}
              style={styles.doctorImage}
            />
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>{appointment.doctorName}</Text>
              <Text style={styles.doctorSpecialty}>{appointment.concern}</Text>
              <View style={styles.statusBadge}>
                <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.appointmentInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{appointment.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{appointment.time}</Text>
          </View>
        </View>

        {appointment.status === 'booked' && appointment.paymentStatus === 'pending' && (
          <TouchableOpacity 
            style={styles.makePaymentButton}
            onPress={() => handleMakePayment(appointment.id)}
          >
            <Text style={styles.makePaymentButtonText}>Make Payment</Text>
          </TouchableOpacity>
        )}

        {appointment.status === 'booked' && appointment.paymentStatus === 'paid' && (
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.callButton}
              onPress={() => handleStartCall(appointment)}
            >
              <Text style={styles.callButtonText}>Start Call</Text>
            </TouchableOpacity>
          </View>
        )}

        {appointment.status === 'booked' && appointment.paymentStatus === 'paid' && (
          <TouchableOpacity style={styles.prescriptionCard}>
            <Text style={styles.prescriptionText}>Check Prescription</Text>
            <Text style={styles.prescriptionSubtext}>Dr. {appointment.doctorName.split(' ')[1]} has suggested some solution</Text>
            <Ionicons name="chevron-forward" size={20} color="#7C3AED" style={styles.prescriptionIcon} />
          </TouchableOpacity>
        )}

        {appointment.status === 'completed' && (
          <TouchableOpacity 
            style={styles.detailsButtonFull}
            onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'appointments' && styles.activeTab]}
          onPress={() => setActiveTab('appointments')}
        >
          <Text style={[styles.tabText, activeTab === 'appointments' && styles.activeTabText]}>
            Appointments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            Orders
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Button */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilter(!showFilter)}
        >
          <Text style={styles.filterText}>Filter Appointments</Text>
          <Ionicons name="chevron-down" size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {appointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No appointments found</Text>
          </View>
        ) : (
          appointments.map(renderAppointmentCard)
        )}
      </ScrollView>

      {/* Disclaimer Modal */}
      <Modal
        visible={showDisclaimerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDisclaimerModal(false)}
      >
        <View style={styles.disclaimerOverlay}>
          <View style={styles.disclaimerModal}>
            <Text style={styles.disclaimerTitle}>Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              By continuing, you consent to this call being recorded for quality and support purposes. Please provide accurate details to help the doctor assist you effectively.{' '}
              <Text style={styles.disclaimerLink}>Read Terms & Conditions...</Text>
            </Text>

            <TouchableOpacity 
              style={styles.proceedButton}
              onPress={handleProceedCall}
            >
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.disclaimerCancelButton}
              onPress={() => setShowDisclaimerModal(false)}
            >
              <Text style={styles.disclaimerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default ShowAppointments

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  activeTab: {
    backgroundColor: '#000000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
  },
  doctorDetails: {
    marginLeft: 12,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  appointmentInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  callButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2D5F30',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  prescriptionCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    padding: 12,
    position: 'relative',
  },
  prescriptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  prescriptionSubtext: {
    fontSize: 12,
    color: '#6B7280',
    paddingRight: 24,
  },
  prescriptionIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
  },
  detailsButtonFull: {
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  makePaymentButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2D5F30',
    alignItems: 'center',
    marginBottom: 8,
  },
  makePaymentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
  // Disclaimer Modal Styles
  disclaimerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  disclaimerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    minHeight: 320,
  },
  disclaimerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 32,
  },
  disclaimerLink: {
    color: '#2D5F30',
    fontWeight: '500',
  },
  proceedButton: {
    backgroundColor: '#2D5F30',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disclaimerCancelButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disclaimerCancelText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
})