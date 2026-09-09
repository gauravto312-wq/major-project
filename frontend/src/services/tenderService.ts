import api from './api';
import { ApiResponse, PageResponse, Tender } from '../types';

export interface TenderFilterParams {
  keyword?: string;
  state?: string;
  categoryId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export const tenderService = {
  async getPublicTenders(params?: TenderFilterParams) {
    const res = await api.get<ApiResponse<PageResponse<Tender>>>('/tenders', { params });
    return res.data;
  },

  async getFeaturedTenders() {
    const res = await api.get<ApiResponse<Tender[]>>('/tenders/featured');
    return res.data;
  },

  async getLatestTenders() {
    const res = await api.get<ApiResponse<Tender[]>>('/tenders/latest');
    return res.data;
  },

  async getTenderBySlug(slug: string) {
    const res = await api.get<ApiResponse<Tender>>(`/tenders/slug/${slug}`);
    return res.data;
  },

  async getTenderById(id: number) {
    const res = await api.get<ApiResponse<Tender>>(`/tenders/${id}`);
    return res.data;
  },
};
