import api from './api';
import { ApiResponse, BusinessDocument } from '../types';

export const documentService = {
  async getDocuments() {
    const res = await api.get<ApiResponse<BusinessDocument[]>>('/business/documents');
    return res.data;
  },

  async uploadDocument(documentType: string, file: File) {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);

    const res = await api.post<ApiResponse<BusinessDocument>>('/business/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async deleteDocument(id: number) {
    const res = await api.delete<ApiResponse<void>>(`/business/documents/${id}`);
    return res.data;
  },
};
