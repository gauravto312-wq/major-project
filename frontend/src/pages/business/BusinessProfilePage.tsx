import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessService } from '../../services/businessService';
import { BusinessProfile } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { Badge } from '../../components/Badge';
import { Building2, Save, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

const INDIAN_STATES = [
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

export const BusinessProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<BusinessProfile>>({
    businessName: '',
    businessType: 'MSME',
    industry: 'Food Processing',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    businessEmail: '',
    phone: '',
    website: '',
    businessDescription: '',
    turnoverRange: '₹10 Lakh - ₹50 Lakh',
    investmentRange: '₹10 Lakh - ₹50 Lakh',
    employeeCount: '1-10',
  });

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await businessService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setFormData(res.data);
      }
    } catch (err) {
      // Profile not created yet
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      const res = await businessService.saveProfile(formData);
      if (res.success) {
        setProfile(res.data);
        setAlert({ type: 'success', message: 'Business profile saved successfully!' });
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error saving profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitVerification = async () => {
    setSaving(true);
    setAlert(null);
    try {
      const res = await businessService.submitVerification();
      if (res.success) {
        setProfile(res.data);
        setAlert({ type: 'success', message: 'Your business profile was submitted to Admin for verification!' });
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error submitting for verification.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading enterprise profile metrics..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-gov">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#172033]">Enterprise Profile</h1>
            {profile && <Badge status={profile.verificationStatus} />}
          </div>
          <p className="text-xs text-[#5E6B7D]">Provide accurate enterprise metrics for customized scheme recommendations</p>
        </div>

        {profile && (profile.verificationStatus === 'NOT_SUBMITTED' || profile.verificationStatus === 'CORRECTION_REQUIRED') && (
          <button
            type="button"
            onClick={handleSubmitVerification}
            disabled={saving}
            className="btn-accent text-xs py-2.5 px-4 font-bold"
          >
            <Send className="w-4 h-4" />
            Submit for Admin Verification
          </button>
        )}
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-gov space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-[#173B72] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#173B72]" />
            Enterprise Identification
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-businessName" className="label-field">Business / Enterprise Name *</label>
            <input
              id="field-businessName"
              type="text"
              name="businessName"
              required
              value={formData.businessName || ''}
              onChange={handleChange}
              placeholder="e.g. Apex Food Products Ltd"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="field-businessType" className="label-field">Entity Type *</label>
            <select
              id="field-businessType"
              name="businessType"
              value={formData.businessType || 'MSME'}
              onChange={handleChange}
              className="input-field"
            >
              <option value="MSME">MSME</option>
              <option value="Proprietorship">Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="Private Limited">Private Limited</option>
              <option value="LLP">LLP</option>
              <option value="Individual Enterprise">Individual Enterprise</option>
            </select>
          </div>

          <div>
            <label htmlFor="field-industry" className="label-field">Industry Sector *</label>
            <select
              id="field-industry"
              name="industry"
              value={formData.industry || 'Food Processing'}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Food Processing">Food Processing & Agriculture</option>
              <option value="Manufacturing">Manufacturing & Engineering</option>
              <option value="IT Services">IT, Software & Technology</option>
              <option value="Textile">Textile & Handloom</option>
              <option value="Solar & Renewable Energy">Solar & Renewable Energy</option>
              <option value="Healthcare & Pharma">Healthcare & Pharma</option>
              <option value="Services">Other Services</option>
            </select>
          </div>

          <div>
            <label htmlFor="field-state" className="label-field">State *</label>
            <select
              id="field-state"
              name="state"
              value={formData.state || 'Uttar Pradesh'}
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
            <label htmlFor="field-district" className="label-field">District *</label>
            <input
              id="field-district"
              type="text"
              name="district"
              required
              value={formData.district || ''}
              onChange={handleChange}
              placeholder="e.g. Lucknow"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="field-businessEmail" className="label-field">Business Email</label>
            <input
              id="field-businessEmail"
              type="email"
              name="businessEmail"
              value={formData.businessEmail || ''}
              onChange={handleChange}
              placeholder="contact@company.com"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="field-phone" className="label-field">Contact Phone</label>
            <input
              id="field-phone"
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="9876543210"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="field-website" className="label-field">Website URL (Optional)</label>
            <input
              id="field-website"
              type="url"
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
              placeholder="https://company.com"
              className="input-field"
            />
          </div>
        </div>

        <div className="border-b border-slate-100 pb-4 pt-4">
          <h2 className="text-base font-bold text-[#173B72]">Financial & Employee Metrics</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="field-turnover" className="label-field">Turnover Range</label>
            <select
              id="field-turnover"
              name="turnoverRange"
              value={formData.turnoverRange || 'Below ₹10 Lakh'}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Below ₹10 Lakh">Below ₹10 Lakh</option>
              <option value="₹10 Lakh - ₹50 Lakh">₹10 Lakh - ₹50 Lakh</option>
              <option value="₹50 Lakh - ₹1 Crore">₹50 Lakh - ₹1 Crore</option>
              <option value="₹1 Crore - ₹5 Crore">₹1 Crore - ₹5 Crore</option>
              <option value="Above ₹5 Crore">Above ₹5 Crore</option>
            </select>
          </div>

          <div>
            <label htmlFor="field-investment" className="label-field">Investment Range</label>
            <select
              id="field-investment"
              name="investmentRange"
              value={formData.investmentRange || 'Below ₹10 Lakh'}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Below ₹10 Lakh">Below ₹10 Lakh</option>
              <option value="₹10 Lakh - ₹50 Lakh">₹10 Lakh - ₹50 Lakh</option>
              <option value="₹50 Lakh - ₹2 Crore">₹50 Lakh - ₹2 Crore</option>
              <option value="Above ₹2 Crore">Above ₹2 Crore</option>
            </select>
          </div>

          <div>
            <label htmlFor="field-employeeCount" className="label-field">Employee Count</label>
            <select
              id="field-employeeCount"
              name="employeeCount"
              value={formData.employeeCount || '1-10'}
              onChange={handleChange}
              className="input-field"
            >
              <option value="1-10">1-10 Employees</option>
              <option value="11-50">11-50 Employees</option>
              <option value="51-200">51-200 Employees</option>
              <option value="200+">200+ Employees</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="field-description" className="label-field">Business Description</label>
          <textarea
            id="field-description"
            name="businessDescription"
            rows={3}
            value={formData.businessDescription || ''}
            onChange={handleChange}
            placeholder="Describe your manufacturing, processing or service operations..."
            className="input-field"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary text-xs py-2.5 px-6 font-bold">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
