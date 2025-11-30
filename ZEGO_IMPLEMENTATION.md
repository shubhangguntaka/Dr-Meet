# ZegoCloud Video/Audio Calling Implementation

## Overview
Video and audio calling has been integrated into the Dr-Meet app using ZegoCloud SDK for real-time communication between doctors and patients.

## Features Implemented

### 1. Video Call Screen
- **File**: `src/screens/VideoCallScreen.tsx`
- Full-screen video calling interface
- Local video preview (small overlay)
- Remote video (full screen)
- Audio-only mode support
- Control buttons: Mute, Video toggle, Speaker, End Call
- Camera switching (front/back)
- Call duration timer
- Connection status indicators

### 2. ZegoCloud Service
- **File**: `src/services/zego.ts`
- Singleton service for managing ZegoCloud engine
- **Credentials**:
  - App ID: `1184811620`
  - App Sign: `4e5d981a0cb8493a35939b852c3dd04e6c4b565b2282945b84078a9e1f116074`

**Methods**:
- `initEngine()`: Initialize ZegoCloud engine
- `loginRoom(roomID, userID, userName)`: Join a call room
- `startPublishingStream(streamID, enableVideo)`: Start broadcasting
- `startPlayingStream(streamID, viewTag)`: Play remote stream
- `stopPublishingStream()`: Stop broadcasting
- `stopPlayingStream(streamID)`: Stop playing remote stream
- `logoutRoom(roomID)`: Leave the call room
- `muteAudio(mute)`: Mute/unmute microphone
- `muteVideo(mute)`: Enable/disable camera
- `switchCamera()`: Switch between front/back camera
- `enableSpeaker(enable)`: Toggle speaker mode
- `destroyEngine()`: Clean up resources

### 3. Navigation Integration

#### Customer App
- **File**: `src/navigation/CustomerAppNavigator.tsx`
- Added `VideoCall` route with params:
  - `appointment`: Appointment object
  - `userRole`: 'customer'

#### Doctor App
- **File**: `src/navigation/DoctorAppNavigator.tsx`
- Added `VideoCall` route with params:
  - `appointment`: Appointment object
  - `userRole`: 'doctor'

### 4. Call Triggers

#### Customer Side
- **File**: `src/screens/CustomerApp/Profile/ShowAppointmentsScreen.tsx`
- "Start Call" button in appointment list
- Disclaimer modal before starting call
- `handleProceedCall()` navigates to VideoCall screen

#### Doctor Side
- **File**: `src/screens/DoctorApp/Appointment/AppointmentDetailsScreen.tsx`
- "Start Video Call" / "Start Audio Call" button at bottom
- Direct navigation to VideoCall screen

## Room ID Format
- Room ID: `appointment_{appointmentId}`
- User ID: `doctor` or `patient`
- User Name: From appointment data (doctorName/patientName)

## UI Features

### Video Call Mode
- Remote video fills entire screen
- Local video in top-right corner (120x160px)
- Camera switch button on local video
- Control buttons at bottom

### Audio Call Mode
- Avatar placeholder with user initial
- User name display
- Connection status text
- Same control buttons (video toggle disabled)

### Control Buttons
1. **Mute Button**: Toggle microphone on/off
2. **Video Button**: Toggle camera on/off (video calls only)
3. **Speaker Button**: Toggle speaker/earpiece
4. **End Call Button**: Red button to end call and return

## Call Flow

1. User clicks "Start Call" button
2. Disclaimer modal appears (customer side)
3. User proceeds to VideoCall screen
4. ZegoService initializes engine
5. User logs into room with appointment-based room ID
6. Local stream starts publishing
7. Remote stream automatically plays when other user joins
8. Control buttons manage audio/video/speaker
9. End call logs out of room and stops all streams

## Dependencies
- `zego-express-engine-reactnative`: ZegoCloud SDK
- `@react-navigation/native`: Navigation
- `@expo/vector-icons`: UI icons
- `react-native-safe-area-context`: Safe area handling

## Testing

### Test Scenario 1: Video Call
1. Customer logs in and views appointments
2. Click "Start Call" on video consultation
3. Accept disclaimer
4. Wait for doctor to join
5. Test mute, video, speaker, camera switch
6. End call

### Test Scenario 2: Audio Call
1. Doctor opens appointment details (phone consultation)
2. Click "Start Audio Call"
3. Wait for patient to join
4. Test mute and speaker controls
5. End call

### Test Scenario 3: Multi-device
1. Login as customer on device 1
2. Login as doctor on device 2
3. Start call from either side
4. Both should see/hear each other
5. Test all controls on both devices

## Known Limitations
- Token-based authentication not implemented (using empty token for testing)
- No push notifications for incoming calls
- No call history tracking
- No call recording feature
- Room capacity limited to 2 users (doctor + patient)

## Future Enhancements
- Token-based room authentication
- Call invitation/notification system
- Call history and duration tracking
- Screen sharing capability
- Call recording with patient consent
- Network quality indicators
- Automatic reconnection on network issues
- Prescription sharing during call
- Medical report viewing during call

## Troubleshooting

### Issue: Can't see remote video
- Ensure both users have joined the same room ID
- Check network connectivity
- Verify camera/microphone permissions

### Issue: No audio
- Check microphone permissions on both devices
- Verify speaker mode is enabled
- Ensure neither user is muted

### Issue: Call not connecting
- Verify ZegoCloud credentials are correct
- Check console logs for errors
- Ensure room ID is identical for both users

### Issue: Black screen in video call
- Check camera permissions
- Verify enableVideo is true for video calls
- Restart app and try again

## Support
For ZegoCloud-specific issues, refer to:
- [ZegoCloud Console](https://console.zegocloud.com)
- [React Native SDK Documentation](https://docs.zegocloud.com/en/7637.html)
- [API Reference](https://docs.zegocloud.com/article/api?doc=express-video-sdk_API~ReactNative~API)
