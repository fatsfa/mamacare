import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBabies } from '../api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [babies, setBabies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    checkBabies();
  }, []);

  const checkBabies = async () => {
    try {
      const data = await fetchBabies();
      setBabies(data.babies || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (babies.length > 0) {
      fetchArticles();
      fetchBookmarks();
    }
  }, [category, search, babies]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/articles`;
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (params.toString()) url += '?' + params.toString();

      const res = await fetch(url);
      const data = await res.json();
      if (data.ok) setArticles(data.articles);
    } catch (err) {
      console.error('Error fetching articles:', err);
    }
    setLoading(false);
  };

  const fetchBookmarks = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/articles/bookmarks/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setBookmarks(data.bookmarks.map((b) => b._id));
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  const handleBookmark = async (articleId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/articles/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ articleId }),
      });
      const data = await res.json();
      if (data.ok) {
        if (data.bookmarked) {
          setBookmarks([...bookmarks, articleId]);
        } else {
          setBookmarks(bookmarks.filter((id) => id !== articleId));
        }
      }
    } catch (err) {
      alert(`✗ Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📚 Articles & Tips</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : babies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">👶 No Baby Added Yet</h2>
            <p className="text-gray-600 mb-6">Add a baby first to read articles.</p>
            <Link to="/babies/add" className="inline-flex rounded-2xl bg-pink-500 text-white px-6 py-3 font-semibold hover:bg-pink-600 transition">
              ➕ Add Baby
            </Link>
          </div>
        ) : (
        <>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Categories</option>
              <option value="feeding">🍼 Feeding</option>
              <option value="sleep">😴 Sleep</option>
              <option value="health">🏥 Health</option>
              <option value="development">👶 Development</option>
            </select>
          </div>
        </div>

        {/* Selected Article */}
        {selectedArticle && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedArticle.title}</h2>
                <p className="text-sm text-gray-600 mt-2">Category: {selectedArticle.category}</p>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="prose prose-sm text-gray-700 mb-4">
              <p>{selectedArticle.content}</p>
            </div>
            <button
              onClick={() => handleBookmark(selectedArticle._id)}
              className={`${
                bookmarks.includes(selectedArticle._id)
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              } text-white font-bold py-2 px-4 rounded-lg transition`}
            >
              {bookmarks.includes(selectedArticle._id) ? '⭐ Bookmarked' : '☆ Bookmark'}
            </button>
          </div>
        )}

        {/* Articles List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : articles.length === 0 ? (
            <p className="text-gray-600">No articles found.</p>
          ) : (
            articles.map((article) => (
              <div
                key={article._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{article.content.substring(0, 100)}...</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(article._id);
                    }}
                    className="ml-4 text-2xl"
                  >
                    {bookmarks.includes(article._id) ? '⭐' : '☆'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}
