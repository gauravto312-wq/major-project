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
  ShieldCheck,
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
    return <LoadingSpinner message="Loading enterprise dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {verifMessage && (
        <Alert type="info" message={verifMessage} onClose={() => setVerifMessage(null)} />
      )}

      {/* Top Welcome Banner with Vidhan Bhawan Visual Identity */}
      <div
        className="relative rounded-3xl p-6 sm:p-8 text-white shadow-gov-lg overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#173B72]"
        style={{
          backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#173B72]/95 via-[#173B72]/90 to-[#0F264A]/95 backdrop-blur-[1px]"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1B8354]" /> Verified Enterprise Workspace
            </span>
            {profile && <Badge status={profile.verificationStatus} />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Hello, {profile?.businessName || 'Enterprise Owner'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F7FA]/90">
            Industry: <span className="font-semibold text-white">{profile?.industry || 'Not Set'}</span> • Region: <span className="font-semibold text-white">{profile?.state || 'Not Set'}</span>
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          {profile?.verificationStatus === 'NOT_SUBMITTED' || profile?.verificationStatus === 'CORRECTION_REQUIRED' ? (
            <button
              type="button"
              onClick={handleRequestVerification}
              disabled={submittingVerif}
              className="btn-accent py-2.5 px-5 text-xs font-bold"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submittingVerif ? 'Submitting...' : 'Submit for Admin Verification'}
            </button>
          ) : (
            <Link
              to="/business/profile"
              className="btn-secondary py-2.5 px-4 text-xs font-bold bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              Edit Business Profile
            </Link>
          )}
        </div>
      </div>

      {/* Verification Warning Box if Rejected / Correction Required */}
      {profile?.verificationStatus === 'CORRECTION_REQUIRED' && (
        <div className="bg-[#FEF7E6] border border-[#F8D88E] p-5 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-[#B7791F] flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-[#B7791F] text-sm">Action Required: Correction Requested by Admin</h3>
            <p className="text-slate-700 leading-relaxed">{profile.rejectionReason}</p>
            <div className="pt-2">
              <Link to="/business/documents" className="btn-primary text-xs py-1.5 px-3">
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
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-gov hover:border-[#173B72] hover:shadow-gov-md transition-all flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5EEF9] text-[#173B72] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#173B72]">Business Profile</h3>
            <p className="text-xs text-[#5E6B7D]">Update enterprise type, turnover & investment specs.</p>
          </div>
          <span className="text-xs font-bold text-[#173B72] mt-4 inline-flex items-center gap-1">
            Manage Profile <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link
          to="/business/documents"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-gov hover:border-[#1B8354] hover:shadow-gov-md transition-all flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF7F0] text-[#1B8354] flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#1B8354]">Document Vault</h3>
            <p className="text-xs text-[#5E6B7D]">Upload GST, UDYAM, PAN & financial certificates.</p>
          </div>
          <span className="text-xs font-bold text-[#1B8354] mt-4 inline-flex items-center gap-1">
            Upload Files <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link
          to="/business/recommendations"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-gov hover:border-[#C89B3C] hover:shadow-gov-md transition-all flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF7E6] text-[#B7791F] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#C89B3C]" />
            </div>
            <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#B7791F]">Recommendations</h3>
            <p className="text-xs text-[#5E6B7D]">Rule-based scheme & tender matching algorithm.</p>
          </div>
          <span className="text-xs font-bold text-[#B7791F] mt-4 inline-flex items-center gap-1">
            View Matches <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link
          to="/business/applications"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-gov hover:border-[#2456A6] hover:shadow-gov-md transition-all flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5EEF9] text-[#2456A6] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#172033] group-hover:text-[#2456A6]">My Applications</h3>
            <p className="text-xs text-[#5E6B7D]">Track application preparation & submission notes.</p>
          </div>
          <span className="text-xs font-bold text-[#2456A6] mt-4 inline-flex items-center gap-1">
            Tracker <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </div>

      {/* Top Recommended Opportunities Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-[#172033]">Top Recommended Schemes For Your Business</h2>
            <p className="text-xs text-[#5E6B7D]">Calculated based on your verified business profile parameters</p>
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
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-[#5E6B7D] shadow-gov">
            Complete your Business Profile to calculate rule-based scheme recommendations.
          </div>
        )}
      </div>
    </div>
  );
};
