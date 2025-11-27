import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Alert, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { AppHeader } from '../../../components/AppHeader'
import { ActiveAppointmentsService } from '../../../services/storageAdapter'
import { useAuth } from '../../../authentication/AuthContext'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/DoctorAppNavigator'

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

const AppointmentScreen = () => {
  const { user } = useAuth()
  const navigation = useNavigation<NavigationProp>()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDate, setFilterDate] = useState<string>('')
  const [filterConsultationType, setFilterConsultationType] = useState<'phone' | 'video' | 'all'>('all')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<'paid' | 'pending' | 'all'>('all')

  useEffect(() => {
    loadAppointments()
    
    // Subscribe to real-time updates (only works with Supabase)
    if (user) {
      const subscription = ActiveAppointmentsService.subscribeToAppointments(
        user.id,
        (updatedAppointments: Appointment[]) => {
          console.log('📡 Real-time update received:', updatedAppointments.length, 'appointments')
          setAppointments(updatedAppointments)
        }
      )

      // Cleanup subscription on unmount
      return () => {
        ActiveAppointmentsService.unsubscribe(subscription)
      }
    }
  }, [user])

  useEffect(() => {
    applyFilters()
  }, [appointments, searchQuery, filterDate, filterConsultationType, filterPaymentStatus])

  const loadAppointments = async () => {
    if (!user) return

    try {
      const data = await ActiveAppointmentsService.getAppointmentsByDoctor(user.id)
      setAppointments(data)
    } catch (error) {
      console.error('Error loading appointments:', error)
    }
  }

  const applyFilters = () => {
    let filtered = [...appointments]

    // Filter by search query (patient name or concern)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(a => 
        a.patientName.toLowerCase().includes(query) ||
        a.concern.toLowerCase().includes(query)
      )
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(a => a.date === filterDate)
    }

    // Filter by consultation type
    if (filterConsultationType !== 'all') {
      filtered = filtered.filter(a => a.consultationType === filterConsultationType)
    }

    // Filter by payment status
    if (filterPaymentStatus !== 'all') {
      filtered = filtered.filter(a => a.paymentStatus === filterPaymentStatus)
    }

    setFilteredAppointments(filtered)
  }

  const clearFilters = () => {
    setFilterDate('')
    setFilterConsultationType('all')
    setFilterPaymentStatus('all')
    setShowFilterModal(false)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAppointments()
    setRefreshing(false)
  }

  const handleStartCall = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowDisclaimerModal(true)
  }

  const handleProceedCall = () => {
    setShowDisclaimerModal(false)
    // Handle actual call logic here
    Alert.alert('Start Call', `Starting ${selectedAppointment?.consultationType} call with ${selectedAppointment?.patientName}...`)
  }

  const handleCancel = async (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await ActiveAppointmentsService.updateAppointmentStatus(appointmentId, 'cancelled')
              loadAppointments()
              Alert.alert('Success', 'Appointment cancelled successfully')
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment')
            }
          },
        },
      ]
    )
  }

  const getStatusColor = (paymentStatus: string) => {
    return paymentStatus === 'paid' ? '#10B981' : '#D97706'
  }

  const getStatusText = (paymentStatus: string) => {
    return paymentStatus === 'paid' ? 'Booked-Paid' : 'Booked-Payment Pending'
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader />
      
      {/* Search Bar with Action Buttons */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by patient name or concern..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Action Buttons */}
        <View style={styles.iconButtonsGroup}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <Ionicons name="refresh" size={22} color={refreshing ? "#9CA3AF" : "#3A643B"} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="filter" size={22} color="#3A643B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.appointmentsList}>
          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>No appointments found</Text>
            </View>
          ) : (
            filteredAppointments.map((appointment) => (
              <TouchableOpacity 
                key={appointment.id} 
                style={styles.appointmentCard}
                onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
                activeOpacity={0.7}
              >
                {/* Patient Info */}
                <View style={styles.patientHeader}>
                  <View>
                    <Text style={styles.patientName}>{appointment.patientName}</Text>
                    <Text style={styles.concern}>{appointment.concern}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(appointment.paymentStatus) }]} />
                  </View>
                </View>

                {/* Status */}
                <Text style={[styles.statusText, { color: getStatusColor(appointment.paymentStatus) }]}>
                  {getStatusText(appointment.paymentStatus)}
                </Text>

                {/* Appointment Details */}
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{appointment.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{appointment.time}</Text>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="cash-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>₹{appointment.price}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons 
                      name={appointment.consultationType === 'video' ? 'videocam-outline' : 'call-outline'} 
                      size={16} 
                      color="#6B7280" 
                    />
                    <Text style={styles.detailText}>{appointment.consultationType === 'video' ? 'Video' : 'Phone'}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleCancel(appointment.id);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.startCallButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleStartCall(appointment);
                    }}
                  >
                    <Text style={styles.startCallButtonText}>Start Call</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Appointments</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent}>
              {/* Consultation Type Filter */}
              <Text style={styles.filterLabel}>Consultation Type</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity 
                  style={[styles.filterOption, filterConsultationType === 'all' && styles.filterOptionActive]}
                  onPress={() => setFilterConsultationType('all')}
                >
                  <Text style={[styles.filterOptionText, filterConsultationType === 'all' && styles.filterOptionTextActive]}>
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, filterConsultationType === 'video' && styles.filterOptionActive]}
                  onPress={() => setFilterConsultationType('video')}
                >
                  <Text style={[styles.filterOptionText, filterConsultationType === 'video' && styles.filterOptionTextActive]}>
                    Video
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, filterConsultationType === 'phone' && styles.filterOptionActive]}
                  onPress={() => setFilterConsultationType('phone')}
                >
                  <Text style={[styles.filterOptionText, filterConsultationType === 'phone' && styles.filterOptionTextActive]}>
                    Phone
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Payment Status Filter */}
              <Text style={styles.filterLabel}>Payment Status</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity 
                  style={[styles.filterOption, filterPaymentStatus === 'all' && styles.filterOptionActive]}
                  onPress={() => setFilterPaymentStatus('all')}
                >
                  <Text style={[styles.filterOptionText, filterPaymentStatus === 'all' && styles.filterOptionTextActive]}>
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, filterPaymentStatus === 'paid' && styles.filterOptionActive]}
                  onPress={() => setFilterPaymentStatus('paid')}
                >
                  <Text style={[styles.filterOptionText, filterPaymentStatus === 'paid' && styles.filterOptionTextActive]}>
                    Paid
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, filterPaymentStatus === 'pending' && styles.filterOptionActive]}
                  onPress={() => setFilterPaymentStatus('pending')}
                >
                  <Text style={[styles.filterOptionText, filterPaymentStatus === 'pending' && styles.filterOptionTextActive]}>
                    Pending
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  clearFilters()
                  setShowFilterModal(false)
                }}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

export default AppointmentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  iconButtonsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  refreshButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#3A643B',
    gap: 6,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3A643B',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3A643B',
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3A643B',
  },
  scrollView: {
    flex: 1,
  },
  appointmentsList: {
    padding: 16,
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
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  concern: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  statusText: {
    fontSize: 13,
    color: '#D97706',
    fontWeight: '500',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  startCallButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3A643B',
    alignItems: 'center',
  },
  startCallButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterContent: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 20,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  filterOptionActive: {
    backgroundColor: '#3A643B',
    borderColor: '#3A643B',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#3A643B',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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