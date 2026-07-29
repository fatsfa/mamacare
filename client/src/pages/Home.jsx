import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-pink-600">MamaCare</h1>
          <p className="text-gray-600 mt-2">Baby Tracker & Mom Support App</p>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Track Your Baby's Journey, Get Expert Support
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          One app for logs, vaccines, articles, and AI guidance. Made for new moms in UAE.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/register"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Create Account
          </Link>
          <Link
            to="/login"
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Login
          </Link>
        </div>

        {/* Demo without login */}
        <div className="mb-12">
          <p className="text-gray-600 mb-4">Browse articles without logging in:</p>
          <Link
            to="/articles"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            📚 Read Articles
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-lg font-bold text-pink-600 mb-2">📝 Daily Logs</h4>
            <p className="text-gray-600">Track feeding, diapers, and sleep with simple one-tap logging.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-lg font-bold text-green-600 mb-2">💉 Vaccines</h4>
            <p className="text-gray-600">UAE MOH schedule. Know what's due, mark completed, upload cards.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-lg font-bold text-purple-600 mb-2">📚 Articles</h4>
            <p className="text-gray-600">20+ trusted articles on feeding, sleep, health, development.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-lg font-bold text-blue-600 mb-2">🤖 AI Assistant</h4>
            <p className="text-gray-600">Ask questions. Get trusted, general guidance with pediatrician tips.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-lg font-bold text-orange-600 mb-2">👶 Baby Profiles</h4>
            <p className="text-gray-600">Track multiple babies. Auto-calculate age, store photos and metrics.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-lg font-bold text-red-600 mb-2">🔒 Secure</h4>
            <p className="text-gray-600">JWT authentication. Your data is private and encrypted.</p>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-pink-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Start</h3>
          <ol className="space-y-4 text-gray-700">
            <li><strong>1. Create Account:</strong> Register with email and password</li>
            <li><strong>2. Add Baby:</strong> Enter baby's name, DOB, gender, blood type, weight, height</li>
            <li><strong>3. Start Logging:</strong> Create feeding, diaper, and sleep logs</li>
            <li><strong>4. Check Vaccines:</strong> See upcoming vaccines by age</li>
            <li><strong>5. Read & Ask:</strong> Browse articles and ask AI for guidance</li>
          </ol>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2026 MamaCare. Made with ❤️ for new moms.</p>
        <p className="text-sm text-gray-400 mt-2">Always consult your pediatrician for medical advice.</p>
      </footer>
    </div>
  );
}
