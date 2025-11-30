import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import ZegoService from '../services/zego';

// Optional: Keep awake during calls
let useKeepAwake: any;
try {
  useKeepAwake = require('react-native-keep-awake').useKeepAwake;
} catch (error) {
  console.log('⚠️ react-native-keep-awake not available');
  useKeepAwake = () => {}; // No-op fallback
}
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useAudioRecorder, RecordingOptions, AudioModule, AndroidOutputFormat, AndroidAudioEncoder, AudioQuality } from 'expo-audio';
import { supabase } from '../services/supabase';
import { useCall } from '../context/CallContext';

const { width, height } = Dimensions.get('window');

interface VideoCallProps {
  appointment: {
    id: string;
    doctor_id?: string;
    customer_id?: string;
    doctorName?: string;
    patientName?: string;
    consultationType: 'phone' | 'video';
  };
  userRole: 'doctor' | 'customer';
}

type RouteParams = {
  VideoCall: VideoCallProps;
};

const VideoCallScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'VideoCall'>>();
  const navigation = useNavigation();
  const { appointment, userRole } = route.params;
  const { setCallState, callState, minimizeCall } = useCall();
  
  // Keep screen awake during call (if available)
  if (useKeepAwake && typeof useKeepAwake === 'function') {
    try {
      useKeepAwake();
    } catch (error) {
      // Keep awake not available
    }
  }

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(appointment.consultationType === 'phone');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const [isRecording, setIsRecording] = useState(false);
  const [remoteUserConnected, setRemoteUserConnected] = useState(false);
  const [remoteUserVideo, setRemoteUserVideo] = useState(false);
  const [remoteUserAudio, setRemoteUserAudio] = useState(false);
  const [userBalance, setUserBalance] = useState(1000); // Mock balance for demo
  
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  // Using minimal config to avoid enum casting errors
  const audioRecorder = useAudioRecorder({
    extension: '.m4a',
    sampleRate: 44100,
  } as any);
  const channelRef = useRef<any>(null);
  const balanceCheckInterval = useRef<NodeJS.Timeout | null>(null);

  const roomID = `appointment_${appointment.id}`;
  const userID = userRole === 'doctor' ? (appointment.doctor_id || `doctor_${Date.now()}`) : (appointment.customer_id || `customer_${Date.now()}`);
  const userName = userRole === 'doctor' ? (appointment.doctorName || 'Doctor') : (appointment.patientName || 'Patient');
  const streamID = `${roomID}_${userID}`;
  const remoteUserName = userRole === 'doctor' ? (appointment.patientName || 'Patient') : (appointment.doctorName || 'Doctor');

  useEffect(() => {
    requestPermissions();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasPermissions && isConnected) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [hasPermissions, isConnected]);

  // Update call context for minimized state
  useEffect(() => {
    if (isConnected) {
      setCallState({
        isMinimized: false,
        isActive: true,
        appointment,
        userRole,
        callDuration,
        isMuted,
        isVideoOff,
        remoteUserConnected,
        remoteUserName,
      });
    }
  }, [callDuration, isMuted, isVideoOff, remoteUserConnected, isConnected]);

  // Monitor balance during call (Customer only)
  useEffect(() => {
    if (userRole !== 'customer' || !isConnected || !remoteUserConnected) return;

    // Check balance every 10 seconds during active call
    balanceCheckInterval.current = setInterval(() => {
      // Simulate balance deduction (₹6.15 per minute = ~₹0.1025 per second)
      setUserBalance(prev => {
        const newBalance = prev - 1.025; // Deduct every 10 seconds
        
        // If balance is insufficient (less than ₹25), disconnect
        if (newBalance < 25) {
          console.log('⚠️ Insufficient balance, disconnecting call');
          handleInsufficientBalance();
          return 0;
        }
        
        return newBalance;
      });
    }, 10000); // Check every 10 seconds

    return () => {
      if (balanceCheckInterval.current) {
        clearInterval(balanceCheckInterval.current);
        balanceCheckInterval.current = null;
      }
    };
  }, [isConnected, remoteUserConnected, userRole]);

  const handleInsufficientBalance = async () => {
    try {
      if (balanceCheckInterval.current) {
        clearInterval(balanceCheckInterval.current);
        balanceCheckInterval.current = null;
      }
      
      await cleanup();
      
      // Navigate to different screens based on user role
      if (userRole === 'customer') {
        navigation.navigate('DisconnectedCallScreen' as never, {
          appointment,
          doctorName: appointment.doctorName || 'Doctor',
          callDuration,
        } as never);
      } else {
        navigation.navigate('PatientDisconnectedScreen' as never, {
          appointment,
          patientName: appointment.patientName || 'Patient',
          callDuration,
        } as never);
      }
    } catch (error) {
      console.error('Error handling insufficient balance:', error);
    }
  };

  // Check if doctor doesn't join within 5 minutes (Customer only)
  useEffect(() => {
    if (userRole !== 'customer' || !isConnected) return;

    const timeout = setTimeout(() => {
      if (!remoteUserConnected) {
        console.log('⏰ Doctor did not join within 5 minutes');
        cleanup();
        navigation.navigate('NotAnsweredCall' as never, {
          appointment,
          doctorName: appointment.doctorName || 'Doctor',
        } as never);
      }
    }, 1 * 60 * 1000); // 5 minutes

    return () => clearTimeout(timeout);
  }, [isConnected, remoteUserConnected, userRole]);

  // Check if patient doesn't join within 5 minutes (Doctor only)
  useEffect(() => {
    if (userRole !== 'doctor' || !isConnected) return;

    const timeout = setTimeout(() => {
      if (!remoteUserConnected) {
        console.log('⏰ Patient did not join within 5 minutes');
        cleanup();
        navigation.navigate('PatientNotAvailable' as never, {
          appointment,
          patientName: appointment.patientName || 'Patient',
        } as never);
      }
    }, 1 * 60 * 1000); // 5 minutes

    return () => clearTimeout(timeout);
  }, [isConnected, remoteUserConnected, userRole]);

  const requestPermissions = async () => {
    try {
      const camPermission = await requestCameraPermission();
      const audioPermission = await AudioModule.requestRecordingPermissionsAsync();
      
      if (camPermission?.granted && audioPermission.status === 'granted') {
        // Configure audio mode for recording
        await AudioModule.setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
        
        setHasPermissions(true);
        initCall();
      } else {
        Alert.alert('Permissions Required', 'Camera and microphone permissions are required for video calls.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Error', 'Failed to request permissions');
      navigation.goBack();
    }
  };

  const initCall = async () => {
    try {
      await ZegoService.initEngine();
      await ZegoService.loginRoom(roomID, userID, userName);
      await ZegoService.enableCamera(appointment.consultationType === 'video');
      await ZegoService.setAudioRouteToSpeaker(true);
      await ZegoService.startPublishingStream(streamID);
      
      // Start audio recording for microphone functionality
      if (!isMuted) {
        await startAudioRecording();
      }
      
      // Setup real-time channel for peer communication
      await setupRealtimeChannel();
      
      setIsConnected(true);
      console.log('✅ Call initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize call:', error);
      Alert.alert('Error', 'Failed to start call. Please try again.');
      navigation.goBack();
    }
  };

  const setupRealtimeChannel = async () => {
    try {
      // Create or join a channel for this room
      const channel = supabase.channel(`call:${roomID}`, {
        config: {
          broadcast: { self: true },
          presence: { key: userID },
        },
      });

      // Listen for user presence (joining/leaving)
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const users = Object.keys(state);
          const remoteUsers = users.filter(id => id !== userID);
          
          if (remoteUsers.length > 0) {
            setRemoteUserConnected(true);
            console.log(`👥 Remote user connected: ${remoteUsers[0]}`);
          } else {
            setRemoteUserConnected(false);
            console.log('👤 Waiting for remote user...');
          }
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          if (key !== userID) {
            setRemoteUserConnected(true);
            console.log(`✅ ${key} joined the call`);
          }
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          if (key !== userID) {
            setRemoteUserConnected(false);
            console.log(`❌ ${key} left the call`);
          }
        })
        // Listen for remote user's media state
        .on('broadcast', { event: 'media-state' }, ({ payload }) => {
          if (payload.userId !== userID) {
            setRemoteUserVideo(payload.video);
            setRemoteUserAudio(payload.audio);
            console.log(`📡 Remote media state: video=${payload.video}, audio=${payload.audio}`);
          }
        })
        // Listen for call end event
        .on('broadcast', { event: 'call-ended' }, ({ payload }) => {
          if (payload.userId !== userID) {
            console.log(`📞 Call ended by ${payload.endedBy}`);
            handleRemoteCallEnd();
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            // Track our presence
            await channel.track({
              user: userName,
              role: userRole,
              online_at: new Date().toISOString(),
            });
            
            // Broadcast our initial media state
            await channel.send({
              type: 'broadcast',
              event: 'media-state',
              payload: {
                userId: userID,
                video: appointment.consultationType === 'video' && !isVideoOff,
                audio: !isMuted,
              },
            });
            
            // Notify doctor when customer joins the call
            if (userRole === 'customer' && appointment.doctor_id) {
              const { callNotificationService } = await import('../services/callNotificationService');
              await callNotificationService.notifyDoctor(appointment.doctor_id, {
                roomId: roomID,
                appointmentId: appointment.id,
                patientId: userID,
                patientName: userName,
                concern: (appointment as any).concern || 'General consultation',
                consultationType: appointment.consultationType,
                appointment,
              });
              console.log('📞 Notified doctor of incoming call');
            }
            
            console.log('📡 Subscribed to call channel');
          }
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('Failed to setup realtime channel:', error);
    }
  };

  const broadcastMediaState = async () => {
    if (channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'media-state',
        payload: {
          userId: userID,
          video: appointment.consultationType === 'video' && !isVideoOff,
          audio: !isMuted,
        },
      });
    }
  };

  const handleRemoteCallEnd = async () => {
    try {
      if (balanceCheckInterval.current) {
        clearInterval(balanceCheckInterval.current);
        balanceCheckInterval.current = null;
      }
      
      await cleanup();
      
      if (userRole === 'customer') {
        navigation.navigate('CallEndedScreen' as never, {
          appointment,
          doctorName: appointment.doctorName || 'Doctor',
          callDuration,
          userRole,
        } as never);
      } else {
        navigation.navigate('CallEndedScreen' as never, {
          appointment,
          patientName: appointment.patientName || 'Patient',
          callDuration,
          userRole,
        } as never);
      }
    } catch (error) {
      console.error('Error handling remote call end:', error);
    }
  };

  const startAudioRecording = async () => {
    try {
      if (audioRecorder && typeof audioRecorder.record === 'function') {
        await audioRecorder.record();
        setIsRecording(true);
        console.log('🎤 Audio recording started');
      }
    } catch (error) {
      console.error('Failed to start audio recording:', error);
      setIsRecording(false);
    }
  };

  const stopAudioRecording = async () => {
    try {
      if (isRecording && audioRecorder) {
        await audioRecorder.stop();
        setIsRecording(false);
        console.log('🎤 Audio recording stopped');
      }
    } catch (error) {
      console.error('Failed to stop audio recording:', error);
    }
  };

  const cleanup = async () => {
    try {
      // Stop audio recording first
      if (isRecording) {
        try {
          await stopAudioRecording();
        } catch (audioError) {
          console.log('Audio cleanup warning:', audioError);
        }
      }
      
      // Unsubscribe from realtime channel
      if (channelRef.current) {
        try {
          await channelRef.current.untrack();
          await channelRef.current.unsubscribe();
          channelRef.current = null;
        } catch (channelError) {
          console.log('Channel cleanup warning:', channelError);
        }
      }
      
      await ZegoService.stopPublishingStream(streamID);
      await ZegoService.logoutRoom(roomID);
      await ZegoService.destroyEngine();
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  };

  const handleMinimize = () => {
    minimizeCall();
    navigation.goBack();
  };

  const handleEndCall = async () => {
    try {
      // Clear balance interval if exists
      if (balanceCheckInterval.current) {
        clearInterval(balanceCheckInterval.current);
        balanceCheckInterval.current = null;
      }
      
      // Broadcast call end to remote user
      if (channelRef.current) {
        await channelRef.current.send({
          type: 'broadcast',
          event: 'call-ended',
          payload: {
            userId: userID,
            endedBy: userName,
          },
        });
      }
      
      await cleanup();
      
      // Navigate to CallEndedScreen
      if (userRole === 'customer') {
        navigation.navigate('CallEndedScreen' as never, {
          appointment,
          doctorName: appointment.doctorName || 'Doctor',
          callDuration,
          userRole,
        } as never);
      } else {
        navigation.navigate('CallEndedScreen' as never, {
          appointment,
          patientName: appointment.patientName || 'Patient',
          callDuration,
          userRole,
        } as never);
      }
    } catch (error) {
      console.error('Error ending call:', error);
      navigation.goBack();
    }
  };

  const toggleMute = async () => {
    try {
      const newMutedState = !isMuted;
      
      if (newMutedState) {
        // Muting - stop recording
        await stopAudioRecording();
      } else {
        // Unmuting - start recording
        await startAudioRecording();
      }
      
      await ZegoService.muteMicrophone(newMutedState);
      setIsMuted(newMutedState);
      
      // Broadcast media state change
      await broadcastMediaState();
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  };

  const toggleVideo = async () => {
    if (appointment.consultationType === 'phone') {
      Alert.alert('Audio Call', 'Video is not available in audio-only calls');
      return;
    }
    try {
      await ZegoService.enableCamera(isVideoOff);
      setIsVideoOff(!isVideoOff);
      
      // Broadcast media state change
      await broadcastMediaState();
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  };

  const toggleSpeaker = async () => {
    try {
      const newSpeakerState = !isSpeakerOn;
      
      // Update audio mode
      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      
      await ZegoService.setAudioRouteToSpeaker(newSpeakerState);
      setIsSpeakerOn(newSpeakerState);
    } catch (error) {
      console.error('Failed to toggle speaker:', error);
    }
  };

  const switchCamera = () => {
    setFacing(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.minimizeButton} onPress={handleMinimize}>
          <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Video Views */}
      <View style={styles.videoContainer}>
        {appointment.consultationType === 'video' && hasPermissions && !isVideoOff ? (
          <View style={styles.cameraContainer}>
            {/* Local Video Preview - Full Screen */}
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
            />
            
            {/* Overlay Info - Positioned Absolutely */}
            <View style={styles.cameraOverlay}>
              <View style={styles.recordingIndicator}>
                <View style={[styles.recordingDot, isRecording && styles.recordingDotActive]} />
                <Text style={styles.recordingText}>
                  {isRecording ? '🎤 Recording' : '🎤 Mic Off'}
                </Text>
              </View>
              
              {remoteUserConnected ? (
                <View style={styles.remoteStatusContainer}>
                  <View style={styles.connectedBadge}>
                    <View style={styles.connectedDot} />
                    <Text style={styles.connectedText}>{remoteUserName} Connected</Text>
                  </View>
                  <View style={styles.remoteMediaStatus}>
                    <Ionicons 
                      name={remoteUserVideo ? 'videocam' : 'videocam-off'} 
                      size={16} 
                      color={remoteUserVideo ? '#10B981' : '#EF4444'} 
                    />
                    <Ionicons 
                      name={remoteUserAudio ? 'mic' : 'mic-off'} 
                      size={16} 
                      color={remoteUserAudio ? '#10B981' : '#EF4444'}
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                </View>
              ) : (
                <Text style={styles.remoteWaitingText}>
                  Waiting for {remoteUserName}...
                </Text>
              )}
              
              {/* Camera Switch Button */}
              <TouchableOpacity 
                style={styles.switchCameraButton}
                onPress={switchCamera}
              >
                <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.audioCallContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {remoteUserName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.remoteUserName}>{remoteUserName}</Text>
            <Text style={styles.callStatus}>
              {remoteUserConnected ? '✅ Connected' : isConnected ? 'Waiting...' : 'Connecting...'}
            </Text>
            {remoteUserConnected && (
              <View style={styles.remoteMediaStatusAudio}>
                <Ionicons 
                  name={remoteUserAudio ? 'mic' : 'mic-off'} 
                  size={20} 
                  color={remoteUserAudio ? '#10B981' : '#6B7280'}
                />
                <Text style={styles.remoteMediaText}>
                  {remoteUserAudio ? 'Speaking' : 'Muted'}
                </Text>
              </View>
            )}
            <View style={styles.audioIndicator}>
              <View style={[styles.recordingDot, isRecording && styles.recordingDotActive]} />
              <Text style={styles.audioStatusText}>
                {isRecording ? 'Microphone Active' : 'Microphone Muted'}
              </Text>
            </View>
            <Text style={styles.placeholderNote}>
              {appointment.consultationType === 'video' ? '📹 Video Off' : '📞 Audio Call'}
            </Text>
            <Text style={styles.placeholderSubtext}>
              Room: {roomID}
            </Text>
            <Text style={styles.userRoleText}>
              Connected as {userName}
            </Text>
          </View>
        )}
      </View>

      {/* User Name Label */}
      <View style={styles.nameContainer}>
        <Text style={styles.userName}>{remoteUserName}</Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <View style={styles.controls}>
          {/* Mute Button */}
          <TouchableOpacity
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={toggleMute}
          >
            <Ionicons
              name={isMuted ? 'mic-off' : 'mic'}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* Video Toggle Button */}
          {appointment.consultationType === 'video' && (
            <TouchableOpacity
              style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
              onPress={toggleVideo}
            >
              <Ionicons
                name={isVideoOff ? 'videocam-off' : 'videocam'}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}

          {/* Speaker Button */}
          <TouchableOpacity
            style={[styles.controlButton, !isSpeakerOn && styles.controlButtonActive]}
            onPress={toggleSpeaker}
          >
            <Ionicons
              name={isSpeakerOn ? 'volume-high' : 'volume-mute'}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <MaterialIcons name="call-end" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VideoCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  minimizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  callDuration: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    padding: 20,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6B7280',
    marginRight: 8,
  },
  recordingDotActive: {
    backgroundColor: '#EF4444',
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  remoteWaitingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },
  remoteStatusContainer: {
    marginTop: 'auto',
    marginBottom: 20,
    alignItems: 'center',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  connectedText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  remoteMediaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  remoteMediaStatusAudio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  remoteMediaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  switchCameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioCallContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
  },
  audioIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  audioStatusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5B976',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  remoteUserName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
  },
  callStatus: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 8,
  },
  nameContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  userName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  controlsContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#3A3A3C',
  },
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderNote: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 24,
    fontWeight: '500',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  userRoleText: {
    fontSize: 14,
    color: '#34D399',
    marginTop: 8,
    fontWeight: '500',
  },
});
