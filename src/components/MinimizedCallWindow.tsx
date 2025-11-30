import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCall } from '../context/CallContext';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const WINDOW_WIDTH = 140;
const WINDOW_HEIGHT = 180;

const MinimizedCallWindow = () => {
  const { callState, maximizeCall, endMinimizedCall } = useCall();
  const navigation = useNavigation();
  
  const pan = useRef(
    new Animated.ValueXY({
      x: SCREEN_WIDTH - WINDOW_WIDTH - 20,
      y: SCREEN_HEIGHT / 2 - WINDOW_HEIGHT / 2,
    })
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        
        // Snap to edges
        const finalX = (pan.x as any)._value + gesture.dx;
        const finalY = (pan.y as any)._value + gesture.dy;
        
        let snapX = finalX;
        let snapY = finalY;
        
        // Snap to left or right edge
        if (finalX < SCREEN_WIDTH / 2) {
          snapX = 20;
        } else {
          snapX = SCREEN_WIDTH - WINDOW_WIDTH - 20;
        }
        
        // Keep within vertical bounds
        if (finalY < 60) snapY = 60;
        if (finalY > SCREEN_HEIGHT - WINDOW_HEIGHT - 100) {
          snapY = SCREEN_HEIGHT - WINDOW_HEIGHT - 100;
        }
        
        Animated.spring(pan, {
          toValue: { x: snapX, y: snapY },
          useNativeDriver: false,
          friction: 7,
        }).start();
      },
    })
  ).current;

  const handleMaximize = () => {
    maximizeCall();
    navigation.navigate('VideoCall' as never, {
      appointment: callState?.appointment,
      userRole: callState?.userRole,
    } as never);
  };

  const handleEndCall = () => {
    endMinimizedCall();
    navigation.navigate('CallEndedScreen' as never, {
      appointment: callState?.appointment,
      doctorName: callState?.remoteUserName || 'Doctor',
      callDuration: callState?.callDuration || 0,
      userRole: callState?.userRole || 'customer',
    } as never);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!callState || !callState.isMinimized) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.windowContent}
        onPress={handleMaximize}
        activeOpacity={0.9}
      >
        {/* Header Note */}
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={12} color="#FFFFFF" />
          <Text style={styles.noteText}>Note</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {callState.remoteUserName?.charAt(0).toUpperCase() || 'D'}
            </Text>
          </View>
          {callState.remoteUserConnected && (
            <View style={styles.connectedIndicator} />
          )}
        </View>

        {/* Doctor Name */}
        <Text style={styles.doctorName} numberOfLines={1}>
          {callState.remoteUserName || 'Doctor'}
        </Text>

        {/* Call Duration */}
        <View style={styles.durationContainer}>
          <View style={styles.pulseDot} />
          <Text style={styles.duration}>{formatDuration(callState.callDuration)}</Text>
        </View>

        {/* Status Icons */}
        <View style={styles.statusIcons}>
          {callState.isMuted && (
            <View style={styles.iconBadge}>
              <Ionicons name="mic-off" size={12} color="#FFFFFF" />
            </View>
          )}
          {callState.isVideoOff && (
            <View style={styles.iconBadge}>
              <Ionicons name="videocam-off" size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* End Call Button */}
      <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
        <Ionicons name="call" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default MinimizedCallWindow;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    zIndex: 9999,
    elevation: 10,
  },
  windowContent: {
    flex: 1,
    backgroundColor: '#2D5F30',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  noteContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  noteText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5B976',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  connectedIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  duration: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 4,
    borderRadius: 8,
  },
  endCallButton: {
    position: 'absolute',
    bottom: -16,
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
