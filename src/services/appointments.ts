import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientId: string;
  concern: string;
  severity: string;
  duration: string;
  durationType: string;
  date: string;
  time: string;
  consultationType: 'phone' | 'video';
  price: number;
  paymentStatus: 'paid' | 'pending';
  status: 'booked' | 'completed' | 'cancelled';
  callCompleted?: boolean;
  gender: string;
  age: string;
  height: string;
  weight: string;
  createdAt: string;
}

const APPOINTMENTS_KEY = '@dr_meet_appointments';

export const AppointmentsService = {
  // Get all appointments
  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const appointmentsJson = await AsyncStorage.getItem(APPOINTMENTS_KEY);
      return appointmentsJson ? JSON.parse(appointmentsJson) : [];
    } catch (error) {
      console.error('Error getting appointments:', error);
      return [];
    }
  },

  // Save a new appointment
  async saveAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<Appointment> {
    try {
      const appointments = await this.getAllAppointments();
      
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        status: 'booked',
        createdAt: new Date().toISOString(),
      };

      appointments.push(newAppointment);
      await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
      
      return newAppointment;
    } catch (error) {
      console.error('Error saving appointment:', error);
      throw error;
    }
  },

  // Update appointment payment status
  async updatePaymentStatus(appointmentId: string, paymentStatus: 'paid' | 'pending'): Promise<void> {
    try {
      const appointments = await this.getAllAppointments();
      const index = appointments.findIndex(a => a.id === appointmentId);
      
      if (index !== -1) {
        appointments[index].paymentStatus = paymentStatus;
        await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Update appointment status
  async updateAppointmentStatus(appointmentId: string, status: 'booked' | 'completed' | 'cancelled'): Promise<void> {
    try {
      const appointments = await this.getAllAppointments();
      const index = appointments.findIndex(a => a.id === appointmentId);
      
      if (index !== -1) {
        appointments[index].status = status;
        await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Mark appointment as call completed
  async markCallCompleted(appointmentId: string): Promise<void> {
    try {
      const appointments = await this.getAllAppointments();
      const index = appointments.findIndex(a => a.id === appointmentId);
      
      if (index !== -1) {
        appointments[index].callCompleted = true;
        await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
      }
    } catch (error) {
      console.error('Error marking call as completed:', error);
      throw error;
    }
  },

  // Get appointments for a specific doctor
  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    try {
      const appointments = await this.getAllAppointments();
      return appointments.filter(a => a.doctorId === doctorId && a.status !== 'cancelled');
    } catch (error) {
      console.error('Error getting doctor appointments:', error);
      return [];
    }
  },

  // Get appointments for a specific patient
  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    try {
      const appointments = await this.getAllAppointments();
      return appointments.filter(a => a.patientId === patientId);
    } catch (error) {
      console.error('Error getting patient appointments:', error);
      return [];
    }
  },

  // Filter appointments
  async filterAppointments(
    doctorId: string,
    filters: {
      date?: string;
      consultationType?: 'phone' | 'video' | 'all';
      paymentStatus?: 'paid' | 'pending' | 'all';
    }
  ): Promise<Appointment[]> {
    try {
      let appointments = await this.getAppointmentsByDoctor(doctorId);

      // Filter by date
      if (filters.date) {
        appointments = appointments.filter(a => a.date === filters.date);
      }

      // Filter by consultation type
      if (filters.consultationType && filters.consultationType !== 'all') {
        appointments = appointments.filter(a => a.consultationType === filters.consultationType);
      }

      // Filter by payment status
      if (filters.paymentStatus && filters.paymentStatus !== 'all') {
        appointments = appointments.filter(a => a.paymentStatus === filters.paymentStatus);
      }

      return appointments;
    } catch (error) {
      console.error('Error filtering appointments:', error);
      return [];
    }
  },

  // Stub methods for compatibility (AsyncStorage doesn't support real-time)
  subscribeToAppointments(doctorId: string, callback: (appointments: Appointment[]) => void): any {
    console.log('Real-time subscriptions not supported with AsyncStorage');
    return null;
  },

  unsubscribe(subscription: any): void {
    // No-op for AsyncStorage
  },
};
