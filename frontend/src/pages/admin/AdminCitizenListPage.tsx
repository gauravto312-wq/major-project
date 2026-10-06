import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { CitizenDto } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { Pagination } from '../../components/Pagination';

const AdminCitizenListPage: React.FC = () => {
  const [citizens, setCitizens] = useState<CitizenDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenDto | null>(null);

  const fetchCitizens = async (queryStr: string, pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getCitizens(queryStr, pageNum, 15);
      if (response.success && response.data) {
        setCitizens(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        setError(response.message || 'Failed to load citizen accounts');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching citizen accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens(activeQuery, page);
  }, [activeQuery, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setActiveQuery(searchQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">👤</span>
            Citizen & Individual Accounts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and audit registered citizen profiles across the BizSahayak platform.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 shadow-sm flex items-center gap-2">
          <span className="font-semibold text-gray-900">{totalElements}</span> Total Citizens Registered
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by full name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
        >
          Search
        </button>
        {activeQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveQuery('');
              setPage(0);
            }}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <LoadingSpinner message="Loading citizen accounts..." />
          </div>
        ) : citizens.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-medium text-gray-900 mt-2">No Citizen Accounts Found</h3>
            <p className="text-gray-500 text-sm mt-1">
              {activeQuery ? `No citizens matching "${activeQuery}"` : 'No citizen accounts registered yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Citizen Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity Stats</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {citizens.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">#{c.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{c.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{c.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{c.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {c.role === 'ROLE_CITIZEN' ? 'Citizen' : 'User (Citizen)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">⭐ {c.savedSchemesCount} Saved</span>
                        <span className="bg-indigo-50 px-2 py-1 rounded text-indigo-700">📑 {c.trackedApplicationsCount} Tracked</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedCitizen(c)}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={15}
            onPageChange={(p: number) => setPage(p)}
          />
        </div>
      )}

      {/* Citizen Detail Modal */}
      {selectedCitizen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCitizen(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xl">
                {selectedCitizen.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCitizen.fullName}</h2>
                <p className="text-sm text-gray-500">Citizen Account Details</p>
              </div>
            </div>

            <div className="space-y-4 text-sm border-t border-b border-gray-100 py-4 my-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-xs block">Account ID</span>
                  <span className="font-semibold text-gray-900">#{selectedCitizen.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">RBAC Role</span>
                  <span className="font-semibold text-emerald-700">{selectedCitizen.role}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">Email Address</span>
                  <span className="font-semibold text-gray-900 break-all">{selectedCitizen.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">Phone Number</span>
                  <span className="font-semibold text-gray-900">{selectedCitizen.phone || 'Not Provided'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">Account Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs block">Registration Date</span>
                  <span className="font-medium text-gray-700">
                    {selectedCitizen.createdAt ? new Date(selectedCitizen.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platform Activity Summary</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <span className="block text-xl font-bold text-indigo-700">{selectedCitizen.savedSchemesCount}</span>
                <span className="text-xs text-indigo-600">Saved Opportunities</span>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <span className="block text-xl font-bold text-blue-700">{selectedCitizen.trackedApplicationsCount}</span>
                <span className="text-xs text-blue-600">Tracked Applications</span>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <span className="block text-xl font-bold text-purple-700">{selectedCitizen.notificationsCount}</span>
                <span className="text-xs text-purple-600">Notifications Sent</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCitizen(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCitizenListPage;
