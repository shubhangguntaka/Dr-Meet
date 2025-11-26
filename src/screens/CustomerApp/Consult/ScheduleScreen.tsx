import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/CustomerAppNavigator'
import { User } from '../../../authentication/types'

type ScheduleScreenRouteProp = RouteProp<RootStackParamList, 'Schedule'>
type ScheduleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Schedule'>

type ConsultationType = 'phone' | 'video' | 'chat'

const ScheduleScreen = () => {
  const route = useRoute<ScheduleScreenRouteProp>()
  const navigation = useNavigation<ScheduleScreenNavigationProp>()
  const { doctor } = route.params
  
  const [selectedType, setSelectedType] = useState<ConsultationType>('video')

  const handleProceed = () => {
    if (selectedType === 'chat') {
      Alert.alert('Coming Soon', 'Chat consultation feature is coming soon!', [
        { text: 'OK', style: 'default' }
      ])
      return
    }
    
    navigation.navigate('Booking', { 
      doctor, 
      consultationType: selectedType,
      price: selectedType === 'phone' ? doctor.pricePerMin || 15 : (doctor.pricePerMin || 15) + 20
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Consultation</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Doctor Info Card */}
        <View style={styles.doctorCard}>
          <Image 
            source={{ uri: doctor.profileImage || 'https://via.placeholder.com/60x60' }}
            style={styles.doctorImage}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          </View>
        </View>

        {/* Consultation Options */}
        <View style={styles.consultationOptions}>
          {/* Phone Consultation */}
          <TouchableOpacity 
            style={[
              styles.consultationCard,
              selectedType === 'phone' && styles.consultationCardSelected
            ]}
            onPress={() => setSelectedType('phone')}
          >
            <Text style={styles.consultationType}>Phone Consultation</Text>
            <Text style={styles.consultationPrice}>₹ {doctor.pricePerMin || 15}/min</Text>
            <Text style={styles.consultationDuration}>({(doctor.freeMinutes || 5) + 15}min)</Text>
            <View style={[
              styles.radioButton,
              selectedType === 'phone' && styles.radioButtonSelected
            ]}>
              {selectedType === 'phone' && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>

          {/* Video Consultation */}
          <TouchableOpacity 
            style={[
              styles.consultationCard,
              selectedType === 'video' && styles.consultationCardSelected
            ]}
            onPress={() => setSelectedType('video')}
          >
            <Text style={styles.consultationType}>Video Consultation</Text>
            <Text style={styles.consultationPrice}>₹ {(doctor.pricePerMin || 15) + 20}/min</Text>
            <Text style={styles.consultationDuration}>({(doctor.freeMinutes || 5) + 25}min)</Text>
            <View style={[
              styles.radioButton,
              selectedType === 'video' && styles.radioButtonSelected
            ]}>
              {selectedType === 'video' && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>

          {/* Chat Consultation */}
          <TouchableOpacity 
            style={[
              styles.consultationCard,
              styles.consultationCardWide,
              selectedType === 'chat' && styles.consultationCardSelected
            ]}
            onPress={() => setSelectedType('chat')}
          >
            <Text style={styles.consultationType}>Chat Consultation</Text>
            <Text style={styles.consultationPrice}>₹ 50</Text>
            <Text style={styles.consultationSubtext}>(30 conversation texts)</Text>
            <Text style={styles.consultationValidity}>Valid: 72 hours</Text>
            <View style={[
              styles.radioButton,
              selectedType === 'chat' && styles.radioButtonSelected
            ]}>
              {selectedType === 'chat' && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Proceed Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.proceedButton,
            selectedType === 'chat' && styles.proceedButtonDisabled
          ]}
          onPress={handleProceed}
        >
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ScheduleScreen

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
  consultationOptions: {
    padding: 16,
    gap: 16,
  },
  consultationCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  consultationCardSelected: {
    borderColor: '#3A643B',
    backgroundColor: '#F0F9F1',
  },
  consultationCardWide: {
    // Full width card for chat option
  },
  consultationType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  consultationPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  consultationDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  consultationSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  consultationValidity: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  radioButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#3A643B',
    backgroundColor: '#FFFFFF',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3A643B',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  proceedButton: {
    backgroundColor: '#3A643B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  proceedButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
})