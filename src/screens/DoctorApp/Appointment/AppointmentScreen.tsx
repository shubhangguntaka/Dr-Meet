import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { AppHeader } from '../../../components/AppHeader'
import { AppointmentsService, Appointment } from '../../../services/appointments'
import { useAuth } from '../../../authentication/AuthContext'

const AppointmentScreen = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [showFilterModal, setShowFilterModal] = useState(false)
  
  // Filter states
  const [filterDate, setFilterDate] = useState<string>('')
  const [filterConsultationType, setFilterConsultationType] = useState<'phone' | 'video' | 'all'>('all')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<'paid' | 'pending' | 'all'>('all')

  useEffect(() => {
    loadAppointments()
  }, [user])

  useEffect(() => {
    applyFilters()
  }, [appointments, filterDate, filterConsultationType, filterPaymentStatus])

  const loadAppointments = async () => {
    if (!user) return

    try {
      const data = await AppointmentsService.getAppointmentsByDoctor(user.id)
      setAppointments(data)
    } catch (error) {
      console.error('Error loading appointments:', error)
    }
  }

  const applyFilters = () => {
    let filtered = [...appointments]

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
  }

  const handleStartCall = (appointmentId: string) => {
    // Handle start call logic
    Alert.alert('Start Call', 'Starting video/phone call...')
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
              await AppointmentsService.updateAppointmentStatus(appointmentId, 'cancelled')
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
      
      <View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={20} color="#3A643B" />
        </TouchableOpacity>
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
              <View key={appointment.id} style={styles.appointmentCard}>
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
                    onPress={() => handleCancel(appointment.id)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.startCallButton}
                    onPress={() => handleStartCall(appointment.id)}
                  >
                    <Text style={styles.startCallButtonText}>Start Call</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  filterButton: {
    left: 300,
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
})