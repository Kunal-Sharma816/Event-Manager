import axiosInstance from './axios';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<{ success: boolean; user: User }> => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },
};