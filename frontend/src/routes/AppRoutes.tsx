import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Public Pages (Lazy Loaded)
const HomePage = lazy(() => import('../pages/public/HomePage').then(m => ({ default: m.HomePage })));
const SchemesPage = lazy(() => import('../pages/public/SchemesPage').then(m => ({ default: m.SchemesPage })));
const SchemeDetailPage = lazy(() => import('../pages/public/SchemeDetailPage').then(m => ({ default: m.SchemeDetailPage })));
const ApplicationAssistantPage = lazy(() => import('../pages/public/ApplicationAssistantPage').then(m => ({ default: m.ApplicationAssistantPage })));
const TendersPage = lazy(() => import('../pages/public/TendersPage').then(m => ({ default: m.TendersPage })));
const TenderDetailPage = lazy(() => import('../pages/public/TenderDetailPage').then(m => ({ default: m.TenderDetailPage })));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Auth Pages (Lazy Loaded)
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterUserPage = lazy(() => import('../pages/auth/RegisterUserPage').then(m => ({ default: m.RegisterUserPage })));
const RegisterBusinessPage = lazy(() => import('../pages/auth/RegisterBusinessPage').then(m => ({ default: m.RegisterBusinessPage })));
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));

// Business Pages (Lazy Loaded)
const BusinessDashboardPage = lazy(() => import('../pages/business/BusinessDashboardPage').then(m => ({ default: m.BusinessDashboardPage })));
const BusinessProfilePage = lazy(() => import('../pages/business/BusinessProfilePage').then(m => ({ default: m.BusinessProfilePage })));
const DocumentUploadPage = lazy(() => import('../pages/business/DocumentUploadPage').then(m => ({ default: m.DocumentUploadPage })));
const RecommendationsPage = lazy(() => import('../pages/business/RecommendationsPage').then(m => ({ default: m.RecommendationsPage })));
const MyOpportunityCenterPage = lazy(() => import('../pages/business/MyOpportunityCenterPage').then(m => ({ default: m.MyOpportunityCenterPage })));
const SavedOpportunitiesPage = lazy(() => import('../pages/business/SavedOpportunitiesPage').then(m => ({ default: m.SavedOpportunitiesPage })));
const MyApplicationsPage = lazy(() => import('../pages/business/MyApplicationsPage').then(m => ({ default: m.MyApplicationsPage })));

// Admin Pages (Lazy Loaded)
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminBusinessListPage = lazy(() => import('../pages/admin/AdminBusinessListPage').then(m => ({ default: m.AdminBusinessListPage })));
const AdminBusinessDetailPage = lazy(() => import('../pages/admin/AdminBusinessDetailPage').then(m => ({ default: m.AdminBusinessDetailPage })));
const AdminSchemeListPage = lazy(() => import('../pages/admin/AdminSchemeListPage').then(m => ({ default: m.AdminSchemeListPage })));
const AdminSchemeFormPage = lazy(() => import('../pages/admin/AdminSchemeFormPage').then(m => ({ default: m.AdminSchemeFormPage })));
const AdminTenderListPage = lazy(() => import('../pages/admin/AdminTenderListPage').then(m => ({ default: m.AdminTenderListPage })));
const AdminTenderFormPage = lazy(() => import('../pages/admin/AdminTenderFormPage').then(m => ({ default: m.AdminTenderFormPage })));
const AdminAuditLogsPage = lazy(() => import('../pages/admin/AdminAuditLogsPage').then(m => ({ default: m.AdminAuditLogsPage })));
const AdminSourcesPage = lazy(() => import('../pages/admin/AdminSourcesPage').then(m => ({ default: m.AdminSourcesPage })));
const AdminPendingReviewPage = lazy(() => import('../pages/admin/AdminPendingReviewPage').then(m => ({ default: m.AdminPendingReviewPage })));
const AdminCitizenListPage = lazy(() => import('../pages/admin/AdminCitizenListPage').then(m => ({ default: m.default })));

// Citizen Pages (Lazy Loaded)
const CitizenDashboardPage = lazy(() => import('../pages/citizen/CitizenDashboardPage').then(m => ({ default: m.CitizenDashboardPage })));
const CitizenNewSchemesPage = lazy(() => import('../pages/citizen/CitizenNewSchemesPage').then(m => ({ default: m.CitizenNewSchemesPage })));
const CitizenProfilePage = lazy(() => import('../pages/citizen/CitizenProfilePage').then(m => ({ default: m.CitizenProfilePage })));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <LoadingSpinner message="Loading Portal Resource..." />
        </div>
      }
    >
      <Routes>
        {/* Public Discovery Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/schemes/:slug" element={<SchemeDetailPage />} />
        <Route path="/schemes/:slug/assistant" element={<ApplicationAssistantPage />} />
        <Route path="/tenders" element={<TendersPage />} />
        <Route path="/tenders/:slug" element={<TenderDetailPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterUserPage />} />
        <Route path="/register/business" element={<RegisterBusinessPage />} />

        {/* User & Citizen Secured Routes */}
        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute>
              <CitizenDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/new-schemes"
          element={
            <ProtectedRoute>
              <CitizenNewSchemesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/opportunity-center"
          element={
            <ProtectedRoute>
              <MyOpportunityCenterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/profile"
          element={
            <ProtectedRoute>
              <CitizenProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/saved"
          element={
            <ProtectedRoute>
              <SavedOpportunitiesPage />
            </ProtectedRoute>
          }
        />
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
          path="/business/opportunity-center"
          element={
            <ProtectedRoute allowedRoles={['ROLE_BUSINESS', 'ROLE_ADMIN']}>
              <MyOpportunityCenterPage />
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
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboardPage />
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
          path="/admin/schemes/new"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminSchemeFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schemes/edit/:id"
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
          path="/admin/tenders/new"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminTenderFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tenders/edit/:id"
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
        <Route
          path="/admin/citizens"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminCitizenListPage />
            </ProtectedRoute>
          }
        />

        {/* Proper 404 Route for Unmatched Paths */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
