import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBabies } from '../api';

export default function AIAssistant() {
  const [babyId, setBabyId] = useState('');
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [babies, setBabies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkBabies();
  }, []);

  const checkBabies = async () => {
    try {
      const data = await fetchBabies();
      setBabies(data.babies || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (babyId.trim()) fetchHistory();
  }, [babyId]);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const cleanId = babyId.trim();
      const res = await fetch(`http://localhost:5000/api/ai/history?babyId=${cleanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) setHistory(data.history);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    const cleanId = babyId.trim();

    if (!cleanId || !question.trim()) {
      setError('Please enter baby ID and question');
      return;
    }

    const token = localStorage.getItem('token');
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ babyId: cleanId, question: question.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setQuestion('');
        fetchHistory();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(babyId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (babies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">🤖 AI Mom Helper</h1>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">👶 No Baby Added Yet</h2>
            <p className="text-gray-600 mb-6">Add a baby first to chat with our AI helper.</p>
            <Link to="/babies/add" className="inline-flex rounded-2xl bg-pink-500 text-white px-6 py-3 font-semibold hover:bg-pink-600 transition">
              ➕ Add Baby
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🤖 AI Mom Helper</h1>

        {/* Ask Question Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Ask a Question</h2>
          <p className="text-sm text-gray-600 mb-4">❗ Always consult your pediatrician for medical concerns.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleAsk} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Baby ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={babyId}
                  onChange={(e) => setBabyId(e.target.value)}
                  placeholder="Paste baby ID from dashboard"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  disabled={!babyId}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm disabled:opacity-50"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Copy from Dashboard baby card</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., My baby has 38°C fever, what should I do?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Send
            </button>
          </form>
        </div>

        {/* Chat History */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full text-left font-semibold text-gray-700 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            {showHistory ? '▼ Hide' : '▶ Show'} Chat History ({history.length})
          </button>

          {showHistory && (
            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No chat history yet</p>
              ) : (
                history.map((chat, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-200">
                    <p className="font-semibold text-gray-800">Q: {chat.question}</p>
                    <p className="text-sm text-gray-600 mt-2">A: {chat.response}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(chat.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
