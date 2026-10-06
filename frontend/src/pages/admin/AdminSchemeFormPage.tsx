import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { schemeService } from '../../services/schemeService';
import { Scheme, SchemeStatus } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { ArrowLeft, Save, Send } from 'lucide-react';

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

export const AdminSchemeFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Scheme>>({
    title: '',
    department: '',
    ministry: '',
    schemeType: 'Subsidy',
    state: 'Uttar Pradesh',
    district: 'All Districts',
    shortDescription: '',
    description: '',
    benefits: '',
    eligibility: '',
    requiredDocuments: '',
    applicationProcess: '',
    startDate: '',
    deadline: '',
    officialApplicationUrl: '',
    officialSourceUrl: '',
    status: 'DRAFT',
    featured: false,
    targetIndustries: 'Food Processing, Manufacturing, Agriculture',
    targetBusinessTypes: 'MSME, Proprietorship, Partnership, Private Limited',
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isEditMode) {
      loadScheme();
    }
  }, [id]);

  const loadScheme = async () => {
    setLoading(true);
    try {
      const res = await schemeService.getSchemeById(Number(id));
      if (res.success) {
        setFormData(res.data);
      }
    } catch (err) {
      console.error('Error loading scheme:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent, targetStatus?: SchemeStatus) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    const payload = {
      ...formData,
      status: targetStatus || formData.status || 'DRAFT',
    };

    try {
      if (isEditMode) {
        const res = await adminService.updateScheme(Number(id), payload);
        if (res.success) {
          setAlert({ type: 'success', message: 'Scheme updated successfully!' });
          setTimeout(() => navigate('/admin/schemes'), 1000);
        }
      } else {
        const res = await adminService.createScheme(payload);
        if (res.success) {
          setAlert({ type: 'success', message: 'Scheme created successfully!' });
          setTimeout(() => navigate('/admin/schemes'), 1000);
        }
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error saving scheme.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading scheme data..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link to="/admin/schemes" className="text-xs font-bold text-[#5E6B7D] hover:text-[#173B72] flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Schemes Management
        </Link>
        <h1 className="text-xl font-black text-[#172033]">
          {isEditMode ? 'Edit Government Scheme' : 'Add New Government Scheme'}
        </h1>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={(e) => handleSubmit(e)} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-gov space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="f-title" className="label-field">Scheme Title *</label>
            <input
              id="f-title"
              type="text"
              name="title"
              required
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="e.g. PM Formalisation of Micro Food Processing Enterprises (PMFME)"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="f-dept" className="label-field">Department *</label>
            <input
              id="f-dept"
              type="text"
              name="department"
              required
              value={formData.department || ''}
              onChange={handleChange}
              placeholder="e.g. Ministry of Food Processing Industries"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="f-min" className="label-field">Ministry (Optional)</label>
            <input
              id="f-min"
              type="text"
              name="ministry"
              value={formData.ministry || ''}
              onChange={handleChange}
              placeholder="e.g. Ministry of MSME"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="f-type" className="label-field">Scheme Type *</label>
            <select
              id="f-type"
              name="schemeType"
              value={formData.schemeType || 'Subsidy'}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Subsidy">Subsidy</option>
              <option value="Grant">Grant</option>
              <option value="Loan">Loan & Credit</option>
              <option value="Equity">Equity / Seed Fund</option>
            </select>
          </div>

          <div>
            <label htmlFor="f-state" className="label-field">State / Region *</label>
            <select
              id="f-state"
              name="state"
              value={formData.state || 'All India'}
              onChange={handleChange}
              className="input-field"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-district" className="label-field">District Scope</label>
            <input
              id="f-district"
              type="text"
              name="district"
              value={formData.district || ''}
              onChange={handleChange}
              placeholder="e.g. All Districts or Lucknow"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="f-deadline" className="label-field">Application Deadline</label>
            <input
              id="f-deadline"
              type="date"
              name="deadline"
              value={formData.deadline || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="f-sdesc" className="label-field">Short Description Summary (1-2 sentences)</label>
          <input
            id="f-sdesc"
            type="text"
            name="shortDescription"
            value={formData.shortDescription || ''}
            onChange={handleChange}
            placeholder="Provides 35% credit-linked capital subsidy up to ₹10 Lakh..."
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="f-desc" className="label-field">Detailed Scheme Description *</label>
          <textarea
            id="f-desc"
            name="description"
            rows={4}
            required
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Provide complete scheme objective and background details..."
            className="input-field"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="f-benefits" className="label-field">Financial Benefits & Incentives</label>
            <textarea
              id="f-benefits"
              name="benefits"
              rows={3}
              value={formData.benefits || ''}
              onChange={handleChange}
              placeholder="35% Capital subsidy, seed capital of ₹40,000..."
              className="input-field"
            ></textarea>
          </div>

          <div>
            <label htmlFor="f-elig" className="label-field">Eligibility Criteria</label>
            <textarea
              id="f-elig"
              name="eligibility"
              rows={3}
              value={formData.eligibility || ''}
              onChange={handleChange}
              placeholder="Micro enterprises, SHGs, minimum age 18 years..."
              className="input-field"
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="f-docs" className="label-field">Required Documents</label>
            <textarea
              id="f-docs"
              name="requiredDocuments"
              rows={3}
              value={formData.requiredDocuments || ''}
              onChange={handleChange}
              placeholder="PAN, Aadhaar, UDYAM Certificate, DPR..."
              className="input-field"
            ></textarea>
          </div>

          <div>
            <label htmlFor="f-process" className="label-field">Application Process Steps</label>
            <textarea
              id="f-process"
              name="applicationProcess"
              rows={3}
              value={formData.applicationProcess || ''}
              onChange={handleChange}
              placeholder="Submit online DPR via portal followed by bank appraisal..."
              className="input-field"
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="f-appurl" className="label-field">Direct Application Page URL (Optional)</label>
            <input
              id="f-appurl"
              type="url"
              name="officialApplicationUrl"
              value={formData.officialApplicationUrl || ''}
              onChange={handleChange}
              placeholder="https://pmfme.mofpi.gov.in/apply"
              className="input-field"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Direct application form/login URL. Leave blank if only official website info exists.
            </p>
          </div>

          <div>
            <label htmlFor="f-srcurl" className="label-field">Official Government Website URL</label>
            <input
              id="f-srcurl"
              type="url"
              name="officialSourceUrl"
              value={formData.officialSourceUrl || ''}
              onChange={handleChange}
              placeholder="https://mofpi.gov.in"
              className="input-field"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Official scheme detail or ministry information page URL.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="f-ind" className="label-field">Target Industries (Comma-separated for recommendations)</label>
            <input
              id="f-ind"
              type="text"
              name="targetIndustries"
              value={formData.targetIndustries || ''}
              onChange={handleChange}
              placeholder="Food Processing, Manufacturing, Agriculture"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="f-biztypes" className="label-field">Target Business Types (Comma-separated)</label>
            <input
              id="f-biztypes"
              type="text"
              name="targetBusinessTypes"
              value={formData.targetBusinessTypes || ''}
              onChange={handleChange}
              placeholder="MSME, Proprietorship, Partnership, Private Limited"
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
            Mark as Featured Scheme on Homepage
          </label>
        </div>

        {/* Form Action Buttons */}
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
            {saving ? 'Publishing...' : 'Save & Publish Scheme Live'}
          </button>
        </div>
      </form>
    </div>
  );
};
