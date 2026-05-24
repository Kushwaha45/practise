import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ROUTES, MAX_BOOKS_PER_MEMBER } from '../../utils/constants';

const MemberDashboard = () => {
  const { member } = useAuth();
  const { fetchAvailableBooks, getMemberIssuedBooks, loading } = useApp();
  const [availableCount, setAvailableCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!member?.id) return;
      const [available, issuedResult] = await Promise.all([
        fetchAvailableBooks(),
        getMemberIssuedBooks(member.id),
      ]);
      setAvailableCount(available.length);
      const issued = issuedResult.data || [];
      const active = issued.filter((i) => !i.returned);
      setActiveCount(active.length);
      setOverdueCount(active.filter((i) => new Date(i.dueDate) < new Date()).length);
    };
    load();
  }, [member, fetchAvailableBooks, getMemberIssuedBooks]);

  if (loading && availableCount === 0 && activeCount === 0) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Welcome, {member?.name}!</h2>
        <p className="mt-1 text-sm text-slate-500">Your library member dashboard</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Books Available" value={availableCount} icon="📚" color="green" />
        <StatCard title="My Active Books" value={activeCount} icon="📖" color="primary" />
        <StatCard title="Overdue Books" value={overdueCount} icon="⚠️" color="amber" />
        <StatCard
          title="Borrow Limit"
          value={`${activeCount}/${MAX_BOOKS_PER_MEMBER}`}
          icon="📋"
          color="purple"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold text-slate-900">Quick Links</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to={ROUTES.MEMBER.BROWSE} className="btn-primary">
              Browse Books
            </Link>
            <Link to={ROUTES.MEMBER.MY_BOOKS} className="btn-secondary">
              My Issued Books
            </Link>
            <Link to={ROUTES.MEMBER.PROFILE} className="btn-secondary">
              My Profile
            </Link>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold text-slate-900">Member Info</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium">{member?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Phone</dt>
              <dd className="font-medium">{member?.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Active Issues</dt>
              <dd className="font-medium">{activeCount}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
