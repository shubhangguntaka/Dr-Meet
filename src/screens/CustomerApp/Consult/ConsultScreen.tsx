import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/CustomerAppNavigator';

type ConsultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface Concern {
  id: string;
  name: string;
  icon: string;
  iconSet: 'Ionicons' | 'MaterialCommunityIcons';
}

const concerns: Concern[] = [
  { id: '1', name: 'Hypertension', icon: 'heart-pulse', iconSet: 'MaterialCommunityIcons' },
  { id: '2', name: 'Anxiety', icon: 'chatbubble-ellipses-outline', iconSet: 'Ionicons' },
  { id: '3', name: 'Obesity', icon: 'person-outline', iconSet: 'Ionicons' },
  { id: '4', name: 'Diabetes', icon: 'water-outline', iconSet: 'Ionicons' },
  { id: '5', name: 'Sex', icon: 'person-outline', iconSet: 'Ionicons' },
  { id: '6', name: 'Rubella', icon: 'medical-outline', iconSet: 'Ionicons' },
  { id: '7', name: 'Hypothermia', icon: 'thermometer-outline', iconSet: 'Ionicons' },
  { id: '8', name: 'Frostbite', icon: 'snow-outline', iconSet: 'Ionicons' },
  { id: '9', name: 'Anxiety', icon: 'fitness-outline', iconSet: 'Ionicons' },
  { id: '10', name: 'Joint Pain', icon: 'hand-left-outline', iconSet: 'Ionicons' },
];

const ConsultScreen = () => {
  const navigation = useNavigation<ConsultScreenNavigationProp>();
  const [selectedConcern, setSelectedConcern] = React.useState<string | null>(null);

  const handleConcernPress = (concern: Concern) => {
    setSelectedConcern(concern.id);
    navigation.navigate('DoctorsList', { concernName: concern.name });
  };

  const renderIcon = (concern: Concern, size: number, color: string) => {
    if (concern.iconSet === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={concern.icon as any} size={size} color={color} />;
    }
    return <Ionicons name={concern.icon as any} size={size} color={color} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Top Concerns Label */}
        <Text style={styles.sectionLabel}>Top Concerns</Text>

        {/* Concerns Grid */}
        <View style={styles.concernsGrid}>
          {concerns.map((concern, index) => (
            <TouchableOpacity
              key={concern.id}
              style={[
                styles.concernItem,
                selectedConcern === concern.id && styles.concernItemSelected,
              ]}
              onPress={() => handleConcernPress(concern)}
            >
              <View style={styles.iconContainer}>
                {renderIcon(concern, 32, '#3A643B')}
              </View>
              <Text style={styles.concernName}>{concern.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView >
  );
};

export default ConsultScreen;

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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  scrollContent: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 16,
  },
  concernsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  concernItem: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  concernItemSelected: {
    borderColor: '#3A643B',
    borderWidth: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  concernName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});