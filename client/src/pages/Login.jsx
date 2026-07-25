import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(form);
      localStorage.setItem('token', data.token);
      if (onLogin) {
        onLogin(data.token);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-pink-100 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-pink-600 mb-2">Login</h1>
        <p className="text-sm text-gray-500 mb-6">Welcome back! Enter your credentials to continue.</p>

        {error && <div className="mb-4 rounded-xl bg-red-100 text-red-700 p-3">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-gray-700">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-pink-300 focus:outline-none"
            />
          </label>
          <label className="block text-sm text-gray-700">
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-pink-300 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-pink-500 text-white py-3 font-semibold hover:bg-pink-600 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account? <button type="button" onClick={() => navigate('/register')} className="font-semibold text-pink-600">Register</button>
        </p>
      </div>
    </div>
  );
}
