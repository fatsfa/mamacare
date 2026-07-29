import React, { useState, useEffect } from 'react';

export default function Vaccines() {
  const [schedule, setSchedule] = useState([]);
  const [done, setDone] = useState([]);
  const [loading, setLoading] = useState(false);
  const [babyId, setBabyId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vaccineName: '',
    dateDone: new Date().toISOString().split('T')[0],
    photoUrl: '',
  });

  useEffect(() => {
    if (babyId) fetchVaccines();
  }, [babyId]);

  const fetchVaccines = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/vaccines?babyId=${babyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setSchedule(data.schedule);
        setDone(data.done);
      }
    } catch (err) {
      console.error('Error fetching vaccines:', err);
    }
    setLoading(false);
  };

  const handleMarkDone = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/vaccines/mark-done', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          babyId,
          ...formData,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        alert('✓ Vaccine marked as done!');
        setFormData({ vaccineName: '', dateDone: new Date().toISOString().split('T')[0], photoUrl: '' });
        setShowForm(false);
        fetchVaccines();
      } else {
        alert(`✗ Error: ${data.error}`);
      }
    } catch (err) {
      alert(`✗ Error: ${err.message}`);
    }
  };

  const doneNames = done.map((d) => d.vaccineName);
  const upcoming = schedule.filter((v) => !doneNames.includes(v.name));
  const completed = schedule.filter((v) => doneNames.includes(v.name));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">💉 Vaccination Tracker</h1>

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
          <p className="text-gray-600">Loading...</p>
        ) : (
          <>
            {/* Mark Done Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                {showForm ? '✕ Cancel' : '✓ Mark Vaccine Done'}
              </button>

              {showForm && (
                <form onSubmit={handleMarkDone} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vaccine Name</label>
                    <input
                      type="text"
                      value={formData.vaccineName}
                      onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                      placeholder="e.g., BCG, Pentavalent (1st dose)"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Done</label>
                    <input
                      type="date"
                      value={formData.dateDone}
                      onChange={(e) => setFormData({ ...formData, dateDone: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Photo URL (optional)</label>
                    <input
                      type="url"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>

            {/* Completed Vaccines */}
            {completed.length > 0 && (
              <div className="bg-green-50 rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-green-700 mb-4">✓ Completed ({completed.length})</h2>
                <div className="space-y-2">
                  {completed.map((vaccine) => (
                    <div key={vaccine.name} className="p-3 bg-green-100 rounded-lg">
                      <p className="font-semibold text-green-900">{vaccine.name}</p>
                      <p className="text-sm text-green-700">{vaccine.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Vaccines */}
            {upcoming.length > 0 && (
              <div className="bg-orange-50 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-orange-700 mb-4">⏰ Upcoming ({upcoming.length})</h2>
                <div className="space-y-2">
                  {upcoming.map((vaccine) => (
                    <div key={vaccine.name} className="p-3 bg-orange-100 rounded-lg">
                      <p className="font-semibold text-orange-900">{vaccine.name}</p>
                      <p className="text-sm text-orange-700">Age: {vaccine.ageLabel}</p>
                      <p className="text-sm text-orange-700">{vaccine.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
