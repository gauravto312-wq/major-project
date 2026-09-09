import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowLeft, Building2 } from 'lucide-react';
import { Alert } from '../../components/Alert';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@bizsahayak.in');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        const authData = res.data;
        if (authData.role !== 'ROLE_ADMIN') {
          setError('Access Denied: This portal is reserved exclusively for system administrators. Business and User accounts cannot log in here.');
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
      setError(err.response?.data?.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
      <div className="max-w-md w-full space-y-8 bg-slate-800/90 p-8 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-2">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest block">Restricted Administration Gateway</span>
          <h2 className="text-2xl font-black tracking-tight text-white">Admin System Login</h2>
          <p className="text-xs text-slate-400">Authorized government administrators and content managers only</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {/* Demo Credentials Box */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-blue-500/30 text-xs text-slate-300 space-y-1">
          <div className="font-bold text-blue-400 text-[11px] uppercase tracking-wider">Default Admin Credentials</div>
          <div className="flex justify-between font-mono text-[11px]">
            <span className="text-slate-400">Email:</span>
            <span className="text-white font-bold">admin@bizsahayak.in</span>
          </div>
          <div className="flex justify-between font-mono text-[11px]">
            <span className="text-slate-400">Password:</span>
            <span className="text-white font-bold">Admin@123456</span>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                placeholder="admin@bizsahayak.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Security Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            {loading ? 'Authenticating Admin...' : 'Log In to Admin Portal'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <Link to="/" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Public Home
          </Link>
          <Link to="/login" className="hover:text-blue-400 text-slate-400 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" /> Business User Login
          </Link>
        </div>
      </div>
    </div>
  );
};
