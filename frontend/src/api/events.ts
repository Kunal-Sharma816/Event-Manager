import axiosInstance from './axios';
import { CreateEventData, UpdateEventData, EventsResponse, EventResponse, RegistrationResponse } from '../types';

export const eventsAPI = {
  // Public events (no auth required)
  getPublicEvents: async (): Promise<EventsResponse> => {
    const response = await axiosInstance.get('/events/public');
    return response.data;
  },

  // All events (admin only)
  getAllEvents: async (): Promise<EventsResponse> => {
    const response = await axiosInstance.get('/events');
    return response.data;
  },

  // User's own events (organizer)
  getUserEvents: async (): Promise<EventsResponse> => {
    const response = await axiosInstance.get('/events/my-events');
    return response.data;
  },

  // Registered events (student)
  getRegisteredEvents: async (): Promise<EventsResponse> => {
    const response = await axiosInstance.get('/events/registered');
    return response.data;
  },

  // Get single event
  getEvent: async (id: string): Promise<EventResponse> => {
    const response = await axiosInstance.get(`/events/${id}`);
    return response.data;
  },

  // Create event
  createEvent: async (eventData: CreateEventData): Promise<EventResponse> => {
    const response = await axiosInstance.post('/events', eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (id: string, eventData: UpdateEventData): Promise<EventResponse> => {
    const response = await axiosInstance.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(`/events/${id}`);
    return response.data;
  },

  // Approve event (admin)
  approveEvent: async (id: string): Promise<EventResponse> => {
    const response = await axiosInstance.patch(`/events/${id}/approve`);
    return response.data;
  },

  // Reject event (admin)
  rejectEvent: async (id: string): Promise<EventResponse> => {
    const response = await axiosInstance.patch(`/events/${id}/reject`);
    return response.data;
  },

  // Register for event (student)
  registerForEvent: async (eventId: string, notes?: string): Promise<RegistrationResponse> => {
    const response = await axiosInstance.post(`/events/${eventId}/register`, { notes });
    return response.data;
  },

  // Unregister from event (student)
  unregisterFromEvent: async (eventId: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(`/events/${eventId}/register`);
    return response.data;
  },
};