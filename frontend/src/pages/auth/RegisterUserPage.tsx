import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../../components/Alert';
import { User, Mail, Lock, Phone, UserPlus, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const RegisterUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.register({
        fullName,
        email,
        password,
        phone,
        role: 'ROLE_CITIZEN',
      });

      if (res.success && res.data) {
        const authData = res.data;
        login(authData.accessToken, {
          id: authData.id,
          fullName: authData.fullName,
          email: authData.email,
          role: authData.role,
          active: true,
        });

        navigate('/schemes');
      }
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to backend server. Please ensure the Spring Boot backend is running on port 8080.');
      } else if (err.response.data?.data && typeof err.response.data.data === 'object') {
        const fieldErrors = Object.values(err.response.data.data).join('. ');
        setError(fieldErrors || err.response.data.message || 'Registration failed.');
      } else {
        setError(err.response.data?.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12 relative"
      style={{
        backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#173B72]/80 via-[#F5F7FA]/90 to-[#F5F7FA]/95 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-md space-y-6 bg-white/95 p-8 rounded-3xl border border-slate-200 shadow-gov-lg">
        {/* Account Type Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-1.5">
          <button
            type="button"
            className="flex-1 py-2 text-xs font-extrabold rounded-xl bg-[#173B72] text-white shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>👤</span> Citizen / Individual
          </button>
          <button
            type="button"
            onClick={() => navigate('/register/business')}
            className="flex-1 py-2 text-xs font-bold rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🏢</span> Business / MSME
          </button>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#173B72] border border-[#C89B3C]/50 flex items-center justify-center text-white font-bold mx-auto shadow-sm">
            <User className="w-6 h-6 text-[#C89B3C]" />
          </div>
          <div className="text-[11px] font-bold text-[#173B72] uppercase tracking-wider">
            Citizen & Individual Access
          </div>
          <h1 className="text-2xl font-black text-[#172033]">Citizen User Registration</h1>
          <p className="text-xs text-[#5E6B7D]">Create an account to bookmark, search, and track government schemes and subsidies</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="user-name" className="label-field">
              Full Name
            </label>
            <div className="relative">
              <User className="input-leading-icon" />
              <input
                id="user-name"
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field has-left-icon"
              />
            </div>
          </div>

          <div>
            <label htmlFor="user-email" className="label-field">
              Email Address
            </label>
            <div className="relative">
              <Mail className="input-leading-icon" />
              <input
                id="user-email"
                type="email"
                required
                autoComplete="email"
                placeholder="e.g. priya@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field has-left-icon"
              />
            </div>
          </div>

          <div>
            <label htmlFor="user-phone" className="label-field">
              Mobile Contact Number
            </label>
            <div className="relative">
              <Phone className="input-leading-icon" />
              <input
                id="user-phone"
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field has-left-icon"
              />
            </div>
          </div>

          <div>
            <label htmlFor="user-password" className="label-field">
              Account Password
            </label>
            <div className="relative">
              <Lock className="input-leading-icon" />
              <input
                id="user-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field has-left-icon has-right-icon"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-trailing-btn"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating Account...' : 'Register User Account'}
          </button>
        </form>

        <div className="text-center pt-1 text-xs text-[#5E6B7D]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#173B72] font-bold hover:underline inline-flex items-center gap-0.5">
            Sign In <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
