import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    babyId: '',
    type: 'feeding',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date().toISOString().slice(0, 16),
    amount: '',
    notes: '',
  });

  useEffect(() => {
    fetchLogs();
  }, [formData.babyId]);

  const fetchLogs = async () => {
    if (!formData.babyId) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    const today = new Date().toISOString().split('T')[0];
    try {
      const res = await fetch(`http://localhost:5000/api/logs?babyId=${formData.babyId}&date=${today}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) setLogs(data.logs);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.ok) {
        alert('✓ Log created!');
        setFormData({
          ...formData,
          startTime: new Date().toISOString().slice(0, 16),
          endTime: new Date().toISOString().slice(0, 16),
          amount: '',
          notes: '',
        });
        fetchLogs();
      } else {
        alert(`✗ Error: ${data.error}`);
      }
    } catch (err) {
      alert(`✗ Error: ${err.message}`);
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
      if (data.ok) {
        alert('✓ Log deleted!');
        fetchLogs();
      } else {
        alert(`✗ Error: ${data.error}`);
      }
    } catch (err) {
      alert(`✗ Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📝 Baby Logs</h1>

        {/* Add Log Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Log</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Baby ID</label>
              <input
                type="text"
                value={formData.babyId}
                onChange={(e) => setFormData({ ...formData, babyId: e.target.value })}
                placeholder="Paste baby ID from dashboard"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Log Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="feeding">🍼 Feeding</option>
                <option value="diaper">💩 Diaper</option>
                <option value="sleep">😴 Sleep</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
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
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (ml)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Optional: 120"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Save Log
            </button>
          </form>
        </div>

        {/* Logs List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Logs</h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="text-gray-600">No logs yet. Create one above!</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log._id} className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{log.type.toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{new Date(log.startTime).toLocaleString()}</p>
                      {log.amount && <p className="text-sm text-gray-600">Amount: {log.amount} ml</p>}
                      {log.notes && <p className="text-sm text-gray-600">Notes: {log.notes}</p>}
                    </div>
                    <button
                      onClick={() => handleDelete(log._id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
