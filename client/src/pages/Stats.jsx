import React, { useState, useEffect } from 'react';

export default function Stats() {
  const [stats, setStats] = useState({
    feedingCount: 0,
    diaperCount: 0,
    sleepMinutes: 0,
    vaccinesDone: 0,
    vaccinesUpcoming: 0,
  });
  const [babyId, setBabyId] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!babyId) return;
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`http://localhost:5000/api/logs?babyId=${babyId}&date=${today}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const logData = await res.json();

      const res2 = await fetch(`http://localhost:5000/api/vaccines?babyId=${babyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const vaccineData = await res2.json();

      if (logData.ok && vaccineData.ok) {
        const logs = logData.logs || [];
        const feedingCount = logs.filter((l) => l.type === 'feeding').length;
        const diaperCount = logs.filter((l) => l.type === 'diaper').length;
        const sleepLogs = logs.filter((l) => l.type === 'sleep');
        const sleepMinutes = sleepLogs.reduce((sum, log) => {
          if (log.startTime && log.endTime) {
            const start = new Date(log.startTime);
            const end = new Date(log.endTime);
            return sum + (end - start) / 60000;
          }
          return sum;
        }, 0);

        setStats({
          feedingCount,
          diaperCount,
          sleepMinutes: Math.round(sleepMinutes),
          vaccinesDone: vaccineData.done?.length || 0,
          vaccinesUpcoming: vaccineData.schedule?.length - (vaccineData.done?.length || 0) || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (babyId) fetchStats();
  }, [babyId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Baby Stats</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Baby ID</label>
          <input
            type="text"
            value={babyId}
            onChange={(e) => setBabyId(e.target.value)}
            placeholder="Paste baby ID from dashboard"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {loading ? (
          <p className="text-gray-600">Loading stats...</p>
        ) : babyId ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-pink-900 mb-2">🍼 Feedings Today</h3>
              <p className="text-4xl font-bold text-pink-600">{stats.feedingCount}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">💩 Diapers Today</h3>
              <p className="text-4xl font-bold text-blue-600">{stats.diaperCount}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">😴 Sleep Today</h3>
              <p className="text-4xl font-bold text-purple-600">{Math.floor(stats.sleepMinutes / 60)}h {stats.sleepMinutes % 60}m</p>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">✓ Vaccines Done</h3>
              <p className="text-4xl font-bold text-green-600">{stats.vaccinesDone}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">⏰ Vaccines Upcoming</h3>
              <p className="text-4xl font-bold text-orange-600">{stats.vaccinesUpcoming}</p>
            </div>

            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">📈 Data Points</h3>
              <p className="text-4xl font-bold text-red-600">{stats.feedingCount + stats.diaperCount + (stats.sleepMinutes > 0 ? 1 : 0)}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Enter baby ID to see stats</p>
        )}
      </div>
    </div>
  );
}
