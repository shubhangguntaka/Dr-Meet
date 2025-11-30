# Incoming Call Notification System - Implementation Guide

## Overview
Successfully implemented a real-time incoming call notification system that shows a popup in DoctorApp when a customer joins a call and is waiting.

## Components Created

### 1. IncomingCallScreen Component
**Location:** `src/screens/DoctorApp/CallScreens/IncomingCallScreen.tsx`

**Purpose:** Modal popup UI that appears when a customer joins a call

**Features:**
- Semi-transparent modal overlay
- Patient avatar with animated pulse rings
- Displays patient name and concern
- Shows consultation type (video/phone)
- Accept button (green circular with phone icon)
- Decline button (red circular with X icon)
- Centered responsive design

**Props:**
```typescript
interface IncomingCallScreenProps {
  visible: boolean;
  patientName: string;
  concern: string;
  appointment: any;
  onAccept: () => void;
  onDecline: () => void;
}
```

### 2. CallNotificationService
**Location:** `src/services/callNotificationService.ts`

**Purpose:** Manage real-time call notifications using Supabase broadcast channels

**Key Methods:**
- `startListening(doctorId, callback)` - Subscribe to incoming calls for a specific doctor
- `stopListening(callbackId)` - Unsubscribe from notifications
- `notifyDoctor(doctorId, callData)` - Send notification to doctor when customer joins
- `cleanup()` - Clean up all active listeners

**Channel Pattern:** `doctor_calls:${doctorId}`

**Data Interface:**
```typescript
export interface IncomingCallData {
  roomId: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  concern: string;
  consultationType: 'phone' | 'video';
  appointment: any;
}
```

### 3. IncomingCallListener Component
**Location:** `src/components/IncomingCallListener.tsx`

**Purpose:** Global listener wrapper that monitors for incoming calls and displays the modal

**Features:**
- Wraps navigator to provide global coverage
- Automatically starts listening when doctor logs in
- Shows IncomingCallScreen when notification received
- Handles Accept: navigates to VideoCall screen
- Handles Decline: closes modal and clears notification
- Auto-cleanup on unmount

## Integration Points

### DoctorAppNavigator
**Location:** `src/navigation/DoctorAppNavigator.tsx`

**Changes:**
1. Imported IncomingCallListener component
2. Wrapped MainNavigator and MinimizedCallWindow with IncomingCallListener
3. This enables global incoming call detection throughout the app

```typescript
export default function DoctorAppNavigator() {
  return (
    <CallProvider>
      <NavigationContainer>
        <IncomingCallListener>
          <MainNavigator />
          <MinimizedCallWindow />
        </IncomingCallListener>
      </NavigationContainer>
    </CallProvider>
  );
}
```

### VideoCallScreen
**Location:** `src/screens/VideoCallScreen.tsx`

**Changes:**
Added notification trigger when customer joins the call (inside `setupRealtimeChannel` method):

```typescript
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
```

## How It Works

### Flow Diagram
```
Customer starts call
    ↓
Customer joins VideoCallScreen
    ↓
VideoCallScreen subscribes to Supabase presence channel
    ↓
Customer's presence is tracked
    ↓
System detects userRole = 'customer'
    ↓
callNotificationService.notifyDoctor() is called
    ↓
Notification sent via Supabase broadcast to doctor_calls:{doctorId}
    ↓
IncomingCallListener (in DoctorApp) receives notification
    ↓
IncomingCallScreen modal appears for doctor
    ↓
Doctor clicks Accept or Decline
    ↓
Accept: Navigate to VideoCall with appointment
Decline: Close modal, optionally notify customer
```

### Technical Details

**Supabase Channels Used:**
1. `call:{roomID}` - Main call presence and media state channel
2. `doctor_calls:{doctorId}` - Doctor-specific incoming call notifications

**Real-time Events:**
- Presence tracking for join/leave detection
- Broadcast for media state (audio/video on/off)
- Broadcast for incoming call notifications

**Lifecycle:**
1. **CustomerApp:** Joins call → Notifies doctor immediately
2. **DoctorApp:** Listener active when logged in → Shows modal on notification
3. **Accept:** Doctor joins same VideoCallScreen with same appointment
4. **Decline:** Modal closes, customer still waiting (can add decline message)

## Testing Checklist

- [ ] Customer starts call from ConsultScreen or AppointmentScreen
- [ ] DoctorApp shows IncomingCallScreen modal within 1-2 seconds
- [ ] Modal displays correct patient name and concern
- [ ] Accept button navigates doctor to VideoCallScreen
- [ ] Both users can see and communicate with each other
- [ ] Decline button closes modal without joining
- [ ] Modal auto-dismisses if customer leaves before doctor accepts
- [ ] Works for both phone and video consultations
- [ ] No duplicate modals appear
- [ ] Cleanup happens properly on logout

## Notes

- The notification is sent only once when customer joins
- Doctor can see the modal even if they're on a different screen
- The modal is always on top due to React Native Modal component
- Uses existing appointment data, no additional database queries needed
- Respects existing call timeout logic (5 minutes)
- Compatible with minimize/PiP functionality

## Future Enhancements

1. Add ringtone/sound when notification arrives
2. Add vibration for incoming calls
3. Send decline message back to customer
4. Add "Call Missed" notification if doctor doesn't respond
5. Add call history for missed calls
6. Support multiple simultaneous incoming calls (call queue)
7. Add caller ID preview before accepting

## Dependencies

- `expo-audio` - For future ringtone support
- `@supabase/supabase-js` - Real-time broadcast channels
- `@react-navigation/native` - Navigation handling
- React Context API - CallContext for call state management

## Related Files

- VideoCallScreen.tsx - Main call screen
- CallContext.tsx - Call state management
- MinimizedCallWindow.tsx - PiP functionality
- DoctorAppNavigator.tsx - Navigation setup
- AuthContext.tsx - User authentication and role detection
