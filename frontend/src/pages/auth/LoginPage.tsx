import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../../components/Alert';
import { Building2, Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        const authData = res.data;
        login(authData.accessToken, {
          id: authData.id,
          fullName: authData.fullName,
          email: authData.email,
          role: authData.role,
          active: true,
        });

        // Redirect based on role
        if (authData.role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else if (authData.role === 'ROLE_BUSINESS') {
          navigate('/business/dashboard');
        } else {
          navigate(from);
        }
      }
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to backend server. Please ensure the Spring Boot backend is running on port 8080.');
      } else {
        const msg = err.response?.data?.message || 'Invalid email or password. Please check your credentials.';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 sm:px-6 py-12 relative">
      <div className="w-full max-w-md space-y-6 bg-white/95 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/90 shadow-gov-lg">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#173B72] border border-[#C89B3C]/50 flex items-center justify-center text-white font-bold mx-auto shadow-sm">
            <Building2 className="w-6 h-6 text-[#C89B3C]" />
          </div>
          <div className="text-[11px] font-bold text-[#173B72] uppercase tracking-wider">
            Official Access Portal
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">Sign in to BizSahayak</h1>
          <p className="text-xs text-[#5E6B7D] leading-relaxed">
            Access your registered business profile, personalized scheme recommendations, and application tracker
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="label-field">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                required
                autoComplete="username"
                placeholder="name@business.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field has-left-icon"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="label-field !mb-0">
                Password *
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field has-left-icon has-right-icon"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#173B72] transition-colors focus:outline-none focus:ring-2 focus:ring-[#173B72] rounded cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm font-bold bg-[#173B72] hover:bg-[#2456A6] mt-2 border border-[#173B72] shadow-gov"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-[#5E6B7D] space-y-2">
          <div>
            Don't have a business account?{' '}
            <Link
              to="/register/business"
              className="text-[#173B72] font-bold hover:text-[#2456A6] hover:underline inline-flex items-center gap-1"
            >
              Register Business Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-[#173B72] text-[11px] font-medium transition-colors"
            >
              Administrative Gateway →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
