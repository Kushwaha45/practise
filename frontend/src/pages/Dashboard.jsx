import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { stats, fetchStats, loading } = useApp();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Overview of your library statistics</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Books" value={stats?.totalBooks} icon="📚" color="primary" />
        <StatCard title="Available Books" value={stats?.availableBooks} icon="✅" color="green" />
        <StatCard title="Issued Books" value={stats?.issuedBooks} icon="📤" color="amber" />
        <StatCard title="Total Members" value={stats?.totalMembers} icon="👥" color="purple" />
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
        <p className="mt-2 text-sm text-slate-600">
          Use the sidebar to manage books, register members, issue books, and process returns.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
