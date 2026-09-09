import api from './api';
import { ApiResponse, PageResponse, Scheme } from '../types';

export interface SchemeFilterParams {
  keyword?: string;
  state?: string;
  schemeType?: string;
  categoryId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export const schemeService = {
  async getPublicSchemes(params?: SchemeFilterParams) {
    const res = await api.get<ApiResponse<PageResponse<Scheme>>>('/schemes', { params });
    return res.data;
  },

  async getFeaturedSchemes() {
    const res = await api.get<ApiResponse<Scheme[]>>('/schemes/featured');
    return res.data;
  },

  async getLatestSchemes() {
    const res = await api.get<ApiResponse<Scheme[]>>('/schemes/latest');
    return res.data;
  },

  async getSchemeBySlug(slug: string) {
    const res = await api.get<ApiResponse<Scheme>>(`/schemes/slug/${slug}`);
    return res.data;
  },

  async getSchemeById(id: number) {
    const res = await api.get<ApiResponse<Scheme>>(`/schemes/${id}`);
    return res.data;
  },
};
