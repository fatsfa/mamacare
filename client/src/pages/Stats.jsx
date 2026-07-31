import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBabies } from '../api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const fmtHM = (mins) => {
  if (!mins) return '0 min';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
};

const ProgressBar = ({ value, max, color }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, barValue, barMax, barColor, gradient, textColor }) => (
  <div className={`${gradient} rounded-2xl p-4 shadow-sm`}>
    <div className="flex items-center justify-between mb-1">
      <span className="text-lg">{icon}</span>
      <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
    </div>
    <p className={`text-sm font-semibold ${textColor} opacity-80`}>{label}</p>
    {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    {barMax > 0 && <ProgressBar value={barValue} max={barMax} color={barColor} />}
  </div>
);

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [babies, setBabies] = useState([]);
  const [selectedBabyId, setSelectedBabyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('today'); // 'today' | 'week'

  useEffect(() => { checkBabies(); }, []);
  useEffect(() => { if (selectedBabyId) fetchStats(); }, [selectedBabyId, view]);

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

  const fetchStats = async () => {
    setStatsLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const toDate = new Date();
      const fromDate = new Date();
      if (view === 'week') fromDate.setDate(fromDate.getDate() - 6);
      const toStr = toDate.toISOString().split('T')[0];
      const fromStr = fromDate.toISOString().split('T')[0];

      // Fetch logs for each day in range (or just today)
      const days = [];
      const cur = new Date(fromDate);
      while (cur <= toDate) {
        days.push(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
      }

      const [allLogResults, vaccineRes] = await Promise.all([
        Promise.all(days.map((d) =>
          fetch(`${API_BASE}/api/logs?babyId=${selectedBabyId}&date=${d}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json())
        )),
        fetch(`${API_BASE}/api/vaccines?babyId=${selectedBabyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
      ]);

      const logs = allLogResults.flatMap((r) => (r.ok ? r.logs || [] : []));
      const vaccineData = vaccineRes;

      const feedingLogs = logs.filter((l) => l.type === 'feeding');
      const diaperLogs  = logs.filter((l) => l.type === 'diaper');
      const sleepLogs   = logs.filter((l) => l.type === 'sleep');

      const calcMins = (arr) => arr.reduce((sum, log) => {
        if (log.durationMinutes) return sum + log.durationMinutes;
        if (log.startTime && log.endTime)
          return sum + (new Date(log.endTime) - new Date(log.startTime)) / 60000;
        return sum;
      }, 0);

      setStats({
        feedingCount: feedingLogs.length,
        diaperCount: diaperLogs.length,
        sleepCount: sleepLogs.length,
        feedingMins: Math.round(calcMins(feedingLogs)),
        sleepMins: Math.round(calcMins(sleepLogs)),
        totalFeedingMl: feedingLogs.reduce((s, l) => s + (l.amount || 0), 0),
        pottyDoneCount: diaperLogs.filter((l) => l.pottyDone).length,
        vaccinesDone: vaccineData.done?.length || 0,
        vaccinesTotal: vaccineData.schedule?.length || 0,
        days: days.length,
      });
    } catch (err) {
      setError(err.message);
    }
    setStatsLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  if (babies.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Baby Stats</h1>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-gray-600 mb-4">Add a baby first to see statistics.</p>
          <Link to="/babies/add" className="inline-flex rounded-2xl bg-pink-500 text-white px-6 py-3 font-semibold hover:bg-pink-600 transition">➕ Add Baby</Link>
        </div>
      </div>
    </div>
  );

  const vaccPct = stats && stats.vaccinesTotal > 0
    ? Math.round((stats.vaccinesDone / stats.vaccinesTotal) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">📊 Baby Stats</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">✗ {error}</div>}

        {/* Baby selector */}
        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          {babies.length === 1 ? (
            <p className="text-sm text-gray-600">Baby: <strong className="text-pink-700">{babies[0].name}</strong></p>
          ) : (
            <select
              value={selectedBabyId}
              onChange={(e) => setSelectedBabyId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Choose baby...</option>
              {babies.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          )}
        </div>

        {/* Today / Week toggle */}
        <div className="flex gap-2 mb-4">
          {['today', 'week'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2 rounded-xl font-semibold text-sm transition ${
                view === v ? 'bg-pink-500 text-white shadow' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {v === 'today' ? '📅 Today' : '📆 This Week'}
            </button>
          ))}
        </div>

        {statsLoading && <p className="text-gray-500 text-center py-8 animate-pulse">Loading stats...</p>}

        {stats && !statsLoading && (
          <>
            <p className="text-xs text-gray-400 mb-4">
              {view === 'today'
                ? `Today — ${new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long' })}`
                : `Last 7 days summary`}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <StatCard
                icon="🍼" label="Feedings" value={stats.feedingCount}
                sub={`${fmtHM(stats.feedingMins)} total${stats.totalFeedingMl > 0 ? ` · ${stats.totalFeedingMl} ml` : ''}`}
                gradient="bg-gradient-to-br from-pink-100 to-pink-200"
                textColor="text-pink-700"
                barValue={stats.feedingCount} barMax={view === 'today' ? 12 : 84} barColor="bg-pink-400"
              />
              <StatCard
                icon="💩" label="Diapers" value={stats.diaperCount}
                sub={stats.pottyDoneCount > 0 ? `🚽 Potty done: ${stats.pottyDoneCount}x` : 'No potty yet'}
                gradient="bg-gradient-to-br from-yellow-100 to-yellow-200"
                textColor="text-yellow-700"
                barValue={stats.diaperCount} barMax={view === 'today' ? 10 : 70} barColor="bg-yellow-400"
              />
              <StatCard
                icon="😴" label="Sleep" value={fmtHM(stats.sleepMins)}
                sub={`${stats.sleepCount} sleep session${stats.sleepCount !== 1 ? 's' : ''}`}
                gradient="bg-gradient-to-br from-purple-100 to-purple-200"
                textColor="text-purple-700"
                barValue={stats.sleepMins} barMax={view === 'today' ? 1020 : 7140} barColor="bg-purple-400"
              />
              <StatCard
                icon="💉" label="Vaccines" value={`${stats.vaccinesDone}/${stats.vaccinesTotal}`}
                sub={`${vaccPct}% completed`}
                gradient="bg-gradient-to-br from-green-100 to-green-200"
                textColor="text-green-700"
                barValue={stats.vaccinesDone} barMax={stats.vaccinesTotal} barColor="bg-green-400"
              />
            </div>

            {/* Summary strip */}
            <div className="bg-white rounded-2xl shadow p-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {view === 'today' ? "Today at a glance" : "Week at a glance"}
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>🍼 Total feeding time</span><span className="font-semibold text-pink-700">{fmtHM(stats.feedingMins)}</span></div>
                <div className="flex justify-between"><span>😴 Total sleep time</span><span className="font-semibold text-purple-700">{fmtHM(stats.sleepMins)}</span></div>
                <div className="flex justify-between"><span>💩 Diaper changes</span><span className="font-semibold text-yellow-700">{stats.diaperCount} times</span></div>
                {stats.totalFeedingMl > 0 && (
                  <div className="flex justify-between"><span>🥛 Milk/formula</span><span className="font-semibold text-blue-700">{stats.totalFeedingMl} ml</span></div>
                )}
                <div className="flex justify-between"><span>💉 Vaccines pending</span><span className="font-semibold text-orange-600">{stats.vaccinesTotal - stats.vaccinesDone}</span></div>
              </div>
            </div>

            <button
              onClick={fetchStats}
              className="w-full bg-white border border-pink-300 text-pink-600 font-semibold py-2 px-4 rounded-xl hover:bg-pink-50 transition"
            >
              🔄 Refresh
            </button>
          </>
        )}
      </div>
    </div>
  );
}
