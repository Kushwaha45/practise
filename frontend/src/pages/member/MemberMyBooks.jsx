import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/helpers';

const MemberMyBooks = () => {
  const { member } = useAuth();
  const { getMemberIssuedBooks, loading } = useApp();
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!member?.id) return;
    getMemberIssuedBooks(member.id).then((result) => setIssuedBooks(result.data || []));
  }, [member, getMemberIssuedBooks]);

  const filtered = issuedBooks.filter((issue) => {
    if (filter === 'active') return !issue.returned;
    if (filter === 'returned') return issue.returned;
    return true;
  });

  const isOverdue = (issue) => !issue.returned && new Date(issue.dueDate) < new Date();

  if (loading && issuedBooks.length === 0) {
    return <LoadingSpinner message="Loading your books..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="page-title">My Issued Books</h2>
          <p className="mt-1 text-sm text-slate-500">Track your borrowed books and due dates</p>
        </div>
        <select className="input-field w-full sm:w-48" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 pr-4 font-medium">Book</th>
              <th className="pb-3 pr-4 font-medium">Issue Date</th>
              <th className="pb-3 pr-4 font-medium">Due Date</th>
              <th className="pb-3 pr-4 font-medium">Return Date</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No books found
                </td>
              </tr>
            ) : (
              filtered.map((issue) => (
                <tr key={issue.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4">
                    <div className="font-medium">{issue.bookTitle}</div>
                    <div className="text-xs text-slate-500">{issue.bookAuthor}</div>
                  </td>
                  <td className="py-3 pr-4">{formatDate(issue.issueDate)}</td>
                  <td className="py-3 pr-4">
                    <span className={isOverdue(issue) ? 'font-medium text-red-600' : ''}>
                      {formatDate(issue.dueDate)}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{formatDate(issue.returnDate)}</td>
                  <td className="py-3">
                    {issue.returned ? (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        Returned
                      </span>
                    ) : isOverdue(issue) ? (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                        Overdue
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberMyBooks;
