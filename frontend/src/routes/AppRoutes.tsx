import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { SchemesPage } from '../pages/public/SchemesPage';
import { SchemeDetailPage } from '../pages/public/SchemeDetailPage';
import { TendersPage } from '../pages/public/TendersPage';
import { TenderDetailPage } from '../pages/public/TenderDetailPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterUserPage } from '../pages/auth/RegisterUserPage';
import { RegisterBusinessPage } from '../pages/auth/RegisterBusinessPage';

// Business Pages
import { BusinessDashboardPage } from '../pages/business/BusinessDashboardPage';
import { BusinessProfilePage } from '../pages/business/BusinessProfilePage';
import { DocumentUploadPage } from '../pages/business/DocumentUploadPage';
import { RecommendationsPage } from '../pages/business/RecommendationsPage';
import { SavedOpportunitiesPage } from '../pages/business/SavedOpportunitiesPage';
import { MyApplicationsPage } from '../pages/business/MyApplicationsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminBusinessListPage } from '../pages/admin/AdminBusinessListPage';
import { AdminBusinessDetailPage } from '../pages/admin/AdminBusinessDetailPage';
import { AdminSchemeListPage } from '../pages/admin/AdminSchemeListPage';
import { AdminSchemeFormPage } from '../pages/admin/AdminSchemeFormPage';
import { AdminTenderListPage } from '../pages/admin/AdminTenderListPage';
import { AdminTenderFormPage } from '../pages/admin/AdminTenderFormPage';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage';
import { AdminSourcesPage } from '../pages/admin/AdminSourcesPage';
import { AdminPendingReviewPage } from '../pages/admin/AdminPendingReviewPage';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Discovery Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/schemes" element={<SchemesPage />} />
      <Route path="/schemes/:slug" element={<SchemeDetailPage />} />
      <Route path="/tenders" element={<TendersPage />} />
      <Route path="/tenders/:slug" element={<TenderDetailPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/register" element={<RegisterUserPage />} />
      <Route path="/register/business" element={<RegisterBusinessPage />} />

      {/* User Secured Routes */}
      <Route
        path="/user/saved"
        element={
          <ProtectedRoute>
            <SavedOpportunitiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/applications"
        element={
          <ProtectedRoute>
            <MyApplicationsPage />
          </ProtectedRoute>
        }
      />

      {/* Business MSME Secured Routes */}
      <Route
        path="/business/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_BUSINESS', 'ROLE_ADMIN']}>
            <BusinessDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/profile"
        element={
          <ProtectedRoute allowedRoles={['ROLE_BUSINESS', 'ROLE_ADMIN']}>
            <BusinessProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/documents"
        element={
          <ProtectedRoute allowedRoles={['ROLE_BUSINESS', 'ROLE_ADMIN']}>
            <DocumentUploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/recommendations"
        element={
          <ProtectedRoute allowedRoles={['ROLE_BUSINESS', 'ROLE_ADMIN']}>
            <RecommendationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/saved"
        element={
          <ProtectedRoute allowedRoles={['ROLE_BUSINESS', 'ROLE_ADMIN']}>
            <SavedOpportunitiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/applications"
        element={
          <ProtectedRoute allowedRoles={['ROLE_BUSINESS', 'ROLE_ADMIN']}>
            <MyApplicationsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Secured Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/businesses/pending"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminBusinessListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/businesses"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminBusinessListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/businesses/:id"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminBusinessDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/schemes"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminSchemeListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/schemes/create"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminSchemeFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/schemes/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminSchemeFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tenders"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminTenderListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tenders/create"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminTenderFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tenders/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminTenderFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminAuditLogsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sources"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminSourcesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/government-sources"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminSourcesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/schemes/pending-review"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminPendingReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tenders/pending-review"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminPendingReviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/imported-data"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminPendingReviewPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};
