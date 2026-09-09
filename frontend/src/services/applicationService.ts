import api from './api';
import { ApiResponse, ApplicationStatus, UserApplication } from '../types';

export const applicationService = {
  async getApplications() {
    const res = await api.get<ApiResponse<UserApplication[]>>('/applications');
    return res.data;
  },

  async trackApplication(data: Partial<UserApplication>) {
    const res = await api.post<ApiResponse<UserApplication>>('/applications', data);
    return res.data;
  },

  async updateStatus(id: number, status: ApplicationStatus, notes?: string) {
    const res = await api.patch<ApiResponse<UserApplication>>(`/applications/${id}/status`, null, {
      params: { status, notes },
    });
    return res.data;
  },

  async deleteApplication(id: number) {
    const res = await api.delete<ApiResponse<void>>(`/applications/${id}`);
    return res.data;
  },
};
