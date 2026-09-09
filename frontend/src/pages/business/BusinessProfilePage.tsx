import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessService } from '../../services/businessService';
import { BusinessProfile } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { Badge } from '../../components/Badge';
import { Building2, Save, Send, CheckCircle2 } from 'lucide-react';

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
    return <LoadingSpinner message="Loading business profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Business Profile</h1>
            {profile && <Badge status={profile.verificationStatus} />}
          </div>
          <p className="text-xs text-slate-500">Provide accurate enterprise metrics for customized scheme recommendations</p>
        </div>

        {profile && (profile.verificationStatus === 'NOT_SUBMITTED' || profile.verificationStatus === 'CORRECTION_REQUIRED') && (
          <button
            onClick={handleSubmitVerification}
            disabled={saving}
            className="btn-primary text-xs py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
          >
            <Send className="w-4 h-4" />
            Submit for Admin Verification
          </button>
        )}
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Enterprise Identification
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Business / Enterprise Name *</label>
            <input
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
            <label className="label-field">Entity Type *</label>
            <select name="businessType" value={formData.businessType || 'MSME'} onChange={handleChange} className="input-field">
              <option value="MSME">MSME</option>
              <option value="Proprietorship">Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="Private Limited">Private Limited</option>
              <option value="LLP">LLP</option>
              <option value="Individual Enterprise">Individual Enterprise</option>
            </select>
          </div>

          <div>
            <label className="label-field">Industry Sector *</label>
            <select name="industry" value={formData.industry || 'Food Processing'} onChange={handleChange} className="input-field">
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
            <label className="label-field">State *</label>
            <select name="state" value={formData.state || 'Uttar Pradesh'} onChange={handleChange} className="input-field">
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>

          <div>
            <label className="label-field">District *</label>
            <input
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
            <label className="label-field">Business Email</label>
            <input
              type="email"
              name="businessEmail"
              value={formData.businessEmail || ''}
              onChange={handleChange}
              placeholder="contact@company.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Contact Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="9876543210"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Website URL (Optional)</label>
            <input
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
          <h2 className="text-base font-bold text-slate-900">Financial & Employee Metrics</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label-field">Turnover Range</label>
            <select name="turnoverRange" value={formData.turnoverRange || 'Below ₹10 Lakh'} onChange={handleChange} className="input-field">
              <option value="Below ₹10 Lakh">Below ₹10 Lakh</option>
              <option value="₹10 Lakh - ₹50 Lakh">₹10 Lakh - ₹50 Lakh</option>
              <option value="₹50 Lakh - ₹1 Crore">₹50 Lakh - ₹1 Crore</option>
              <option value="₹1 Crore - ₹5 Crore">₹1 Crore - ₹5 Crore</option>
              <option value="Above ₹5 Crore">Above ₹5 Crore</option>
            </select>
          </div>

          <div>
            <label className="label-field">Investment Range</label>
            <select name="investmentRange" value={formData.investmentRange || 'Below ₹10 Lakh'} onChange={handleChange} className="input-field">
              <option value="Below ₹10 Lakh">Below ₹10 Lakh</option>
              <option value="₹10 Lakh - ₹50 Lakh">₹10 Lakh - ₹50 Lakh</option>
              <option value="₹50 Lakh - ₹2 Crore">₹50 Lakh - ₹2 Crore</option>
              <option value="Above ₹2 Crore">Above ₹2 Crore</option>
            </select>
          </div>

          <div>
            <label className="label-field">Employee Count</label>
            <select name="employeeCount" value={formData.employeeCount || '1-10'} onChange={handleChange} className="input-field">
              <option value="1-10">1-10 Employees</option>
              <option value="11-50">11-50 Employees</option>
              <option value="51-200">51-200 Employees</option>
              <option value="200+">200+ Employees</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label-field">Business Description</label>
          <textarea
            name="businessDescription"
            rows={3}
            value={formData.businessDescription || ''}
            onChange={handleChange}
            placeholder="Describe your manufacturing, processing or service operations..."
            className="input-field"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary text-sm py-2.5 px-6 font-bold">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
