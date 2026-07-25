import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBaby } from '../api';

export default function AddBaby() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    dob: '',
    gender: 'female',
    bloodType: 'A+',
    birthWeightKg: '',
    heightCm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const birthWeightKg = Number(form.birthWeightKg);
      const payload = {
        name: form.name,
        dob: form.dob,
        gender: form.gender,
        bloodType: form.bloodType,
        birthWeightKg: Number.isNaN(birthWeightKg) ? undefined : birthWeightKg,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
      };

      await createBaby(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const maxDob = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-pink-50 p-4 sm:p-6">
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-pink-100 shadow-sm p-6">
        <h1 className="text-3xl font-bold text-pink-600 mb-2">Add Baby</h1>
        <p className="text-sm text-gray-500 mb-6">Create a baby profile to start tracking logs and vaccines.</p>

        {error && <div className="mb-4 rounded-xl bg-red-100 text-red-700 p-3">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-gray-700">
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-pink-300 focus:outline-none"
            />
          </label>
          <label className="block text-sm text-gray-700">
            Date of Birth
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              max={maxDob}
              required
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-pink-300 focus:outline-none"
            />
          </label>
          <label className="block text-sm text-gray-700">
            Gender
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-pink-300 focus:outline-none"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="block text-sm text-gray-700">
            Blood Type
            <select
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-pink-300 focus:outline-none"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </label>
          <label className="block text-sm text-gray-700">
            Birth Weight (kg)
            <input
              type="number"
              min="0"
              step="0.1"
              name="birthWeightKg"
              value={form.birthWeightKg}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-pink-300 focus:outline-none"
            />
          </label>
          <label className="block text-sm text-gray-700">
            Height (cm)
            <input
              type="number"
              min="0"
              name="heightCm"
              value={form.heightCm}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-pink-300 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-pink-500 text-white py-3 font-semibold hover:bg-pink-600 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Create Baby'}
          </button>
        </form>
      </div>
    </div>
  );
}
