// src/services/supabaseAppointments.ts
import { supabase } from './supabase';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  concern: string;
  severity: string;
  duration: number;
  durationType: string;
  date: string;
  time: string;
  consultationType: 'phone' | 'video';
  price: number;
  paymentStatus: 'paid' | 'pending';
  status: 'booked' | 'completed' | 'cancelled';
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const SupabaseAppointmentsService = {
  // Save a new appointment
  async saveAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: appointment.doctorId,
          doctor_name: appointment.doctorName,
          patient_id: appointment.patientId,
          patient_name: appointment.patientName,
          concern: appointment.concern,
          severity: appointment.severity,
          duration: appointment.duration,
          duration_type: appointment.durationType,
          date: appointment.date,
          time: appointment.time,
          consultation_type: appointment.consultationType,
          price: appointment.price,
          payment_status: appointment.paymentStatus,
          status: appointment.status,
          gender: appointment.gender,
          age: appointment.age,
          height: appointment.height,
          weight: appointment.weight,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        doctorId: data.doctor_id,
        doctorName: data.doctor_name,
        patientId: data.patient_id,
        patientName: data.patient_name,
        concern: data.concern,
        severity: data.severity,
        duration: data.duration,
        durationType: data.duration_type,
        date: data.date,
        time: data.time,
        consultationType: data.consultation_type,
        price: data.price,
        paymentStatus: data.payment_status,
        status: data.status,
        gender: data.gender,
        age: data.age,
        height: data.height,
        weight: data.weight,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error saving appointment:', error);
      throw error;
    }
  },

  // Get appointments for a specific doctor
  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorId)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(apt => ({
        id: apt.id,
        doctorId: apt.doctor_id,
        doctorName: apt.doctor_name,
        patientId: apt.patient_id,
        patientName: apt.patient_name,
        concern: apt.concern,
        severity: apt.severity,
        duration: apt.duration,
        durationType: apt.duration_type,
        date: apt.date,
        time: apt.time,
        consultationType: apt.consultation_type,
        price: apt.price,
        paymentStatus: apt.payment_status,
        status: apt.status,
        gender: apt.gender,
        age: apt.age,
        height: apt.height,
        weight: apt.weight,
        createdAt: apt.created_at,
        updatedAt: apt.updated_at,
      })) || [];
    } catch (error) {
      console.error('Error getting appointments by doctor:', error);
      return [];
    }
  },

  // Get appointments for a specific patient
  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(apt => ({
        id: apt.id,
        doctorId: apt.doctor_id,
        doctorName: apt.doctor_name,
        patientId: apt.patient_id,
        patientName: apt.patient_name,
        concern: apt.concern,
        severity: apt.severity,
        duration: apt.duration,
        durationType: apt.duration_type,
        date: apt.date,
        time: apt.time,
        consultationType: apt.consultation_type,
        price: apt.price,
        paymentStatus: apt.payment_status,
        status: apt.status,
        gender: apt.gender,
        age: apt.age,
        height: apt.height,
        weight: apt.weight,
        createdAt: apt.created_at,
        updatedAt: apt.updated_at,
      })) || [];
    } catch (error) {
      console.error('Error getting appointments by patient:', error);
      return [];
    }
  },

  // Update appointment payment status
  async updatePaymentStatus(appointmentId: string, paymentStatus: 'paid' | 'pending'): Promise<void> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ payment_status: paymentStatus })
        .eq('id', appointmentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Update appointment status (booked, completed, cancelled)
  async updateAppointmentStatus(
    appointmentId: string,
    status: 'booked' | 'completed' | 'cancelled'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Filter appointments with multiple criteria
  async filterAppointments(
    doctorId: string,
    filters: {
      date?: string;
      consultationType?: 'phone' | 'video';
      paymentStatus?: 'paid' | 'pending';
    }
  ): Promise<Appointment[]> {
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorId)
        .neq('status', 'cancelled');

      if (filters.date) {
        query = query.eq('date', filters.date);
      }

      if (filters.consultationType) {
        query = query.eq('consultation_type', filters.consultationType);
      }

      if (filters.paymentStatus) {
        query = query.eq('payment_status', filters.paymentStatus);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(apt => ({
        id: apt.id,
        doctorId: apt.doctor_id,
        doctorName: apt.doctor_name,
        patientId: apt.patient_id,
        patientName: apt.patient_name,
        concern: apt.concern,
        severity: apt.severity,
        duration: apt.duration,
        durationType: apt.duration_type,
        date: apt.date,
        time: apt.time,
        consultationType: apt.consultation_type,
        price: apt.price,
        paymentStatus: apt.payment_status,
        status: apt.status,
        gender: apt.gender,
        age: apt.age,
        height: apt.height,
        weight: apt.weight,
        createdAt: apt.created_at,
        updatedAt: apt.updated_at,
      })) || [];
    } catch (error) {
      console.error('Error filtering appointments:', error);
      return [];
    }
  },

  // Subscribe to real-time appointment changes for a doctor
  subscribeToAppointments(doctorId: string, callback: (appointments: Appointment[]) => void) {
    const subscription = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `doctor_id=eq.${doctorId}`,
        },
        async (payload) => {
          console.log('Appointment change detected:', payload);
          // Reload appointments when changes occur
          const appointments = await this.getAppointmentsByDoctor(doctorId);
          callback(appointments);
        }
      )
      .subscribe();

    return subscription;
  },

  // Unsubscribe from real-time updates
  unsubscribe(subscription: any) {
    supabase.removeChannel(subscription);
  },
};
