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

  async viewOrDownloadDocument(fileUrl: string, fileName: string) {
    const token = localStorage.getItem('token');
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `http://localhost:8080${fileUrl}`;

    const response = await fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load document (Status ${response.status})`);
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    const windowRef = window.open(objectUrl, '_blank');
    if (!windowRef) {
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  },
};
