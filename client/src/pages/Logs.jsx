import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBabies } from '../api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const pad2 = (value) => String(value).padStart(2, '0');

const getCurrentLocalDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
};

const getCurrentLocalTime = () => {
  const now = new Date();
  return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
};

const combineDateAndTime = (dateValue, timeValue) => {
  if (!dateValue || !timeValue) return null;
  const [hours, minutes] = timeValue.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  const combined = new Date(dateValue);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
};

const getDurationSeconds = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;
  const seconds = Math.floor((endDate - startDate) / 1000);
  return seconds > 0 ? seconds : null;
};

const getDurationMinutes = (startIso, endIso) => {
  if (!startIso || !endIso) return null;
  const start = new Date(startIso);
  const end = new Date(endIso);
  const seconds = getDurationSeconds(start, end);
  if (!seconds) return null;
  return Math.round(seconds / 60);
};

const formatDuration = (seconds) => {
  if (!seconds || seconds < 1) return '0 sec';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} sec`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} sec`;
};

const MIN_GAP_SECONDS = 60;

const validateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Please enter valid From and To time';
  const now = new Date();
  if (startDate > now) return 'From time cannot be in the future';
  if (endDate > now) return 'To time cannot be in the future';
  if (endDate <= startDate) return 'To time must be after From time';
  const seconds = getDurationSeconds(startDate, endDate);
  if (!seconds || seconds < MIN_GAP_SECONDS) return 'Minimum 1 minute required between From and To';
  return null;
};

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [babies, setBabies] = useState([]);
  const [selectedBabyId, setSelectedBabyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);
  // '' = not yet chosen, 'start_now' | 'choose_time'
  const [fromMode, setFromMode] = useState('');
  // '' = not yet chosen, 'stop_now' | 'choose_time'
  const [toMode, setToMode] = useState('');
  const [fromLocked, setFromLocked] = useState(false);
  const [toLocked, setToLocked] = useState(false);
  const [fromNowIso, setFromNowIso] = useState('');
  const [toNowIso, setToNowIso] = useState('');
  // Diaper: single timestamp
  const [diaperMode, setDiaperMode] = useState('');   // '' | 'now' | 'choose_time'
  const [diaperIso, setDiaperIso] = useState('');
  const [diaperTime, setDiaperTime] = useState(getCurrentLocalTime());
  const [pottyDone, setPottyDone] = useState(false);
  const [formData, setFormData] = useState({
    type: 'feeding',
    startTime: getCurrentLocalTime(),
    endTime: getCurrentLocalTime(),
    amount: '',
    notes: '',
  });

  const logDate = getCurrentLocalDate();
  const currentTimeLimit = getCurrentLocalTime();

  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
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
    checkBabies();
  }, []);

  useEffect(() => {
    if (selectedBabyId) fetchLogs();
  }, [selectedBabyId]);

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/logs?babyId=${selectedBabyId}&date=${logDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) setLogs(data.logs || []);
      else setError(data.error);
    } catch (err) {
      setError(err.message);
    }
  };

  const resolveStartDate = () => {
    if (fromMode === 'start_now' && fromNowIso) return new Date(fromNowIso);
    return combineDateAndTime(logDate, formData.startTime);
  };

  // useLiveNowForStop: true = live ticking (for preview), false = only use captured toNowIso
  const resolveEndDate = (useLiveNowForStop = false) => {
    if (toMode === 'stop_now') {
      if (toNowIso) return new Date(toNowIso);             // captured stop time
      if (useLiveNowForStop) return new Date();            // live tick (preview only)
      return null;
    }
    return combineDateAndTime(logDate, formData.endTime);
  };

  const saveLog = async (startDate, endDate) => {
    const token = localStorage.getItem('token');
    const body = {
      babyId: selectedBabyId,
      type: formData.type,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      notes: formData.notes || '',
      durationMinutes: Math.round(getDurationSeconds(startDate, endDate) / 60),
    };
    if (formData.type === 'feeding' && formData.amount) {
      body.amount = Number(formData.amount);
    }
    if (formData.type === 'diaper') {
      body.pottyDone = pottyDone;
    }

    const res = await fetch(`${API_BASE}/api/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const resetAfterSave = () => {
    const nowTime = getCurrentLocalTime();
    setFormData((prev) => ({ ...prev, startTime: nowTime, endTime: nowTime, amount: '', notes: '' }));
    setFromMode('');
    setToMode('');
    setFromLocked(false);
    setToLocked(false);
    setFromNowIso('');
    setToNowIso('');
    setDiaperMode('');
    setDiaperIso('');
    setDiaperTime(getCurrentLocalTime());
    setPottyDone(false);
  };

  const submitWithCurrentSelection = async (e) => {
    if (e) e.preventDefault();
    if (!selectedBabyId) { setError('Please select a baby'); return; }

    let startDate, endDate;

    if (formData.type === 'diaper') {
      if (!diaperMode) { setError('Please select when the diaper was changed'); return; }
      const diaperDate = diaperIso ? new Date(diaperIso) : combineDateAndTime(logDate, diaperTime);
      if (!diaperDate) { setError('Please select a valid time'); return; }
      const now = new Date();
      if (diaperDate > now) { setError('Time cannot be in the future'); return; }
      startDate = diaperDate;
      endDate = diaperDate; // same time — diaper is a single event
    } else {
      if (!fromMode) { setError('Please select a From time'); return; }
      if (!toMode) { setError('Please select a To time'); return; }
      startDate = resolveStartDate();
      endDate = resolveEndDate(false);
      if (!endDate) { setError('Please select a To time'); return; }
      const timeError = validateRange(startDate, endDate);
      if (timeError) { setError(timeError); return; }
    }

    try {
      setError('');
      const data = await saveLog(startDate, endDate);
      if (data.ok) { resetAfterSave(); fetchLogs(); }
      else setError(data.error);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFromModeChange = (value) => {
    if (!value) return; // ignore placeholder selection
    setFromMode(value);
    setFromLocked(true); // lock From once a choice is made
    if (value === 'start_now') {
      const now = new Date();
      setFromNowIso(now.toISOString());
      setFormData((prev) => ({ ...prev, startTime: `${pad2(now.getHours())}:${pad2(now.getMinutes())}` }));
      // reset To so user must explicitly press Stop
      setToMode('');
      setToLocked(false);
      setToNowIso('');
    } else {
      setFromNowIso('');
      setToMode('');
      setToLocked(false);
      setToNowIso('');
    }
  };

  const handleToModeChange = (value) => {
    if (!value) return; // ignore placeholder
    setToMode(value);
    if (value === 'stop_now') {
      const now = new Date();
      setToNowIso(now.toISOString());
      setFormData((prev) => ({ ...prev, endTime: `${pad2(now.getHours())}:${pad2(now.getMinutes())}` }));
      setToLocked(true); // lock To — stop time captured
    } else {
      setToNowIso('');
      // not locked yet for choose_time — lock after time input blur? No, lock on selection
      setToLocked(false);
    }
  };

  const handleManualEndTimeChange = (value) => {
    setFormData((prev) => ({ ...prev, endTime: value }));
    // lock To once a manual time is picked
    if (value) setToLocked(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/logs/${id}`, {
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

  // Live when: From is start_now, timer running, To not yet stopped
  const isLiveTimer = fromMode === 'start_now' && fromNowIso && toMode !== 'stop_now' && !toNowIso && toMode !== 'choose_time';
  const timerStopped = (toMode === 'stop_now' && toNowIso) || (toMode === 'choose_time' && formData.endTime);
  const typeLabel = formData.type.charAt(0).toUpperCase() + formData.type.slice(1);

  const previewDurationSeconds = useMemo(() => {
    const startDate = resolveStartDate();
    // For display: if live timer running, use current time for end; else use resolved end
    const endDate = isLiveTimer ? new Date() : resolveEndDate(false);
    return getDurationSeconds(startDate, endDate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.startTime, formData.endTime, fromMode, toMode, fromNowIso, toNowIso, logDate, tick, isLiveTimer]);

  const feedingTotalMinutes = useMemo(() => {
    return logs
      .filter((log) => log.type === 'feeding')
      .reduce((sum, log) => {
        const duration = log.durationMinutes || getDurationMinutes(log.startTime, log.endTime) || 0;
        return sum + duration;
      }, 0);
  }, [logs]);

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

          {babies.length === 1 ? (
            <div className="p-3 bg-pink-50 rounded-lg mb-4">
              <p className="text-sm text-gray-600">Baby: <strong className="text-pink-700">{babies[0].name}</strong></p>
            </div>
          ) : (
            <div className="mb-4">
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

          <form onSubmit={submitWithCurrentSelection} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Log Type</label>
              <select
                value={formData.type}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, type: e.target.value, amount: '' }));
                  // reset time fields when switching type
                  setFromMode(''); setToMode(''); setFromLocked(false); setToLocked(false);
                  setFromNowIso(''); setToNowIso('');
                  setDiaperMode(''); setDiaperIso(''); setDiaperTime(getCurrentLocalTime()); setPottyDone(false);
                }}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="feeding">🍼 Feeding</option>
                <option value="diaper">💩 Diaper</option>
                <option value="sleep">😴 Sleep</option>
              </select>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              Date: <strong>{logDate}</strong> (auto today)
            </div>

            {formData.type === 'diaper' ? (
              /* ── DIAPER: single "Changed" timestamp ── */
              <div>
                <label className="block text-sm font-medium text-gray-700">💩 Diaper Changed</label>
                <select
                  value={diaperMode}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDiaperMode(val);
                    if (val === 'now') {
                      const now = new Date();
                      setDiaperIso(now.toISOString());
                      setDiaperTime(`${pad2(now.getHours())}:${pad2(now.getMinutes())}`);
                    } else {
                      setDiaperIso('');
                    }
                  }}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">-- When was it changed? --</option>
                  <option value="now">Changed now (save current time)</option>
                  <option value="choose_time">Choose time</option>
                </select>
                {diaperMode === 'now' && diaperIso && (
                  <p className="mt-2 text-sm font-medium text-green-700">
                    ✅ Changed at {new Date(diaperIso).toLocaleTimeString()}
                  </p>
                )}
                {diaperMode === 'choose_time' && (
                  <input
                    type="time"
                    value={diaperTime}
                    max={currentTimeLimit}
                    onChange={(e) => setDiaperTime(e.target.value)}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                )}
                <p className="mt-1 text-xs text-gray-500">No future time allowed.</p>

                {/* Potty Done */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">🚽 Potty done?</label>
                  <select
                    value={pottyDone ? 'yes' : 'no'}
                    onChange={(e) => setPottyDone(e.target.value === 'yes')}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            ) : (
              /* ── FEEDING / SLEEP: From → To with timer ── */
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* FROM */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">From</label>
                    <select
                      value={fromMode}
                      onChange={(e) => handleFromModeChange(e.target.value)}
                      disabled={fromLocked}
                      className={`w-full mt-1 px-4 py-2 border rounded-lg ${fromLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-300'}`}
                    >
                      <option value="">-- Select From --</option>
                      <option value="start_now">▶ Start now (timer ON)</option>
                      <option value="choose_time">Choose time manually</option>
                    </select>
                    {fromMode === 'choose_time' && (
                      <input
                        type="time"
                        value={formData.startTime}
                        max={currentTimeLimit}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, startTime: e.target.value }));
                          setFromLocked(true);
                        }}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    )}
                    {fromMode === 'start_now' && fromNowIso && (
                      <p className="mt-2 text-xs text-green-700 font-medium">
                        ▶ Started at {new Date(fromNowIso).toLocaleTimeString()}
                      </p>
                    )}
                  </div>

                  {/* TO */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">To</label>
                    <select
                      value={toMode}
                      onChange={(e) => handleToModeChange(e.target.value)}
                      disabled={toLocked || !fromMode}
                      className={`w-full mt-1 px-4 py-2 border rounded-lg ${(toLocked || !fromMode) ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-300'}`}
                    >
                      <option value="">-- Select To --</option>
                      <option value="stop_now">⏹ Stop now</option>
                      <option value="choose_time">Choose time manually</option>
                    </select>
                    {toMode === 'choose_time' && (
                      <input
                        type="time"
                        value={formData.endTime}
                        max={currentTimeLimit}
                        onChange={(e) => handleManualEndTimeChange(e.target.value)}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    )}
                    {toMode === 'stop_now' && toNowIso && (
                      <p className="mt-2 text-xs text-red-600 font-medium">
                        ⏹ Stopped at {new Date(toNowIso).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500">No future time. Min 1 minute gap.</p>

                {/* Duration badge: live ticking OR frozen total */}
                {fromMode && (isLiveTimer || timerStopped) && (
                  <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold ${isLiveTimer ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'}`}>
                    {isLiveTimer ? (
                      <>
                        <span className="mr-2 animate-pulse">●</span>
                        {typeLabel}: {previewDurationSeconds ? formatDuration(previewDurationSeconds) : '0 sec'}
                        <span className="ml-2 text-xs font-normal opacity-75">live</span>
                      </>
                    ) : (
                      <>
                        ✅ Total {typeLabel} time: <span className="ml-1">{previewDurationSeconds ? formatDuration(previewDurationSeconds) : '—'}</span>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {formData.type === 'feeding' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount (ml)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="e.g. 120"
                  min="1"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
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

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Logs ({logs.length})</h2>
          <div className="mb-4 inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700">
            Total Feeding Time: {feedingTotalMinutes} min
          </div>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No logs yet today. Add one above!</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const icons = { feeding: '🍼', diaper: '💩', sleep: '😴' };
                const duration = log.durationMinutes || getDurationMinutes(log.startTime, log.endTime);
                const itemLabel = log.type.charAt(0).toUpperCase() + log.type.slice(1);
                return (
                  <div key={log._id} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {icons[log.type]} {itemLabel}
                        </p>
                        {duration && (
                          <div className="mt-1 inline-flex items-center rounded-full bg-pink-100 px-2 py-0.5 text-xs font-semibold text-pink-700">
                            {itemLabel}: {duration} min
                          </div>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {' – '}
                          {new Date(log.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {log.amount && <p className="text-sm text-gray-600">Amount: {log.amount} ml</p>}
                        {log.type === 'diaper' && (
                          <p className="text-sm mt-1">
                            🚽 Potty: {log.pottyDone ? <span className="text-green-600 font-semibold">Yes ✓</span> : <span className="text-gray-400">No</span>}
                          </p>
                        )}
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
