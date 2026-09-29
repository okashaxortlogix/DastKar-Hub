import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Store, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/authContext';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
  const redirectPath = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'buyer' | 'seller'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    business_name: '',
    craft_description: '',
    location_city: '',
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


  return (
    <div className="max-w-md mx-auto my-6 sm:my-12 px-3 sm:px-4 space-y-5 sm:space-y-6">
      <div className="text-center space-y-1.5 sm:space-y-2">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          {mode === 'login' ? 'Sign In to DastKar Hub' : 'Join DastKar Hub'}
        </h1>
        <p className="text-xs text-gray-500">
          {mode === 'login'
            ? 'Access your orders, saved craft pieces, or artisan dashboard'
            : 'Create an account to support or showcase authentic Pakistani crafts'}
        </p>
      </div>

      <div className="bg-white p-4 sm:p-7 rounded-2xl border border-[#EBE5DA] shadow-xs space-y-4 sm:space-y-5">
        {/* Toggle Mode */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Role Selector (when registering) */}
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-2 text-xs">
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
          <div role="alert" className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="font-semibold text-gray-700 block mb-1">
                Your Full Name *
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Fatima Tariq"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="font-semibold text-gray-700 block mb-1">
              Email Address *
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. patron@dastkarhub.pk"
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="auth-password" className="font-semibold text-gray-700 block">
                Password *
              </label>
              {mode === 'login' && (
                <span className="text-[11px] text-[#C25E34] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full p-2.5 pr-10 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="auth-phone" className="font-semibold text-gray-700 block mb-1">
                Phone Number (WhatsApp friendly)
              </label>
              <input
                id="auth-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
              />
            </div>
          )}

          {mode === 'register' && role === 'seller' && (
            <>
              <div>
                <label htmlFor="auth-business-name" className="font-semibold text-gray-700 block mb-1">
                  Artisan / Workshop Name *
                </label>
                <input
                  id="auth-business-name"
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  placeholder="e.g. Multani Kashigar Guild"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
                />
              </div>

              <div>
                <label htmlFor="auth-location-city" className="font-semibold text-gray-700 block mb-1">
                  City / Region *
                </label>
                <input
                  id="auth-location-city"
                  type="text"
                  required
                  value={formData.location_city}
                  onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                  placeholder="e.g. Multan, Chiniot, Peshawar"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
                />
              </div>

              <div>
                <label htmlFor="auth-craft-description" className="font-semibold text-gray-700 block mb-1">
                  Craft Description
                </label>
                <textarea
                  id="auth-craft-description"
                  rows={2}
                  value={formData.craft_description}
                  onChange={(e) => setFormData({ ...formData, craft_description: e.target.value })}
                  placeholder="Describe your handmade products and materials..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#C25E34] hover:bg-[#A0441E] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

      </div>
    </div>
  );
};
