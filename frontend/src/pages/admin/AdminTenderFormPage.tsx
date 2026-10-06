import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { tenderService } from '../../services/tenderService';
import { Tender, TenderStatus } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { ArrowLeft, Save, Send, FileText } from 'lucide-react';

const INDIAN_STATES = [
  'All India',
  'Uttar Pradesh',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttarakhand',
  'West Bengal',
  'Delhi (NCT)',
  'Jammu & Kashmir',
  'Ladakh',
  'Chandigarh',
  'Puducherry',
];

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
    return <LoadingSpinner message="Loading tender details..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <Link
            to="/admin/tenders"
            className="text-xs font-bold text-[#5E6B7D] hover:text-[#173B72] flex items-center gap-1.5 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tenders Management
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#F3E8D0] text-[#173B72] rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-[#172033]">
              {isEditMode ? 'Edit Government Tender' : 'Add New Government Tender'}
            </h1>
          </div>
        </div>
        <div className="text-xs text-[#5E6B7D]">
          Portal Procurement Management
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={(e) => handleSubmit(e)} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-gov space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="t-title" className="label-field">Tender Title *</label>
            <input
              id="t-title"
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
            <label htmlFor="t-number" className="label-field">Tender Reference Number *</label>
            <input
              id="t-number"
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
            <label htmlFor="t-org" className="label-field">Organization / Procuring Entity *</label>
            <input
              id="t-org"
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
            <label htmlFor="t-dept" className="label-field">Department</label>
            <input
              id="t-dept"
              type="text"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              placeholder="Department of Renewable Energy"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="t-val" className="label-field">Estimated Tender Value (INR ₹) *</label>
            <input
              id="t-val"
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
            <label htmlFor="t-state" className="label-field">State / Region *</label>
            <select
              id="t-state"
              name="state"
              value={formData.state || 'Uttar Pradesh'}
              onChange={handleChange}
              className="input-field"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="t-closing" className="label-field">Closing Date / Bid Submission Deadline</label>
            <input
              id="t-closing"
              type="date"
              name="closingDate"
              value={formData.closingDate || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="t-desc" className="label-field">Detailed Tender Description & Scope of Work *</label>
          <textarea
            id="t-desc"
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
            <label htmlFor="t-elig" className="label-field">Bidder Eligibility Requirements</label>
            <textarea
              id="t-elig"
              name="eligibility"
              rows={3}
              value={formData.eligibility || ''}
              onChange={handleChange}
              placeholder="Class-A Electrical contractors, CMMI level 3..."
              className="input-field"
            ></textarea>
          </div>

          <div>
            <label htmlFor="t-docs" className="label-field">Required Submission Documents</label>
            <textarea
              id="t-docs"
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
            <label htmlFor="t-tenderurl" className="label-field">Official Tender URL (GeM / eProcure)</label>
            <input
              id="t-tenderurl"
              type="url"
              name="officialTenderUrl"
              value={formData.officialTenderUrl || ''}
              onChange={handleChange}
              placeholder="https://eprocure.gov.in"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="t-srcurl" className="label-field">Official Source URL</label>
            <input
              id="t-srcurl"
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
          <label className="flex items-center gap-2 text-xs font-bold text-[#172033] cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={Boolean(formData.featured)}
              onChange={handleChange}
              className="w-4 h-4 text-[#173B72] rounded"
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
            className="btn-primary text-xs py-2.5 px-6 font-bold bg-[#173B72] hover:bg-[#2456A6]"
          >
            <Send className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Save & Publish Tender Live'}
          </button>
        </div>
      </form>
    </div>
  );
};
