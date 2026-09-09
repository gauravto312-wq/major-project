import api from './api';
import {
  ApiResponse,
  AuditLog,
  BusinessDocument,
  BusinessProfile,
  DashboardStats,
  PageResponse,
  Scheme,
  Tender,
} from '../types';

export const adminService = {
  async getDashboardStats() {
    const res = await api.get<ApiResponse<DashboardStats>>('/admin/stats');
    return res.data;
  },

  async getPendingBusinesses(page = 0, size = 15) {
    const res = await api.get<ApiResponse<PageResponse<BusinessProfile>>>('/admin/businesses/pending', {
      params: { page, size },
    });
    return res.data;
  },

  async getAllBusinesses(page = 0, size = 15) {
    const res = await api.get<ApiResponse<PageResponse<BusinessProfile>>>('/admin/businesses', {
      params: { page, size },
    });
    return res.data;
  },

  async getBusinessById(id: number) {
    const res = await api.get<ApiResponse<BusinessProfile>>(`/admin/businesses/${id}`);
    return res.data;
  },

  async getBusinessDocuments(id: number) {
    const res = await api.get<ApiResponse<BusinessDocument[]>>(`/admin/businesses/${id}/documents`);
    return res.data;
  },

  async approveBusiness(id: number, adminNotes?: string) {
    const res = await api.patch<ApiResponse<BusinessProfile>>(`/admin/businesses/${id}/approve`, { adminNotes });
    return res.data;
  },

  async rejectBusiness(id: number, rejectionReason: string) {
    const res = await api.patch<ApiResponse<BusinessProfile>>(`/admin/businesses/${id}/reject`, { rejectionReason });
    return res.data;
  },

  async requestCorrection(id: number, rejectionReason: string) {
    const res = await api.patch<ApiResponse<BusinessProfile>>(`/admin/businesses/${id}/request-correction`, { rejectionReason });
    return res.data;
  },

  // Admin Scheme CRUD
  async getAllSchemes(page = 0, size = 15) {
    const res = await api.get<ApiResponse<PageResponse<Scheme>>>('/admin/schemes', { params: { page, size } });
    return res.data;
  },

  async createScheme(scheme: Partial<Scheme>) {
    const res = await api.post<ApiResponse<Scheme>>('/admin/schemes', scheme);
    return res.data;
  },

  async updateScheme(id: number, scheme: Partial<Scheme>) {
    const res = await api.put<ApiResponse<Scheme>>(`/admin/schemes/${id}`, scheme);
    return res.data;
  },

  async publishScheme(id: number) {
    const res = await api.patch<ApiResponse<Scheme>>(`/admin/schemes/${id}/publish`);
    return res.data;
  },

  async deactivateScheme(id: number) {
    const res = await api.patch<ApiResponse<Scheme>>(`/admin/schemes/${id}/deactivate`);
    return res.data;
  },

  async archiveScheme(id: number) {
    const res = await api.patch<ApiResponse<Scheme>>(`/admin/schemes/${id}/archive`);
    return res.data;
  },

  async toggleSchemeFeatured(id: number) {
    const res = await api.patch<ApiResponse<Scheme>>(`/admin/schemes/${id}/feature`);
    return res.data;
  },

  // Admin Tender CRUD
  async getAllTenders(page = 0, size = 15) {
    const res = await api.get<ApiResponse<PageResponse<Tender>>>('/admin/tenders', { params: { page, size } });
    return res.data;
  },

  async createTender(tender: Partial<Tender>) {
    const res = await api.post<ApiResponse<Tender>>('/admin/tenders', tender);
    return res.data;
  },

  async updateTender(id: number, tender: Partial<Tender>) {
    const res = await api.put<ApiResponse<Tender>>(`/admin/tenders/${id}`, tender);
    return res.data;
  },

  async publishTender(id: number) {
    const res = await api.patch<ApiResponse<Tender>>(`/admin/tenders/${id}/publish`);
    return res.data;
  },

  async closeTender(id: number) {
    const res = await api.patch<ApiResponse<Tender>>(`/admin/tenders/${id}/close`);
    return res.data;
  },

  async archiveTender(id: number) {
    const res = await api.patch<ApiResponse<Tender>>(`/admin/tenders/${id}/archive`);
    return res.data;
  },

  async toggleTenderFeatured(id: number) {
    const res = await api.patch<ApiResponse<Tender>>(`/admin/tenders/${id}/feature`);
    return res.data;
  },

  // Audit Logs
  async getAuditLogs(page = 0, size = 20) {
    const res = await api.get<ApiResponse<PageResponse<AuditLog>>>('/admin/audit-logs', { params: { page, size } });
    return res.data;
  },

  // Government Sources
  async getSources() {
    const res = await api.get<ApiResponse<any[]>>('/admin/government-sources');
    return res.data;
  },

  async getSourceById(id: number) {
    const res = await api.get<ApiResponse<any>>(`/admin/government-sources/${id}`);
    return res.data;
  },

  async syncSource(id: number) {
    const res = await api.post<ApiResponse<any>>(`/admin/government-sources/${id}/sync`);
    return res.data;
  },

  async activateSource(id: number) {
    const res = await api.patch<ApiResponse<any>>(`/admin/government-sources/${id}/activate`);
    return res.data;
  },

  async deactivateSource(id: number) {
    const res = await api.patch<ApiResponse<any>>(`/admin/government-sources/${id}/deactivate`);
    return res.data;
  },

  async getSourceSyncLogs(id: number) {
    const res = await api.get<ApiResponse<any[]>>(`/admin/government-sources/${id}/sync-logs`);
    return res.data;
  },

  // Admin Pending Review Queue
  async getPendingSchemes(page = 0, size = 15) {
    const res = await api.get<ApiResponse<PageResponse<Scheme>>>('/admin/schemes/pending-review', { params: { page, size } });
    return res.data;
  },

  async approveScheme(id: number) {
    const res = await api.patch<ApiResponse<Scheme>>(`/admin/schemes/${id}/approve`);
    return res.data;
  },

  async rejectScheme(id: number) {
    const res = await api.patch<ApiResponse<Scheme>>(`/admin/schemes/${id}/reject`);
    return res.data;
  },

  async getPendingTenders(page = 0, size = 15) {
    const res = await api.get<ApiResponse<PageResponse<Tender>>>('/admin/tenders/pending-review', { params: { page, size } });
    return res.data;
  },

  async approveTender(id: number) {
    const res = await api.patch<ApiResponse<Tender>>(`/admin/tenders/${id}/approve`);
    return res.data;
  },

  async rejectTender(id: number) {
    const res = await api.patch<ApiResponse<Tender>>(`/admin/tenders/${id}/reject`);
    return res.data;
  },
};
