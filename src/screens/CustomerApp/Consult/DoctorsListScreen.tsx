import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/CustomerAppNavigator'
import { StorageService } from '../../../authentication/storage'
import { User } from '../../../authentication/types'

type DoctorsListScreenRouteProp = RouteProp<RootStackParamList, 'DoctorsList'>
type DoctorsListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DoctorsList'>

const DoctorsListScreen = () => {
  const route = useRoute<DoctorsListScreenRouteProp>()
  const navigation = useNavigation<DoctorsListScreenNavigationProp>()
  const { concernName } = route.params
  
  const [doctors, setDoctors] = useState<User[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([concernName || 'All'])

  const filters = ['All', 'Hypertension', 'Diabetes', 'Anxiety', 'Obesity', 'Joint Pain', 'Rubella', 'Hypothermia', 'Frostbite', 'Sex']

  useEffect(() => {
    loadDoctors()
  }, [])

  useEffect(() => {
    filterDoctors()
  }, [doctors, selectedFilters, searchQuery])

  const loadDoctors = async () => {
    try {
      setLoading(true)
      // Initialize fake doctors if they don't exist
      await StorageService.initializeDoctorUsers()
      // Load ALL doctors first, then filter them
      const allDoctors = await StorageService.getAllDoctors()
      setDoctors(allDoctors)
    } catch (error) {
      console.error('Error loading doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterDoctors = () => {
    if (doctors.length === 0) {
      setFilteredDoctors([])
      return
    }

    let result = [...doctors]

    // Filter by selected concerns (only if not 'All')
    if (selectedFilters.length > 0 && !selectedFilters.includes('All')) {
      result = result.filter(doctor => {
        if (!doctor.concerns || doctor.concerns.length === 0) return false
        return doctor.concerns.some(concern => selectedFilters.includes(concern))
      })
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(query) ||
        (doctor.specialty && doctor.specialty.toLowerCase().includes(query)) ||
        (doctor.concerns && doctor.concerns.some(concern => concern.toLowerCase().includes(query)))
      )
    }

    setFilteredDoctors(result)
  }

  const toggleFilter = (filter: string) => {
    if (filter === 'All') {
      setSelectedFilters(['All'])
    } else {
      const newFilters = selectedFilters.filter(f => f !== 'All')
      if (selectedFilters.includes(filter)) {
        const filtered = newFilters.filter(f => f !== filter)
        setSelectedFilters(filtered.length === 0 ? ['All'] : filtered)
      } else {
        setSelectedFilters([...newFilters, filter])
      }
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity 
          style={styles.walletButton}
          onPress={() => {}}
        >
          <Ionicons name="wallet-outline" size={20} color="#1F2937" />
          <Text style={styles.walletText}>₹ 150</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                selectedFilters.includes(filter) && styles.filterPillActive,
              ]}
              onPress={() => toggleFilter(filter)}
            >
              <Text style={[
                styles.filterPillText,
                selectedFilters.includes(filter) && styles.filterPillTextActive,
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="options-outline" size={20} color="#1F2937" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Doctors List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3A643B" />
            <Text style={styles.loadingText}>Loading doctors...</Text>
          </View>
        ) : filteredDoctors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No doctors found</Text>
            <Text style={styles.emptySubtext}>
              {doctors.length === 0 
                ? 'No doctors in database. Click "Reset & Reload" above.'
                : 'Try adjusting your filters or search query'}
            </Text>
          </View>
        ) : (
          filteredDoctors.map((doctor) => (
          <View key={doctor.id} style={styles.doctorCard}>
            <View style={styles.doctorHeader}>
              <Image 
                source={{ uri: doctor.profileImage || 'https://via.placeholder.com/80x80' }}
                style={styles.doctorImage}
              />
              <View style={styles.doctorInfo}>
                <View style={styles.doctorNameRow}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                  </View>
                </View>
                <Text style={styles.doctorSpecialty}>{doctor.specialty} • {doctor.reviewCount || 0} others</Text>
                <Text style={styles.doctorLanguages}>{doctor.languages?.join(', ') || 'Hindi, English'}</Text>
                <Text style={styles.doctorExperience}>Exp: {doctor.experience || 'N/A'}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.doctorPrice}>₹ {doctor.pricePerMin || 0}/min</Text>
                  <Text style={styles.doctorFreeTime}>Free ({doctor.freeMinutes || 0}min)</Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.ratingText}>{doctor.rating?.toFixed(1) || '0.0'}</Text>
              </View>
            </View>

            <View style={styles.doctorActions}>
              <TouchableOpacity 
                style={styles.scheduleButton}
                onPress={() => navigation.navigate('Schedule', { doctor })}
              >
                <Text style={styles.scheduleButtonText}>Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.callButton}>
                <Text style={styles.callButtonText}>Free Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters & Options</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            
            {/* Filter by Concerns */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Filter by Concerns</Text>
              <View style={styles.modalFiltersGrid}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.modalFilterChip,
                      selectedFilters.includes(filter) && styles.modalFilterChipActive,
                    ]}
                    onPress={() => toggleFilter(filter)}
                  >
                    <Text style={[
                      styles.modalFilterChipText,
                      selectedFilters.includes(filter) && styles.modalFilterChipTextActive,
                    ]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Stats */}
            <View style={styles.modalStats}>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>Total Doctors</Text>
                <Text style={styles.modalStatValue}>{doctors.length}</Text>
              </View>
              <View style={styles.modalStatDivider} />
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatLabel}>Matching</Text>
                <Text style={styles.modalStatValue}>{filteredDoctors.length}</Text>
              </View>
            </View>

            {/* Utility Buttons */}
            <View style={styles.modalUtilityButtons}>
              <TouchableOpacity 
                style={styles.modalUtilityButton}
                onPress={() => {
                  setSelectedFilters(['All'])
                  setSearchQuery('')
                }}
              >
                <Ionicons name="refresh-outline" size={18} color="#6B7280" />
                <Text style={styles.modalUtilityButtonText}>Clear All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalUtilityButton, styles.modalUtilityButtonDanger]}
                onPress={async () => {
                  await StorageService.clearAll()
                  setShowFilterModal(false)
                  loadDoctors()
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text style={[styles.modalUtilityButtonText, styles.modalUtilityButtonDangerText]}>Reset Data</Text>
              </TouchableOpacity>
            </View>

            {/* Apply Button */}
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default DoctorsListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  titleContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  walletText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingLeft: 16,
    gap: 12,
  },
  filterScrollContent: {
    paddingRight: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#3A643B',
    borderColor: '#3A643B',
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 16,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  doctorCard: {
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
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  doctorLanguages: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  doctorExperience: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  doctorPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  doctorFreeTime: {
    fontSize: 12,
    color: '#EF4444',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  doctorActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scheduleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A643B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A643B',
  },
  callButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3A643B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  applyButton: {
    backgroundColor: '#3A643B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalFiltersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalFilterChipActive: {
    backgroundColor: '#3A643B',
    borderColor: '#3A643B',
  },
  modalFilterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  modalFilterChipTextActive: {
    color: '#FFFFFF',
  },
  modalStats: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  modalStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  modalStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A643B',
  },
  modalUtilityButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modalUtilityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalUtilityButtonDanger: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  modalUtilityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalUtilityButtonDangerText: {
    color: '#EF4444',
  },
})