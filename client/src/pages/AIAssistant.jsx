import React, { useState, useEffect } from 'react';

export default function AIAssistant() {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/ai/history', {
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
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setQuestion('');
        fetchHistory();
        setShowHistory(true);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const quickQuestions = [
    'My baby has 38°C fever, what should I do?',
    'How many hours should my 3-month baby sleep?',
    'My baby is not feeding well, what to do?',
    'Baby is crying non-stop for 2 hours, is it colic?',
    'How often should I change diapers?',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🤖 AI Mom Helper</h1>
        <p className="text-sm text-gray-500 mb-6">
          ⚠️ General guidance only. Always consult your pediatrician for medical decisions.
        </p>

        {/* Ask Question Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Ask a Question</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">✗ {error}</div>
          )}

          <form onSubmit={handleAsk} className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., My baby has 38°C fever, what should I do?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              rows="3"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              {loading ? 'Getting answer...' : '💬 Ask'}
            </button>
          </form>

          {/* Quick Questions */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuestion(q)}
                  className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-1 rounded-full transition"
                >
                  {q.length > 40 ? q.slice(0, 40) + '...' : q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Show latest answer immediately */}
        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4 border-l-4 border-pink-400">
            <p className="text-xs text-gray-400 mb-1">Latest answer</p>
            <p className="font-semibold text-gray-800 mb-2">Q: {history[0].question}</p>
            <p className="text-gray-700 text-sm leading-relaxed">A: {history[0].response}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(history[0].createdAt).toLocaleString()}</p>
          </div>
        )}

        {/* Chat History */}
        {history.length > 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full text-left font-semibold text-gray-700 py-2"
            >
              {showHistory ? '▼ Hide' : '▶ Show'} Previous Questions ({history.length - 1})
            </button>

            {showHistory && (
              <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                {history.slice(1).map((chat, idx) => (
                  <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="font-semibold text-gray-800 text-sm">Q: {chat.question}</p>
                    <p className="text-gray-600 text-sm mt-1">A: {chat.response}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(chat.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
