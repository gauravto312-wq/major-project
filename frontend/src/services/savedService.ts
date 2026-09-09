import api from './api';
import { ApiResponse, Scheme, Tender } from '../types';

export const savedService = {
  async saveScheme(schemeId: number) {
    const res = await api.post<ApiResponse<void>>(`/saved/schemes/${schemeId}`);
    return res.data;
  },

  async unsaveScheme(schemeId: number) {
    const res = await api.delete<ApiResponse<void>>(`/saved/schemes/${schemeId}`);
    return res.data;
  },

  async getSavedSchemes() {
    const res = await api.get<ApiResponse<Scheme[]>>('/saved/schemes');
    return res.data;
  },

  async saveTender(tenderId: number) {
    const res = await api.post<ApiResponse<void>>(`/saved/tenders/${tenderId}`);
    return res.data;
  },

  async unsaveTender(tenderId: number) {
    const res = await api.delete<ApiResponse<void>>(`/saved/tenders/${tenderId}`);
    return res.data;
  },

  async getSavedTenders() {
    const res = await api.get<ApiResponse<Tender[]>>('/saved/tenders');
    return res.data;
  },
};
