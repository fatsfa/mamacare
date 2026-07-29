import React, { useState, useEffect } from 'react';

export default function AIAssistant() {
  const [babyId, setBabyId] = useState('');
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (babyId) fetchHistory();
  }, [babyId]);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/ai/history?babyId=${babyId}`, {
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
    if (!question.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ babyId, question }),
      });
      const data = await res.json();
      if (data.ok) {
        setHistory([data.answer, ...history]);
        setQuestion('');
        alert('✓ Question answered!');
      } else {
        alert(`✗ Error: ${data.error}`);
      }
    } catch (err) {
      alert(`✗ Error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🤖 AI Mom Assistant</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <p className="text-gray-700 mb-4">
            Ask me anything about your baby's health, feeding, sleep, and development. I'll provide trusted guidance based on medical best practices.
          </p>

          {/* Baby ID Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Baby ID</label>
            <input
              type="text"
              value={babyId}
              onChange={(e) => setBabyId(e.target.value)}
              placeholder="Paste baby ID from dashboard"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Question Form */}
          <form onSubmit={handleAsk} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="E.g., My baby has 38°C fever, what should I do?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? '⏳ Thinking...' : '🔍 Get Answer'}
            </button>
          </form>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {showHistory ? '✕ Hide History' : '📖 Show History'}
          </button>
        </div>

        {/* History */}
        {showHistory && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">💬 Chat History</h2>
            {history.length === 0 ? (
              <p className="text-gray-600">No questions yet. Ask one above!</p>
            ) : (
              <div className="space-y-4">
                {history.map((chat, idx) => (
                  <div key={idx} className="border-l-4 border-pink-500 pl-4">
                    <p className="font-semibold text-gray-800 mb-2">Q: {chat.question}</p>
                    <p className="text-gray-700 mb-2">{chat.response}</p>
                    <p className="text-xs text-gray-500">{new Date(chat.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mt-6">
          <p className="text-sm text-yellow-900">
            ⚠️ <strong>Disclaimer:</strong> This AI provides general information only. Always consult your pediatrician for medical advice, especially for emergencies or serious symptoms.
          </p>
        </div>
      </div>
    </div>
  );
}
