import { Link } from 'react-router-dom';

export default function Home() {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-lavender-100 flex items-center justify-center p-4">
      <div className="max-w-3xl rounded-[2rem] bg-white/90 border border-pink-200 p-8 shadow-xl backdrop-blur-lg">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-pink-600">MamaCare</h1>
          <p className="mt-4 text-lg text-gray-600">Baby tracker and support app for new moms in UAE.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to={token ? '/dashboard' : '/register'}
            className="rounded-3xl bg-pink-500 px-6 py-5 text-center text-white font-semibold shadow hover:bg-pink-600"
          >
            {token ? 'Go to Dashboard' : 'Create Account'}
          </Link>
          <Link
            to="/login"
            className="rounded-3xl border border-pink-200 px-6 py-5 text-center text-pink-700 font-semibold bg-white hover:bg-pink-50"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
