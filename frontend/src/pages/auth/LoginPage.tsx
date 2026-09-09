import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../../components/Alert';
import { Building2, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold mx-auto shadow-md">
            <Building2 className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Sign in to BizSahayak</h2>
          <p className="text-xs text-slate-500">Access your business profile, scheme recommendations, and saved items</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="e.g. admin@bizsahayak.in or business@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="label-field">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm font-bold bg-blue-600 hover:bg-blue-700 mt-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
          <span className="font-bold text-slate-800 block uppercase text-[10px] tracking-wider">Default Test Credentials:</span>
          <div className="flex justify-between items-center text-slate-600">
            <span><strong>Admin:</strong> admin@bizsahayak.in</span>
            <span className="font-mono bg-white px-1.5 py-0.5 rounded border">Admin@123456</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span><strong>Verified Business:</strong> business@demo.com</span>
            <span className="font-mono bg-white px-1.5 py-0.5 rounded border">Demo@123456</span>
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-slate-600">
          Don't have a business account?{' '}
          <Link to="/register/business" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5">
            Register Business Profile <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
