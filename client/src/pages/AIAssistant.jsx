import React, { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const quickQuestions = [
  '🤒 My baby has 38°C fever, what should I do?',
  '😴 How many hours should a 3-month baby sleep?',
  '🍼 My baby is not feeding well, what to do?',
  '😭 Baby crying non-stop 2 hours — is it colic?',
  '💩 How often should I change diapers?',
  '🌡️ When should I call the doctor immediately?',
];

export default function AIAssistant() {
  const [question, setQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, loading]);

  const loadHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/ai/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok && data.history.length > 0) {
        const msgs = [];
        [...data.history].reverse().forEach((h) => {
          msgs.push({ role: 'user', text: h.question, time: h.createdAt });
          msgs.push({ role: 'ai', text: h.response, time: h.createdAt });
        });
        setChatMessages(msgs);
      }
    } catch (err) {
      console.error('History load failed:', err);
    } finally {
      setHistoryLoaded(true);
    }
  };

  const handleAsk = async (e) => {
    e?.preventDefault();
    const q = question.trim();
    if (!q) { setError('Please enter a question'); return; }

    setError('');
    setQuestion('');
    setChatMessages((prev) => [...prev, { role: 'user', text: q, time: new Date().toISOString() }]);
    setLoading(true);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (data.ok) {
        setChatMessages((prev) => [
          ...prev,
          { role: 'ai', text: data.answer.response, time: data.answer.createdAt },
        ]);
      } else {
        setError(data.error || 'Something went wrong');
        setChatMessages((prev) => [
          ...prev,
          { role: 'ai', text: 'Sorry, I could not get an answer. Please try again.', time: new Date().toISOString() },
        ]);
      }
    } catch (err) {
      setError(err.message);
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Network error. Check your connection and try again.', time: new Date().toISOString() },
      ]);
    }
    setLoading(false);
  };

  const handleQuickQuestion = (q) => {
    const clean = q.replace(/^\p{Emoji}\s*/u, '').trim();
    setQuestion(clean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col">
      <div className="max-w-2xl w-full mx-auto flex flex-col flex-1 p-4">

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-purple-700">🤖 AI Mom Helper</h1>
          <p className="text-xs text-gray-400 mt-1">General guidance only — always consult your pediatrician.</p>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 mb-4 overflow-y-auto max-h-96 space-y-3">
          {!historyLoaded && (
            <p className="text-center text-gray-400 text-sm py-8">Loading chat history...</p>
          )}
          {historyLoaded && chatMessages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">👶</p>
              <p className="text-gray-500 text-sm">Hi mama! Ask me anything about your baby.</p>
              <p className="text-gray-400 text-xs mt-1">Feeding, sleep, health, development</p>
            </div>
          )}
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-pink-500 text-white rounded-br-sm'
                  : 'bg-purple-50 text-gray-800 border border-purple-100 rounded-bl-sm'
              }`}>
                {msg.role === 'ai' && <p className="text-xs font-bold text-purple-500 mb-1">MamaCare AI</p>}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-pink-100' : 'text-gray-400'}`}>
                  {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-purple-50 border border-purple-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                <p className="text-xs font-bold text-purple-500 mb-1">MamaCare AI</p>
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuickQuestion(q)}
              className="text-xs bg-white border border-purple-200 hover:bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full transition shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {error && <div className="mb-2 p-2 bg-red-100 text-red-700 rounded-lg text-xs">Error: {error}</div>}

        <form onSubmit={handleAsk} className="flex gap-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); }
            }}
            placeholder="Ask about feeding, sleep, fever, development..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-sm"
            rows="2"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-200 text-white font-bold px-5 rounded-2xl transition self-end py-3"
          >
            {loading ? '...' : 'Send'}
          </button>
        </form>
        <p className="text-xs text-center text-gray-300 mt-2">Press Enter to send · Shift+Enter for new line</p>

      </div>
    </div>
  );
}
