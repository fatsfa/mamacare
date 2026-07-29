import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBabies } from '../api';

const getNow = () => {
  const now = new Date();
  now.setSeconds(0, 0);
  return now.toISOString().slice(0, 16);
};

const getMinGap = (type) => (type === 'sleep' ? 4 : 1);

const validateTimes = (startTime, endTime, type) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();
  if (start > now) return 'Start time cannot be in the future';
  if (end > now) return 'End time cannot be in the future';
  if (end <= start) return 'End time must be after start time';
  const diffMinutes = (end - start) / 60000;
  const minGap = getMinGap(type);
  if (diffMinutes < minGap) return `Minimum ${minGap} minute(s) required between start and end time`;
  return null;
};

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [babies, setBabies] = useState([]);
  const [selectedBabyId, setSelectedBabyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'feeding',
    startTime: getNow(),
    endTime: getNow(),
    amount: '',
    notes: '',
  });

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
    if (selectedBabyId) fetchLogs();
  }, [selectedBabyId]);

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');
    const today = new Date().toISOString().split('T')[0];
    try {
      const res = await fetch(`http://localhost:5000/api/logs?babyId=${selectedBabyId}&date=${today}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) setLogs(data.logs || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBabyId) { setError('Please select a baby'); return; }

    const timeError = validateTimes(formData.startTime, formData.endTime, formData.type);
    if (timeError) { setError(timeError); return; }

    setError('');
    const token = localStorage.getItem('token');
    try {
      const body = { babyId: selectedBabyId, ...formData };
      // remove amount for diaper and sleep
      if (formData.type !== 'feeding') delete body.amount;

      const res = await fetch('http://localhost:5000/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) {
        setFormData({ ...formData, startTime: getNow(), endTime: getNow(), amount: '', notes: '' });
        fetchLogs();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/logs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) fetchLogs();
      else setError(data.error);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-pink-50 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>;

  if (babies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">📝 Baby Logs</h1>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600 mb-4">Add a baby first to start logging.</p>
            <Link to="/babies/add" className="inline-flex rounded-2xl bg-pink-500 text-white px-6 py-3 font-semibold hover:bg-pink-600 transition">➕ Add Baby</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📝 Baby Logs</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Log</h2>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">✗ {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Baby Selector */}
            {babies.length === 1 ? (
              <div className="p-3 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-600">Baby: <strong className="text-pink-700">{babies[0].name}</strong></p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Baby</label>
                <select
                  value={selectedBabyId}
                  onChange={(e) => setSelectedBabyId(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Choose baby...</option>
                  {babies.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
            )}

            {/* Log Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Log Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, amount: '' })}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="feeding">🍼 Feeding</option>
                <option value="diaper">💩 Diaper</option>
                <option value="sleep">😴 Sleep</option>
              </select>
            </div>

            {/* Time fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  max={getNow()}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  max={getNow()}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {formData.type === 'sleep' ? 'Min duration: 4 minutes' : 'Min duration: 1 minute'}
            </p>

            {/* Amount - only for feeding */}
            {formData.type === 'feeding' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount (ml)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. 120"
                  min="1"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                rows="2"
              />
            </div>

            <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition">
              Save Log
            </button>
          </form>
        </div>

        {/* Logs List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Logs ({logs.length})</h2>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No logs yet today. Add one above!</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const icons = { feeding: '🍼', diaper: '💩', sleep: '😴' };
                const duration = log.startTime && log.endTime
                  ? Math.round((new Date(log.endTime) - new Date(log.startTime)) / 60000)
                  : null;
                return (
                  <div key={log._id} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {icons[log.type]} {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                          {duration && <span className="ml-2 text-sm font-normal text-gray-500">({duration} min)</span>}
                        </p>
                        <p className="text-sm text-gray-500">{new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(log.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        {log.amount && <p className="text-sm text-gray-600">Amount: {log.amount} ml</p>}
                        {log.notes && <p className="text-sm text-gray-600">Notes: {log.notes}</p>}
                      </div>
                      <button onClick={() => handleDelete(log._id)} className="text-red-400 hover:text-red-600 text-lg font-bold ml-2">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
