import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Store, User, Lock, Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../lib/authContext';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
  const redirectPath = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'buyer' | 'seller'>(initialRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    business_name: '',
    craft_description: '',
    location_city: 'Karachi',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const user = await login(formData.email, formData.password);
        if (user.role === 'seller') {
          navigate('/seller/dashboard');
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirectPath);
        }
      } else {
        const user = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role,
          business_name: formData.business_name,
          craft_description: formData.craft_description,
          location_city: formData.location_city,
        });
        if (user.role === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Demo Login Helper for Testing
  const handleDemoLogin = async (demoEmail: string) => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      const u = await login(demoEmail, 'password123');
      if (u.role === 'seller') navigate('/seller/dashboard');
      else if (u.role === 'admin') navigate('/admin/dashboard');
      else navigate(redirectPath);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed demo login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          {mode === 'login' ? 'Sign In to DastKar Hub' : 'Join DastKar Hub'}
        </h1>
        <p className="text-xs text-gray-500">
          {mode === 'login'
            ? 'Access your orders, saved craft pieces, or artisan dashboard'
            : 'Create an account to support or showcase authentic Pakistani crafts'}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#EBE5DA] shadow-xs space-y-5">
        {/* Toggle Mode */}
        <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#EBE5DA] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              mode === 'login' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              mode === 'register' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Role toggle if registering */}
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`p-3 rounded-xl border text-center transition-all ${
                role === 'buyer'
                  ? 'border-[#C25E34] bg-amber-50/50 text-[#C25E34] font-bold'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              <User className="w-4 h-4 mx-auto mb-1" />
              <span>Patron / Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`p-3 rounded-xl border text-center transition-all ${
                role === 'seller'
                  ? 'border-[#C25E34] bg-amber-50/50 text-[#C25E34] font-bold'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              <Store className="w-4 h-4 mx-auto mb-1" />
              <span>Artisan / Maker</span>
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Fatima Tariq"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. patron@dastkarhub.pk"
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Password *</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
              />
            </div>
          )}

          {mode === 'register' && role === 'seller' && (
            <>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Artisan / Workshop Name *</label>
                <input
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  placeholder="e.g. Multani Kashigar Guild"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">City / Region *</label>
                <input
                  type="text"
                  required
                  value={formData.location_city}
                  onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                  placeholder="e.g. Multan, Chiniot, Peshawar"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Craft Description</label>
                <textarea
                  rows={2}
                  value={formData.craft_description}
                  onChange={(e) => setFormData({ ...formData, craft_description: e.target.value })}
                  placeholder="Describe your handmade products and materials..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#C25E34] hover:bg-[#A0441E] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Demo Fast Login Pills for evaluation */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
            One-Click Test Accounts:
          </p>
          <div className="flex flex-col gap-1.5 text-xs">
            <button
              onClick={() => handleDemoLogin('ayesha.buyer@dastkarhub.pk')}
              className="px-2.5 py-1.5 bg-[#FAF8F5] hover:bg-gray-100 rounded-lg text-left border border-gray-200 text-gray-700 flex justify-between"
            >
              <span>Patron: <strong>Ayesha Siddiqui</strong></span>
              <span className="text-gray-400">buyer</span>
            </button>
            <button
              onClick={() => handleDemoLogin('fayyaz.kashigar@dastkarhub.pk')}
              className="px-2.5 py-1.5 bg-[#FAF8F5] hover:bg-amber-50 rounded-lg text-left border border-amber-200 text-amber-900 flex justify-between"
            >
              <span>Maker: <strong>Ustad Fayyaz (Multan)</strong></span>
              <span className="text-amber-700 font-semibold">seller</span>
            </button>
            <button
              onClick={() => handleDemoLogin('admin@dastkarhub.pk')}
              className="px-2.5 py-1.5 bg-[#FAF8F5] hover:bg-purple-50 rounded-lg text-left border border-purple-200 text-purple-900 flex justify-between"
            >
              <span>Admin: <strong>Platform Operations</strong></span>
              <span className="text-purple-700 font-semibold">admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
