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
        ) : babies.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">👶 Welcome to MamaCare!</h2>
            <p className="text-gray-600 mb-6">Add your first baby to get started.</p>
            <Link to="/babies/add" className="inline-flex rounded-2xl bg-pink-500 text-white px-6 py-3 font-semibold hover:bg-pink-600 transition">
              ➕ Add Baby
            </Link>
          </div>
        ) : (
          <div>
            {/* Quick Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <Link to="/logs" className="flex flex-col items-center justify-center gap-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-3 rounded-2xl text-center transition shadow-sm">
                <span className="text-2xl">📝</span><span className="text-sm">Logs</span>
              </Link>
              <Link to="/vaccines" className="flex flex-col items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-3 rounded-2xl text-center transition shadow-sm">
                <span className="text-2xl">💉</span><span className="text-sm">Vaccines</span>
              </Link>
              <Link to="/stats" className="flex flex-col items-center justify-center gap-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-3 rounded-2xl text-center transition shadow-sm">
                <span className="text-2xl">📊</span><span className="text-sm">Stats</span>
              </Link>
              <Link to="/articles" className="flex flex-col items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-3 rounded-2xl text-center transition shadow-sm">
                <span className="text-2xl">📚</span><span className="text-sm">Articles</span>
              </Link>
              <Link to="/ai-help" className="flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-3 rounded-2xl text-center transition shadow-sm">
                <span className="text-2xl">🤖</span><span className="text-sm">AI Help</span>
              </Link>
            </div>

            {/* Baby Cards */}
            <div className="space-y-4">
              {babies.map((baby) => (
                <div key={baby._id} className="rounded-3xl bg-white p-5 shadow-sm border border-pink-100">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-pink-700">{baby.name}</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Born: {new Date(baby.dob).toLocaleDateString()}</p>
                    </div>
                    <div className="rounded-full bg-pink-100 px-3 py-1.5 text-pink-700 font-semibold text-sm whitespace-nowrap">
                      {baby.ageReadable || 'N/A'}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>⚧ {baby.gender || 'Not set'}</p>
                    <p>🩸 {baby.bloodType || 'Not set'}</p>
                    <p>⚖️ {baby.birthWeightKg != null ? `${baby.birthWeightKg.toFixed(1)} kg` : baby.birthWeight ? `${(baby.birthWeight / 1000).toFixed(1)} kg` : 'Not set'}</p>
                    <p>📏 {baby.heightCm ? `${baby.heightCm} cm` : 'Not set'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
