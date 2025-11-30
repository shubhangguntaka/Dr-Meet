// src/components/DeviceInfoCard.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deviceInfoService } from '../services/deviceInfoService';

const DeviceInfoCard: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  const loadDeviceInfo = async () => {
    const info = deviceInfoService.getDeviceInfo();
    setDeviceInfo(info);
  };

  if (!deviceInfo) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="phone-portrait-outline" size={24} color="#3A643B" />
          <Text style={styles.headerTitle}>Device Information</Text>
        </View>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#6B7280" 
        />
      </TouchableOpacity>

      {expanded && (
        <ScrollView style={styles.content}>
          <InfoRow label="Device" value={`${deviceInfo.brand} ${deviceInfo.model}`} />
          <InfoRow label="Device Name" value={deviceInfo.deviceName} />
          <InfoRow label="System" value={`${deviceInfo.systemName} ${deviceInfo.systemVersion}`} />
          <InfoRow label="App Version" value={`${deviceInfo.appVersion} (${deviceInfo.buildNumber})`} />
          <InfoRow label="Device Type" value={deviceInfo.isTablet ? 'Tablet' : 'Phone'} />
          <InfoRow label="Has Notch" value={deviceInfo.hasNotch ? 'Yes' : 'No'} />
          <InfoRow label="Battery Level" value={`${Math.round(deviceInfo.batteryLevel * 100)}%`} />
          <InfoRow label="Charging" value={deviceInfo.isCharging ? 'Yes' : 'No'} />
          <InfoRow label="Carrier" value={deviceInfo.carrier || 'N/A'} />
          <InfoRow label="Device ID" value={deviceInfo.deviceId} />
        </ScrollView>
      )}
    </View>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    maxHeight: 400,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
});

export default DeviceInfoCard;
