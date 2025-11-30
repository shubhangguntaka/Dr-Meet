// src/services/callNotificationService.ts
import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface IncomingCallData {
  roomId: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  concern: string;
  consultationType: 'phone' | 'video';
  appointment: any;
}

type CallNotificationCallback = (callData: IncomingCallData) => void;

class CallNotificationService {
  private channel: RealtimeChannel | null = null;
  private callbacks: Map<string, CallNotificationCallback> = new Map();

  /**
   * Start listening for incoming calls for a specific doctor
   */
  startListening(doctorId: string, callback: CallNotificationCallback): string {
    const callbackId = `callback_${Date.now()}`;
    this.callbacks.set(callbackId, callback);

    if (!this.channel) {
      // Create a channel to listen for incoming calls
      this.channel = supabase.channel(`doctor_calls:${doctorId}`, {
        config: {
          broadcast: { self: false },
          presence: { key: doctorId },
        },
      });

      // Listen for incoming call broadcasts
      this.channel
        .on('broadcast', { event: 'incoming_call' }, (payload) => {
          console.log('📞 Incoming call notification:', payload);
          const callData = payload.payload as IncomingCallData;
          
          // Notify all registered callbacks
          this.callbacks.forEach(cb => cb(callData));
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Listening for incoming calls');
          }
        });
    }

    return callbackId;
  }

  /**
   * Stop listening for a specific callback
   */
  stopListening(callbackId: string) {
    this.callbacks.delete(callbackId);
    
    // If no more callbacks, cleanup the channel
    if (this.callbacks.size === 0 && this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
      console.log('🔇 Stopped listening for incoming calls');
    }
  }

  /**
   * Notify doctor about an incoming call
   */
  async notifyDoctor(doctorId: string, callData: IncomingCallData): Promise<void> {
    try {
      const channel = supabase.channel(`doctor_calls:${doctorId}`);
      
      await channel.subscribe();
      
      await channel.send({
        type: 'broadcast',
        event: 'incoming_call',
        payload: callData,
      });

      console.log('📡 Sent incoming call notification to doctor:', doctorId);
      
      // Cleanup
      await channel.unsubscribe();
    } catch (error) {
      console.error('❌ Failed to notify doctor:', error);
    }
  }

  /**
   * Cleanup all listeners
   */
  cleanup() {
    this.callbacks.clear();
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
  }
}

export const callNotificationService = new CallNotificationService();
