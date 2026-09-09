import api from './api';
import { ApiResponse, BusinessProfile } from '../types';

export const businessService = {
  async getProfile() {
    const res = await api.get<ApiResponse<BusinessProfile>>('/business/profile');
    return res.data;
  },

  async saveProfile(data: Partial<BusinessProfile>) {
    const res = await api.put<ApiResponse<BusinessProfile>>('/business/profile', data);
    return res.data;
  },

  async submitVerification() {
    const res = await api.post<ApiResponse<BusinessProfile>>('/business/submit-verification');
    return res.data;
  },
};
