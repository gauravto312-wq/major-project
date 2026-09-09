import api from './api';
import { ApiResponse, JwtAuthResponse, User } from '../types';

export const authService = {
  async register(data: { fullName: string; email: string; password: String; phone?: string; role: string }) {
    const res = await api.post<ApiResponse<JwtAuthResponse>>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: String }) {
    const res = await api.post<ApiResponse<JwtAuthResponse>>('/auth/login', data);
    return res.data;
  },

  async getCurrentUser() {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};
