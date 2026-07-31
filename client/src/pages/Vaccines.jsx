import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBabies } from '../api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Vaccines() {
  const [schedule, setSchedule] = useState([]);
  const [done, setDone] = useState([]);
  const [babies, setBabies] = useState([]);
  const [selectedBabyId, setSelectedBabyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [vaccineLoading, setVaccineLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    vaccineName: '',
    dateDone: new Date().toISOString().split('T')[0],
    photoUrl: '',
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
    if (selectedBabyId) fetchVaccines();
  }, [selectedBabyId]);

  const fetchVaccines = async () => {
    setVaccineLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/vaccines?babyId=${selectedBabyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setSchedule(data.schedule || []);
        setDone(data.done || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
    setVaccineLoading(false);
  };

  const handleMarkDone = async (e) => {
    e.preventDefault();
    if (!formData.vaccineName) { setError('Please select a vaccine'); return; }

    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/vaccines/mark-done`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ babyId: selectedBabyId, ...formData }),
      });
      const data = await res.json();
      if (data.ok) {
        setFormData({ vaccineName: '', dateDone: new Date().toISOString().split('T')[0], photoUrl: '' });
        setShowForm(false);
        fetchVaccines();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-pink-50 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>;

  if (babies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">💉 Vaccination Tracker</h1>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600 mb-4">Add a baby first to track vaccinations.</p>
            <Link to="/babies/add" className="inline-flex rounded-2xl bg-pink-500 text-white px-6 py-3 font-semibold hover:bg-pink-600 transition">➕ Add Baby</Link>
          </div>
        </div>
      </div>
    );
  }

  const doneNames = done.map((d) => d.vaccineName);
  const pendingVaccines = schedule.filter((v) => !doneNames.includes(v.name));
  const completedVaccines = schedule.filter((v) => doneNames.includes(v.name));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">💉 Vaccination Tracker</h1>

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

        {selectedBabyId && !vaccineLoading && (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{completedVaccines.length}</p>
                <p className="text-xs text-green-600">Done</p>
              </div>
              <div className="bg-orange-100 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-orange-700">{pendingVaccines.length}</p>
                <p className="text-xs text-orange-600">Pending</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-700">{schedule.length}</p>
                <p className="text-xs text-blue-600">Total</p>
              </div>
            </div>

            {/* Mark Done Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                {showForm ? '✕ Cancel' : '✓ Mark Vaccine as Done'}
              </button>

              {showForm && (
                <form onSubmit={handleMarkDone} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Vaccine</label>
                    <select
                      value={formData.vaccineName}
                      onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Choose vaccine...</option>
                      <optgroup label="⏰ Pending Vaccines">
                        {pendingVaccines.map((v) => (
                          <option key={v.name} value={v.name}>
                            {v.name} — {v.ageLabel}
                          </option>
                        ))}
                      </optgroup>
                      {completedVaccines.length > 0 && (
                        <optgroup label="✓ Already Done">
                          {completedVaccines.map((v) => (
                            <option key={v.name} value={v.name}>
                              {v.name} — {v.ageLabel}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Done</label>
                    <input
                      type="date"
                      value={formData.dateDone}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, dateDone: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition">
                    ✓ Save
                  </button>
                </form>
              )}
            </div>

            {/* Pending Vaccines */}
            {pendingVaccines.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-orange-700 mb-4">⏰ Pending Vaccines ({pendingVaccines.length})</h2>
                <div className="space-y-2">
                  {pendingVaccines.map((v) => (
                    <div key={v.name} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="font-semibold text-gray-800">{v.name}</p>
                      <p className="text-xs text-orange-600 font-medium">{v.ageLabel}</p>
                      <p className="text-xs text-gray-500 mt-1">{v.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Vaccines */}
            {completedVaccines.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-green-700 mb-4">✅ Completed ({completedVaccines.length})</h2>
                <div className="space-y-2">
                  {completedVaccines.map((v) => {
                    const record = done.find((d) => d.vaccineName === v.name);
                    return (
                      <div key={v.name} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">{v.name}</p>
                            <p className="text-xs text-green-600">{v.ageLabel}</p>
                          </div>
                          {record && (
                            <p className="text-xs text-gray-500">{new Date(record.dateDone).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {vaccineLoading && <p className="text-gray-600 text-center py-8">Loading vaccines...</p>}
      </div>
    </div>
  );
}
