import api from './api';
import { ApiResponse, RecommendationResponse } from '../types';

export const recommendationService = {
  async getRecommendedSchemes() {
    const res = await api.get<ApiResponse<RecommendationResponse[]>>('/business/recommendations/schemes');
    return res.data;
  },

  async getRecommendedTenders() {
    const res = await api.get<ApiResponse<RecommendationResponse[]>>('/business/recommendations/tenders');
    return res.data;
  },
};
