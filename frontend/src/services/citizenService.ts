import api from './api';
import { ApiResponse, CitizenDashboardDto, PageResponse, Scheme } from '../types';

export const citizenService = {
  async getCitizenDashboard() {
    const res = await api.get<ApiResponse<CitizenDashboardDto>>('/citizen/dashboard');
    return res.data;
  },

  async getNewSchemes(page = 0, size = 12) {
    const res = await api.get<ApiResponse<PageResponse<Scheme>>>('/citizen/new-schemes', {
      params: { page, size },
    });
    return res.data;
  },
};
