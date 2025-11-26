import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput, Alert, Modal } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/CustomerAppNavigator'
import Slider from '@react-native-community/slider'

type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>
type BookingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Booking'>

type DurationType = 'Days' | 'Weeks' | 'Months' | 'Year'

const concernOptions = [
  'Diabetes',
  'Hypertension',
  'Anxiety',
  'Obesity',
  'Joint Pain',
  'Rubella',
  'Hypothermia',
  'Frostbite',
  'Depression',
  'Migraine',
  'Asthma',
  'Thyroid',
  'Other'
]

const BookingScreen = () => {
  const route = useRoute<BookingScreenRouteProp>()
  const navigation = useNavigation<BookingScreenNavigationProp>()
  const { doctor, consultationType, price } = route.params
  
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [concern, setConcern] = useState('')
  const [showConcernDropdown, setShowConcernDropdown] = useState(false)
  const [severity, setSeverity] = useState(1)
  const [duration, setDuration] = useState('28')
  const [durationType, setDurationType] = useState<DurationType>('Days')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  // Generate dates for the calendar (next 14 days)
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const dates = generateDates()

  // Time slots
  const timeSlots = {
    morning: ['09:00 AM', '09:35 AM', '10:05 AM'],
    afternoon: ['12:00 PM', '12:35 PM', '01:05 PM'],
    evening: ['06:00 AM', '07:00 AM', '08:05 AM']
  }

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${day} ${monthNames[date.getMonth()]}`
  }

  const getDayName = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.getDay()]
  }

  const formatFullDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${day} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
  }

  const getSeverityLabel = () => {
    if (severity === 0) return 'Mild'
    if (severity === 1) return 'Moderate'
    return 'Severe'
  }

  const handleNext = () => {
    if (currentStep === 1 && !selectedDate) {
      Alert.alert('Selection Required', 'Please select a date')
      return
    }
    if (currentStep === 2 && !selectedTime) {
      Alert.alert('Selection Required', 'Please select a time slot')
      return
    }
    if (currentStep === 3) {
      if (!concern.trim()) {
        Alert.alert('Selection Required', 'Please select your concern')
        return
      }
      if (!duration.trim()) {
        Alert.alert('Input Required', 'Please enter the duration')
        return
      }
    }
    if (currentStep === 4) {
      if (!gender.trim()) {
        Alert.alert('Input Required', 'Please select your gender')
        return
      }
      if (!age.trim()) {
        Alert.alert('Input Required', 'Please enter your age')
        return
      }
      if (!height.trim()) {
        Alert.alert('Input Required', 'Please enter your height')
        return
      }
      if (!weight.trim()) {
        Alert.alert('Input Required', 'Please enter your weight')
        return
      }
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      // Navigate to BookedScreen with all booking details
      navigation.navigate('Booked', {
        doctor,
        appointmentDate: formatFullDate(selectedDate!),
        appointmentTime: selectedTime!,
        consultationType,
        price,
        concern,
        severity: getSeverityLabel(),
        duration,
        durationType,
        gender,
        age,
        height,
        weight
      })
    }
  }

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return 'Choose Date'
      case 2: return 'Choose Time Slot'
      case 3: return 'Your Concern'
      case 4: return 'Basic Information'
      case 5: return 'Confirm Booking'
      default: return ''
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => currentStep === 1 ? navigation.goBack() : setCurrentStep(currentStep - 1)}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getStepTitle()}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(currentStep / 5) * 100}%` }]} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Doctor Info */}
        <View style={styles.doctorCard}>
          <Image 
            source={{ uri: doctor.profileImage || 'https://via.placeholder.com/60x60' }}
            style={styles.doctorImage}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
            {currentStep >= 2 && (
              <Text style={styles.consultationInfo}>
                {consultationType === 'phone' ? 'Phone' : 'Video'} Consultation - ₹{price}/min
              </Text>
            )}
          </View>
        </View>

        {/* Step 1: Date Selection */}
        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Pick Appointment Date</Text>
            <View style={styles.datesGrid}>
              {dates.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    selectedDate?.toDateString() === date.toDateString() && styles.dateCardSelected
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[
                    styles.dateText,
                    selectedDate?.toDateString() === date.toDateString() && styles.dateTextSelected
                  ]}>
                    {formatDate(date)}
                  </Text>
                  <Text style={[
                    styles.dayText,
                    selectedDate?.toDateString() === date.toDateString() && styles.dayTextSelected
                  ]}>
                    {getDayName(date)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedDate && (
              <View style={styles.selectedDateDisplay}>
                <Ionicons name="calendar-outline" size={20} color="#3A643B" />
                <Text style={styles.selectedDateText}>{formatFullDate(selectedDate)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Step 2: Time Selection */}
        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Pick a time slot</Text>
            
            <Text style={styles.timeCategory}>Morning</Text>
            <View style={styles.timeSlotsRow}>
              {timeSlots.morning.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotSelected
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.timeCategory}>Afternoon</Text>
            <View style={styles.timeSlotsRow}>
              {timeSlots.afternoon.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotSelected
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.timeCategory}>Evening</Text>
            <View style={styles.timeSlotsRow}>
              {timeSlots.evening.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotSelected
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Concern Form */}
        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.formLabel}>Please select a concern</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowConcernDropdown(true)}
            >
              <Text style={[styles.dropdownButtonText, !concern && styles.dropdownPlaceholder]}>
                {concern || 'Select concern'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>

            <Text style={styles.formLabel}>Select severity of your concern</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.sliderTrack}
                minimumValue={0}
                maximumValue={2}
                step={1}
                value={severity}
                onValueChange={setSeverity}
                minimumTrackTintColor="#3A643B"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#3A643B"
              />
              <View style={styles.sliderLabels}>
                <Text style={[styles.sliderLabel, severity === 0 && styles.sliderLabelActive]}>Mild</Text>
                <Text style={[styles.sliderLabel, severity === 1 && styles.sliderLabelActive]}>Moderate</Text>
                <Text style={[styles.sliderLabel, severity === 2 && styles.sliderLabelActive]}>Severe</Text>
              </View>
            </View>

            <View style={styles.severityIndicator}>
              <View style={[
                styles.severityBadge,
                severity === 0 && styles.severityMild,
                severity === 1 && styles.severityModerate,
                severity === 2 && styles.severitySevere,
              ]}>
                <Text style={styles.severityBadgeText}>{getSeverityLabel()}</Text>
              </View>
            </View>

            <Text style={styles.formLabel}>How long have you been facing?</Text>
            <View style={styles.durationInputContainer}>
              <TextInput
                style={styles.durationInput}
                placeholder="Enter duration"
                placeholderTextColor="#9CA3AF"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.durationOptions}>
              {(['Days', 'Weeks', 'Months', 'Year'] as DurationType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.radioOption}
                  onPress={() => setDurationType(type)}
                >
                  <View style={styles.radioCircle}>
                    {durationType === type && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <Text style={styles.summaryText}>
                Concern: <Text style={styles.summaryValue}>{concern || 'Not selected'}</Text>
              </Text>
              <Text style={styles.summaryText}>
                Severity: <Text style={styles.summaryValue}>{getSeverityLabel()}</Text>
              </Text>
              <Text style={styles.summaryText}>
                Duration: <Text style={styles.summaryValue}>{duration} {durationType}</Text>
              </Text>
            </View>
          </View>
        )}

        {/* Step 4: Basic Information */}
        {currentStep === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Please provide your basic information</Text>
            
            <Text style={styles.formLabel}>Gender</Text>
            <View style={styles.genderOptions}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Male' && styles.genderButtonSelected]}
                onPress={() => setGender('Male')}
              >
                <Ionicons 
                  name="male" 
                  size={24} 
                  color={gender === 'Male' ? '#FFFFFF' : '#3A643B'} 
                />
                <Text style={[styles.genderButtonText, gender === 'Male' && styles.genderButtonTextSelected]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Female' && styles.genderButtonSelected]}
                onPress={() => setGender('Female')}
              >
                <Ionicons 
                  name="female" 
                  size={24} 
                  color={gender === 'Female' ? '#FFFFFF' : '#3A643B'} 
                />
                <Text style={[styles.genderButtonText, gender === 'Female' && styles.genderButtonTextSelected]}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Other' && styles.genderButtonSelected]}
                onPress={() => setGender('Other')}
              >
                <Ionicons 
                  name="transgender" 
                  size={24} 
                  color={gender === 'Other' ? '#FFFFFF' : '#3A643B'} 
                />
                <Text style={[styles.genderButtonText, gender === 'Other' && styles.genderButtonTextSelected]}>Other</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLabel}>Age (years)</Text>
            <TextInput
              style={styles.infoInput}
              placeholder="Enter your age"
              placeholderTextColor="#9CA3AF"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />

            <Text style={styles.formLabel}>Height (cm)</Text>
            <TextInput
              style={styles.infoInput}
              placeholder="Enter your height"
              placeholderTextColor="#9CA3AF"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />

            <Text style={styles.formLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.infoInput}
              placeholder="Enter your weight"
              placeholderTextColor="#9CA3AF"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && (
          <View style={styles.stepContent}>
            <View style={styles.confirmationCard}>
              <Text style={styles.confirmationTitle}>Appointment Details</Text>
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Date:</Text>
                <Text style={styles.confirmationValue}>{selectedDate && formatFullDate(selectedDate)}</Text>
              </View>
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Time:</Text>
                <Text style={styles.confirmationValue}>{selectedTime}</Text>
              </View>
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Consultation:</Text>
                <Text style={styles.confirmationValue}>{consultationType === 'phone' ? 'Phone' : 'Video'}</Text>
              </View>
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Concern:</Text>
                <Text style={styles.confirmationValue}>{concern}</Text>
              </View>
              
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Duration:</Text>
                <Text style={styles.confirmationValue}>{duration} {durationType}</Text>
              </View>
              
              <View style={[styles.confirmationRow, styles.priceRow]}>
                <Text style={styles.confirmationLabel}>Price:</Text>
                <Text style={styles.priceValue}>₹{price}/min</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleNext}>
          <Text style={styles.actionButtonText}>
            {currentStep === 1 ? 'Confirm Date' : 
             currentStep === 2 ? 'Confirm Appointment' :
             currentStep === 3 ? 'Proceed' :
             currentStep === 4 ? 'Continue' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Concern Dropdown Modal */}
      <Modal
        visible={showConcernDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConcernDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select Concern</Text>
              <TouchableOpacity onPress={() => setShowConcernDropdown(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dropdownList}>
              {concernOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownItem,
                    concern === option && styles.dropdownItemSelected
                  ]}
                  onPress={() => {
                    setConcern(option)
                    setShowConcernDropdown(false)
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    concern === option && styles.dropdownItemTextSelected
                  ]}>
                    {option}
                  </Text>
                  {concern === option && (
                    <Ionicons name="checkmark" size={20} color="#3A643B" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
export default BookingScreen

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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3A643B',
  },
  scrollView: {
    flex: 1,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
  },
  doctorInfo: {
    marginLeft: 16,
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#6B7280',
  },
  consultationInfo: {
    fontSize: 13,
    color: '#3A643B',
    marginTop: 4,
  },
  stepContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dateCard: {
    width: '22%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  dateCardSelected: {
    backgroundColor: '#3A643B',
    borderColor: '#3A643B',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  dayText: {
    fontSize: 12,
    color: '#6B7280',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  selectedDateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F1',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3A643B',
  },
  timeCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  timeSlotsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeSlot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  timeSlotSelected: {
    backgroundColor: '#3A643B',
    borderColor: '#3A643B',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#1F2937',
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
  },
  sliderContainer: {
    marginBottom: 8,
  },
  sliderTrack: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  sliderLabelActive: {
    color: '#3A643B',
    fontWeight: '600',
  },
  severityIndicator: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  severityBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  severityMild: {
    backgroundColor: '#DBEAFE',
  },
  severityModerate: {
    backgroundColor: '#FEF3C7',
  },
  severitySevere: {
    backgroundColor: '#FEE2E2',
  },
  severityBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  durationInputContainer: {
    marginBottom: 12,
  },
  durationInput: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 12,
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#3A643B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3A643B',
  },
  radioLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  summaryValue: {
    fontWeight: '600',
    color: '#1F2937',
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  genderButtonSelected: {
    backgroundColor: '#3A643B',
    borderColor: '#3A643B',
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  genderButtonTextSelected: {
    color: '#FFFFFF',
  },
  infoInput: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dropdownModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  dropdownList: {
    maxHeight: 400,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemSelected: {
    backgroundColor: '#F0F9F1',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#1F2937',
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: '#3A643B',
  },
  confirmationCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  confirmationLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  confirmationValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  priceRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A643B',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    backgroundColor: '#3A643B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})