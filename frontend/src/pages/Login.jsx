import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROUTES } from '../utils/constants';

const Login = () => {
  const { isAuthenticated, role, loginAsLibrarian, loginAsMember } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return (
      <Navigate
        to={role === ROLES.MEMBER ? ROUTES.MEMBER.DASHBOARD : ROUTES.LIBRARIAN.DASHBOARD}
        replace
      />
    );
  }

  const handleMemberLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    try {
      await loginAsMember(email);
    } catch {
      // toast handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-slate-800 p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center text-white">
          <h1 className="text-3xl font-bold">📖 Library Management System</h1>
          <p className="mt-2 text-slate-300">Select your role to continue</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card border-0 shadow-xl">
            <div className="mb-4 text-4xl">👨‍💼</div>
            <h2 className="text-xl font-bold text-slate-900">Librarian</h2>
            <p className="mt-2 text-sm text-slate-600">
              Manage books, members, issue and return books, and view library statistics.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-slate-500">
              <li>• Add / edit / delete books</li>
              <li>• Register and manage members</li>
              <li>• Issue & return books</li>
              <li>• Full admin dashboard</li>
            </ul>
            <button type="button" onClick={loginAsLibrarian} className="btn-primary mt-6 w-full">
              Enter as Librarian
            </button>
          </div>

          <div className="card border-0 shadow-xl">
            <div className="mb-4 text-4xl">👤</div>
            <h2 className="text-xl font-bold text-slate-900">Library Member</h2>
            <p className="mt-2 text-sm text-slate-600">
              Browse available books, view your issued books, and manage your profile.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-slate-500">
              <li>• Browse available books</li>
              <li>• Search by title or author</li>
              <li>• View your issued books</li>
              <li>• Update your profile</li>
            </ul>
            <form onSubmit={handleMemberLogin} className="mt-6 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Registered Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="john.doe@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Enter as Member'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
