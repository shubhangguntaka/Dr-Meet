// src/components/AppHeader.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../authentication/AuthContext';
import { useNavigation } from '@react-navigation/native';

interface AppHeaderProps {
  onProfilePress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onProfilePress }) => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate('Profile');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.username}>{user?.name || 'Guest'}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.profileButton} 
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <View style={styles.profileIconContainer}>
          <Ionicons name="person" size={24} color="#3A643B" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
  },
  profileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3A643B',
  },
});
