import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBabies } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [babies, setBabies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBabies = async () => {
      try {
        const data = await fetchBabies();
        setBabies(data.babies || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadBabies();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">MamaCare Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage babies, logs, and vaccine schedules.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/babies/add" className="rounded-2xl bg-pink-500 text-white px-4 py-3 font-semibold hover:bg-pink-600">Add Baby</Link>
            <button onClick={logout} className="rounded-2xl border border-pink-300 px-4 py-3 text-pink-700 hover:bg-pink-100">Logout</button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-xl bg-red-100 text-red-700 p-4">{error}</div>}

        {loading ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm">Loading babies...</div>
        ) : (
          <div className="space-y-4">
            {babies.length === 0 ? (
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-gray-700">No babies added yet.</p>
                <Link to="/babies/add" className="mt-4 inline-flex rounded-2xl bg-pink-500 text-white px-4 py-3 font-semibold hover:bg-pink-600">Add your first baby</Link>
              </div>
            ) : (
              babies.map((baby) => (
                <div key={baby._id} className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-semibold text-pink-700">{baby.name}</h2>
                      <p className="text-gray-500">DOB: {new Date(baby.dob).toLocaleDateString()}</p>
                    </div>
                    <div className="rounded-full bg-pink-100 px-4 py-2 text-pink-700 font-semibold">Age: {baby.ageReadable || 'N/A'}</div>
                  </div>
                  <p className="mt-4 text-gray-600">Gender: {baby.gender}</p>
                  <p className="mt-2 text-gray-600">Blood Type: {baby.bloodType || 'Not set'}</p>
                  <p className="mt-2 text-gray-600">
                    Birth Weight: {baby.birthWeightKg != null ? `${baby.birthWeightKg.toFixed(1).replace(/\.0$/, '')} kg` : baby.birthWeight ? `${(baby.birthWeight / 1000).toFixed(1).replace(/\.0$/, '')} kg` : 'Not set'}
                  </p>
                  <p className="mt-2 text-gray-600">Height: {baby.heightCm ? `${baby.heightCm} cm` : 'Not set'}</p>
                  <p className="mt-2 text-gray-600">Head circumference: {baby.headCircumferenceCm ? `${baby.headCircumferenceCm} cm` : 'Not set'}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
