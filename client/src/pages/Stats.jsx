import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBabies } from '../api';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [babies, setBabies] = useState([]);
  const [selectedBabyId, setSelectedBabyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkBabies();
  }, []);

  const checkBabies = async () => {
    try {
      const data = await fetchBabies();
      const babyList = data.babies || [];
      setBabies(babyList);
      if (babyList.length === 1) setSelectedBabyId(babyList[0]._id);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBabyId) fetchStats();
  }, [selectedBabyId]);

  const fetchStats = async () => {
    setStatsLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const today = new Date().toISOString().split('T')[0];
      const [logRes, vaccineRes] = await Promise.all([
        fetch(`http://localhost:5000/api/logs?babyId=${selectedBabyId}&date=${today}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/vaccines?babyId=${selectedBabyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const logData = await logRes.json();
      const vaccineData = await vaccineRes.json();

      if (logData.ok && vaccineData.ok) {
        const logs = logData.logs || [];
        const feedingLogs = logs.filter((l) => l.type === 'feeding');
        const diaperLogs = logs.filter((l) => l.type === 'diaper');
        const sleepLogs = logs.filter((l) => l.type === 'sleep');

        const sleepMinutes = sleepLogs.reduce((sum, log) => {
          if (log.startTime && log.endTime) {
            return sum + (new Date(log.endTime) - new Date(log.startTime)) / 60000;
          }
          return sum;
        }, 0);

        const totalFeedingMl = feedingLogs.reduce((sum, l) => sum + (l.amount || 0), 0);

        setStats({
          feedingCount: feedingLogs.length,
          diaperCount: diaperLogs.length,
          sleepMinutes: Math.round(sleepMinutes),
          totalFeedingMl,
          vaccinesDone: vaccineData.done?.length || 0,
          vaccinesTotal: vaccineData.schedule?.length || 0,
        });
      } else {
        setError(logData.error || vaccineData.error || 'Failed to load stats');
      }
    } catch (err) {
      setError(err.message);
    }
    setStatsLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-pink-50 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>;

  if (babies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Baby Stats</h1>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600 mb-4">Add a baby first to see statistics.</p>
            <Link to="/babies/add" className="inline-flex rounded-2xl bg-pink-500 text-white px-6 py-3 font-semibold hover:bg-pink-600 transition">➕ Add Baby</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Baby Stats</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">✗ {error}</div>}

        {/* Baby Selector */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          {babies.length === 1 ? (
            <p className="text-sm text-gray-600">Baby: <strong className="text-pink-700">{babies[0].name}</strong></p>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Baby</label>
              <select
                value={selectedBabyId}
                onChange={(e) => setSelectedBabyId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Choose baby...</option>
                {babies.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {statsLoading && <p className="text-gray-600 text-center py-8">Loading stats...</p>}

        {stats && !statsLoading && (
          <>
            <p className="text-sm text-gray-500 mb-4">Today's summary — {new Date().toLocaleDateString()}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-4 text-center shadow">
                <p className="text-3xl font-bold text-pink-700">{stats.feedingCount}</p>
                <p className="text-sm text-pink-600 mt-1">🍼 Feedings</p>
                {stats.totalFeedingMl > 0 && <p className="text-xs text-pink-500">{stats.totalFeedingMl} ml total</p>}
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 text-center shadow">
                <p className="text-3xl font-bold text-blue-700">{stats.diaperCount}</p>
                <p className="text-sm text-blue-600 mt-1">💩 Diapers</p>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 text-center shadow">
                <p className="text-3xl font-bold text-purple-700">
                  {Math.floor(stats.sleepMinutes / 60)}h {stats.sleepMinutes % 60}m
                </p>
                <p className="text-sm text-purple-600 mt-1">😴 Sleep</p>
              </div>

              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 text-center shadow">
                <p className="text-3xl font-bold text-green-700">{stats.vaccinesDone}</p>
                <p className="text-sm text-green-600 mt-1">✅ Vaccines Done</p>
              </div>

              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-4 text-center shadow">
                <p className="text-3xl font-bold text-orange-700">{stats.vaccinesTotal - stats.vaccinesDone}</p>
                <p className="text-sm text-orange-600 mt-1">⏰ Vaccines Pending</p>
              </div>

              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 text-center shadow">
                <p className="text-3xl font-bold text-gray-700">{stats.feedingCount + stats.diaperCount}</p>
                <p className="text-sm text-gray-600 mt-1">📝 Total Logs</p>
              </div>
            </div>

            <button
              onClick={fetchStats}
              className="mt-6 w-full bg-white border border-pink-300 text-pink-600 font-semibold py-2 px-4 rounded-lg hover:bg-pink-50 transition"
            >
              🔄 Refresh Stats
            </button>
          </>
        )}
      </div>
    </div>
  );
}
