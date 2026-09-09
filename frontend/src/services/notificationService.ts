import api from './api';
import { ApiResponse, NotificationItem } from '../types';

export const notificationService = {
  async getNotifications() {
    const res = await api.get<ApiResponse<NotificationItem[]>>('/notifications');
    return res.data;
  },

  async getUnreadCount() {
    const res = await api.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    return res.data;
  },

  async markAsRead(id: number) {
    const res = await api.patch<ApiResponse<void>>(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead() {
    const res = await api.patch<ApiResponse<void>>('/notifications/read-all');
    return res.data;
  },
};
