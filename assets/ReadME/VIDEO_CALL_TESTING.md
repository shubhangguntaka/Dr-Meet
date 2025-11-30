# Quick Testing Guide for Video/Audio Calls

## Prerequisites
- Two devices (or emulators) running the app
- One logged in as doctor (doctor@gmail.com / Doctor@123)
- One logged in as customer (patient@gmail.com / Patient@123)
- Active appointment between them

## Test 1: Video Call from Customer Side

### Steps:
1. **Customer Device**:
   - Go to Profile → My Appointments
   - Find an appointment with consultationType = "video"
   - Tap "Start Call" button
   - Read and accept the disclaimer modal
   - Should navigate to VideoCallScreen

2. **Doctor Device**:
   - Go to Appointments tab
   - Tap on the same appointment
   - Tap "Start Video Call" button at bottom
   - Should navigate to VideoCallScreen

3. **Both Devices**:
   - Should see each other's video
   - Test mute button (microphone icon)
   - Test video toggle (camera icon)
   - Test speaker button (volume icon)
   - Test camera switch (on local video)
   - Check call duration timer
   - Tap red "End Call" button

### Expected Results:
- ✅ Both users see each other's video in real-time
- ✅ Local video shows in top-right corner
- ✅ Remote video fills the screen
- ✅ Mute button mutes microphone
- ✅ Video button turns camera on/off
- ✅ Speaker button toggles speaker/earpiece
- ✅ Camera switch changes front/back camera
- ✅ Duration timer increments every second
- ✅ End call returns to previous screen

## Test 2: Audio Call from Doctor Side

### Steps:
1. **Doctor Device**:
   - Open appointment with consultationType = "phone"
   - Tap "Start Audio Call" button
   - Should show audio-only interface (avatar + controls)

2. **Customer Device**:
   - Navigate to the same appointment
   - Tap "Start Call"
   - Accept disclaimer
   - Should show audio-only interface

3. **Both Devices**:
   - Should hear each other's audio
   - Avatar should display user's initial
   - Test mute button
   - Test speaker button
   - Video toggle should be disabled or hidden
   - Tap "End Call"

### Expected Results:
- ✅ Both users hear each other clearly
- ✅ Avatar shows first letter of name
- ✅ Connection status shows "Connected"
- ✅ Mute works properly
- ✅ Speaker toggle works
- ✅ No video streams (audio only)
- ✅ End call works correctly

## Common Issues & Solutions

### Issue: "Can't see remote video"
**Solution**: 
- Ensure both devices are using the SAME appointment ID
- Check room ID in console logs (should be identical)
- Verify network connectivity

### Issue: "Black screen on video"
**Solution**:
- Check camera permissions in device settings
- Try switching camera
- Restart the app

### Issue: "No audio heard"
**Solution**:
- Check microphone permissions
- Ensure speaker is enabled (not earpiece)
- Verify neither user is muted
- Check device volume

### Issue: "Call not connecting"
**Solution**:
- Verify ZegoCloud credentials in `src/services/zego.ts`
- Check console logs for initialization errors
- Ensure both users are logged into same room ID

## Debug Checklist

Before reporting issues, check:
- [ ] Console logs for errors
- [ ] Network connectivity on both devices
- [ ] Camera/microphone permissions granted
- [ ] Same appointment ID used on both devices
- [ ] ZegoCloud credentials are correct
- [ ] App is rebuilt after code changes

## Console Logs to Look For

### Success Messages:
```
ZegoCloud Engine initialized successfully
Logged into room: appointment_123
Started publishing stream: appointment_123_doctor
Started playing stream: appointment_123_patient
```

### Error Messages:
```
Failed to initialize ZegoCloud Engine
Failed to login room
Failed to publish stream
Failed to play stream
```
