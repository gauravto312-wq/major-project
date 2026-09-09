import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businessService } from '../../services/businessService';
import { recommendationService } from '../../services/recommendationService';
import { BusinessProfile, RecommendationResponse } from '../../types';
import { Badge } from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { RecommendationCard } from '../../components/RecommendationCard';
import { Alert } from '../../components/Alert';
import {
  Building2,
  CheckCircle2,
  FileText,
  Sparkles,
  Bookmark,
  AlertTriangle,
  Upload,
  ArrowRight,
} from 'lucide-react';

export const BusinessDashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingVerif, setSubmittingVerif] = useState(false);
  const [verifMessage, setVerifMessage] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const profRes = await businessService.getProfile();
      if (profRes.success) {
        setProfile(profRes.data);
      }

      const recRes = await recommendationService.getRecommendedSchemes();
      if (recRes.success) {
        setRecommendations(recRes.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Error loading business dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestVerification = async () => {
    setSubmittingVerif(true);
    try {
      const res = await businessService.submitVerification();
      if (res.success) {
        setProfile(res.data);
        setVerifMessage('Your business profile has been submitted for admin verification!');
      }
    } catch (err: any) {
      setVerifMessage(err.response?.data?.message || 'Please complete your business profile and upload documents before submitting.');
    } finally {
      setSubmittingVerif(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading business dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {verifMessage && (
        <Alert type="info" message={verifMessage} onClose={() => setVerifMessage(null)} />
      )}

      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Business Portal</span>
            {profile && <Badge status={profile.verificationStatus} />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Hello, {profile?.businessName || 'Business Owner'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Industry: <span className="font-semibold text-white">{profile?.industry || 'Not Set'}</span> • Region: <span className="font-semibold text-white">{profile?.state || 'Not Set'}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {profile?.verificationStatus === 'NOT_SUBMITTED' || profile?.verificationStatus === 'CORRECTION_REQUIRED' ? (
            <button
              onClick={handleRequestVerification}
              disabled={submittingVerif}
              className="btn-primary py-2.5 px-5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submittingVerif ? 'Submitting...' : 'Submit for Admin Verification'}
            </button>
          ) : (
            <Link to="/business/profile" className="btn-secondary py-2.5 px-4 text-xs font-bold bg-white/10 hover:bg-white/20 text-white border-white/30">
              Edit Business Profile
            </Link>
          )}
        </div>
      </div>

      {/* Verification Warning Box if Rejected / Correction Required */}
      {profile?.verificationStatus === 'CORRECTION_REQUIRED' && (
        <div className="bg-amber-50 border border-amber-300 p-5 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-amber-900 text-sm">Action Required: Correction Requested by Admin</h3>
            <p className="text-amber-800 leading-relaxed">{profile.rejectionReason}</p>
            <div className="pt-2">
              <Link to="/business/documents" className="btn-primary text-xs py-1.5 px-3 bg-amber-600 hover:bg-amber-700">
                Update Business Documents
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/business/profile"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Business Profile</h3>
            <p className="text-xs text-slate-500">Update enterprise type, turnover & investment specs.</p>
          </div>
          <span className="text-xs font-bold text-blue-600 mt-4 inline-flex items-center gap-1">
            Manage Profile <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/business/documents"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Document Vault</h3>
            <p className="text-xs text-slate-500">Upload GST, UDYAM, PAN & financial certificates.</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-4 inline-flex items-center gap-1">
            Upload Files <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/business/recommendations"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Recommendations</h3>
            <p className="text-xs text-slate-500">Rule-based scheme & tender matching algorithm.</p>
          </div>
          <span className="text-xs font-bold text-amber-600 mt-4 inline-flex items-center gap-1">
            View Matches <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/business/applications"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">My Applications</h3>
            <p className="text-xs text-slate-500">Track application preparation & submission notes.</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 mt-4 inline-flex items-center gap-1">
            Tracker <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Top Recommended Opportunities Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900">Top Recommended Schemes For Your Business</h2>
            <p className="text-xs text-slate-500">Calculated based on your verified business profile parameters</p>
          </div>
          <Link to="/business/recommendations" className="btn-secondary text-xs">
            View All Recommendations
          </Link>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => (
              <RecommendationCard key={idx} recommendation={rec} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            Complete your Business Profile to calculate rule-based scheme recommendations.
          </div>
        )}
      </div>
    </div>
  );
};
