import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-12 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-2">MamaCare</h3>
            <p className="text-sm text-gray-400">
              Baby tracker and mom support app for new moms in UAE.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/articles" className="text-gray-400 hover:text-white">Articles</Link></li>
              <li><a href="https://github.com" className="text-gray-400 hover:text-white">GitHub</a></li>
              <li><a href="mailto:support@mamacare.com" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-2">Legal</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#disclaimer" className="text-gray-400 hover:text-white">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <p className="text-center text-gray-400 text-sm">
            &copy; {currentYear} MamaCare. Made with ❤️ for new moms.
          </p>
          <p className="text-center text-gray-500 text-xs mt-2">
            Always consult your pediatrician for medical advice. MamaCare is for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
