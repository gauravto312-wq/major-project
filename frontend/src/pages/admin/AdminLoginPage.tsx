import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../../components/Alert';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        const authData = res.data;
        if (authData.role !== 'ROLE_ADMIN') {
          setError('Access Denied: Only authorized administrators can access this terminal.');
          return;
        }
        login(authData.accessToken, {
          id: authData.id,
          fullName: authData.fullName,
          email: authData.email,
          role: authData.role,
          active: true,
        });
        navigate('/admin');
      }
    } catch (err: any) {
      if (!err.response) {
        setError('Backend server is unreachable. Please verify Spring Boot is running on port 8080.');
      } else {
        setError(err.response?.data?.message || 'Authentication failed. Please verify admin credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 sm:px-6 py-12 relative">
      <div className="relative z-10 max-w-md w-full space-y-6 bg-white/95 backdrop-blur-sm p-8 rounded-2xl border border-[#C89B3C]/40 shadow-gov-lg">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#173B72] text-[#C89B3C] border border-[#C89B3C]/50 mb-1 shadow-sm">
            <ShieldCheck className="w-7 h-7 text-[#C89B3C]" />
          </div>
          <span className="text-[11px] font-bold text-[#173B72] uppercase tracking-widest block">
            Restricted Administration Gateway
          </span>
          <h1 className="text-2xl font-black tracking-tight text-[#172033]">Admin System Login</h1>
          <p className="text-xs text-[#5E6B7D]">Authorized government administrators and content managers only</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="admin-email" className="label-field">
              Admin Email Address *
            </label>
            <div className="relative">
              <Mail className="input-leading-icon" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field has-left-icon font-mono"
                placeholder="admin@bizsahayak.in"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="label-field">
              Admin Security Password *
            </label>
            <div className="relative">
              <Lock className="input-leading-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field has-left-icon has-right-icon font-mono"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="input-trailing-btn"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm font-bold bg-[#173B72] hover:bg-[#2456A6] mt-2 border border-[#C89B3C]/40"
          >
            <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
            {loading ? 'Authenticating System...' : 'Access Admin Gateway'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs">
          <Link to="/" className="text-[#173B72] hover:underline font-semibold inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Platform
          </Link>
        </div>
      </div>
    </div>
  );
};
