import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { tenderService } from '../../services/tenderService';
import { Tender, TenderStatus } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { ArrowLeft, Save, Send } from 'lucide-react';

export const AdminTenderFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Tender>>({
    title: '',
    tenderNumber: '',
    organization: '',
    department: '',
    location: '',
    state: 'Uttar Pradesh',
    district: '',
    estimatedValue: 1000000,
    closingDate: '',
    description: '',
    eligibility: '',
    requiredDocuments: '',
    requirements: '',
    officialTenderUrl: '',
    officialSourceUrl: '',
    status: 'DRAFT',
    featured: false,
    targetIndustries: 'Solar & Renewable Energy, Manufacturing',
    targetBusinessTypes: 'MSME, Private Limited, Partnership',
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isEditMode) {
      loadTender();
    }
  }, [id]);

  const loadTender = async () => {
    setLoading(true);
    try {
      const res = await tenderService.getTenderById(Number(id));
      if (res.success) {
        setFormData(res.data);
      }
    } catch (err) {
      console.error('Error loading tender:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent, targetStatus?: TenderStatus) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    const payload = {
      ...formData,
      status: targetStatus || formData.status || 'DRAFT',
    };

    try {
      if (isEditMode) {
        const res = await adminService.updateTender(Number(id), payload);
        if (res.success) {
          setAlert({ type: 'success', message: 'Tender updated successfully!' });
          setTimeout(() => navigate('/admin/tenders'), 1000);
        }
      } else {
        const res = await adminService.createTender(payload);
        if (res.success) {
          setAlert({ type: 'success', message: 'Tender created successfully!' });
          setTimeout(() => navigate('/admin/tenders'), 1000);
        }
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error saving tender.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading tender payload..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link to="/admin/tenders" className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Tenders Management
        </Link>
        <h1 className="text-xl font-black text-slate-900">
          {isEditMode ? 'Edit Government Tender' : 'Add New Government Tender'}
        </h1>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={(e) => handleSubmit(e)} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label-field">Tender Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="e.g. Procurement & Installation of 100 kW Roof Solar PV Power Plant"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Tender Reference Number *</label>
            <input
              type="text"
              name="tenderNumber"
              required
              value={formData.tenderNumber || ''}
              onChange={handleChange}
              placeholder="e.g. TNT-SOLAR-2026-089"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Organization / Procuring Entity *</label>
            <input
              type="text"
              name="organization"
              required
              value={formData.organization || ''}
              onChange={handleChange}
              placeholder="e.g. UPNEDA / NSIC / Ministry"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              placeholder="Department of Renewable Energy"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Estimated Tender Value (INR ₹) *</label>
            <input
              type="number"
              name="estimatedValue"
              required
              value={formData.estimatedValue || ''}
              onChange={handleChange}
              placeholder="4500000"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">State / Region *</label>
            <select name="state" value={formData.state || 'Uttar Pradesh'} onChange={handleChange} className="input-field">
              <option value="All India">All India / Central Tender</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          <div>
            <label className="label-field">Closing Date / Bid Submission Deadline</label>
            <input
              type="date"
              name="closingDate"
              value={formData.closingDate || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="label-field">Detailed Tender Description & Scope of Work *</label>
          <textarea
            name="description"
            rows={4}
            required
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Detailed scope of supply, installation, testing and commissioning..."
            className="input-field"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Bidder Eligibility Requirements</label>
            <textarea
              name="eligibility"
              rows={3}
              value={formData.eligibility || ''}
              onChange={handleChange}
              placeholder="Class-A Electrical contractors, CMMI level 3..."
              className="input-field"
            ></textarea>
          </div>

          <div>
            <label className="label-field">Required Submission Documents</label>
            <textarea
              name="requiredDocuments"
              rows={3}
              value={formData.requiredDocuments || ''}
              onChange={handleChange}
              placeholder="GST, PAN, Turnover certificates..."
              className="input-field"
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Official Tender URL (GeM / eProcure)</label>
            <input
              type="url"
              name="officialTenderUrl"
              value={formData.officialTenderUrl || ''}
              onChange={handleChange}
              placeholder="https://eprocure.gov.in"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Official Source URL</label>
            <input
              type="url"
              name="officialSourceUrl"
              value={formData.officialSourceUrl || ''}
              onChange={handleChange}
              placeholder="https://organization.gov.in"
              className="input-field"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={Boolean(formData.featured)}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            Mark as Featured Tender on Homepage
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'DRAFT')}
            disabled={saving}
            className="btn-secondary text-xs py-2.5 px-4 font-bold"
          >
            <Save className="w-4 h-4" /> Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'PUBLISHED')}
            disabled={saving}
            className="btn-primary text-xs py-2.5 px-6 font-bold bg-indigo-600 hover:bg-indigo-700"
          >
            <Send className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Save & Publish Tender Live'}
          </button>
        </div>
      </form>
    </div>
  );
};
