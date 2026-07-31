import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

const validate = ({ name, email, password }) => {
  if (!name.trim() || name.trim().length < 2) return 'Name must be at least 2 characters';
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/dashboard');
  }, [navigate]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    if (error) setError(''); // clear error on edit
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate(form);
    if (validationError) { setError(validationError); return; }
    setError('');
    setLoading(true);
    try {
      const data = await registerUser(form);
      localStorage.setItem('token', data.token);
      if (onLogin) onLogin(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-pink-100 shadow-md p-6">
        <div className="text-center mb-6">
          <p className="text-4xl mb-2">👶</p>
          <h1 className="text-2xl font-bold text-pink-600">Create account</h1>
          <p className="text-sm text-gray-400 mt-1">Start tracking your baby with MamaCare</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 text-sm flex gap-2">
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Sara Ahmed"
              className={`w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 ${error && !form.name.trim() ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="sara@example.com"
              className={`w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 ${error && !form.email.trim() ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className={`w-full rounded-2xl border px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-300 ${error && form.password.length < 6 ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              <button type="button" onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-pink-500 text-white py-3 font-semibold hover:bg-pink-600 disabled:opacity-60 transition mt-2"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <button type="button" onClick={() => navigate('/login')} className="font-semibold text-pink-600">Login</button>
        </p>
      </div>
    </div>
  );
}
