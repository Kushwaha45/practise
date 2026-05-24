import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, getDefaultDueDate } from '../utils/helpers';
import { MAX_BOOKS_PER_MEMBER } from '../utils/constants';

const Issues = () => {
  const {
    activeIssues,
    loading,
    fetchActiveIssues,
    fetchAvailableBooks,
    fetchMembers,
    issueBook,
    returnBook,
    members,
  } = useApp();

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    memberId: '',
    dueDate: getDefaultDueDate(),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchActiveIssues();
    fetchMembers();
  }, [fetchActiveIssues, fetchMembers]);

  const openIssueModal = async () => {
    const books = await fetchAvailableBooks();
    setAvailableBooks(books);
    setIssueForm({ bookId: '', memberId: '', dueDate: getDefaultDueDate() });
    setErrors({});
    setIsIssueModalOpen(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!issueForm.bookId) newErrors.bookId = 'Book is required';
    if (!issueForm.memberId) newErrors.memberId = 'Member is required';
    if (!issueForm.dueDate) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const member = members.find((m) => m.id === Number(issueForm.memberId));
    if (member && member.activeIssuesCount >= MAX_BOOKS_PER_MEMBER) {
      setErrors({ memberId: `Member can issue maximum ${MAX_BOOKS_PER_MEMBER} books` });
      return;
    }

    try {
      await issueBook({
        bookId: Number(issueForm.bookId),
        memberId: Number(issueForm.memberId),
        dueDate: issueForm.dueDate,
      });
      setIsIssueModalOpen(false);
      await fetchActiveIssues();
      await fetchMembers();
    } catch {
      // handled in context
    }
  };

  const handleReturn = async (issueId) => {
    try {
      await returnBook(issueId);
      await fetchActiveIssues();
      await fetchMembers();
    } catch {
      // handled in context
    }
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="page-title">Issue Management</h2>
          <p className="mt-1 text-sm text-slate-500">Issue and return books</p>
        </div>
        <button type="button" onClick={openIssueModal} className="btn-primary">
          + Issue Book
        </button>
      </div>

      {loading && activeIssues.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-x-auto">
          <h3 className="mb-4 text-lg font-semibold">Active Issues</h3>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 pr-4 font-medium">Book</th>
                <th className="pb-3 pr-4 font-medium">Member</th>
                <th className="pb-3 pr-4 font-medium">Issue Date</th>
                <th className="pb-3 pr-4 font-medium">Due Date</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeIssues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No active issues
                  </td>
                </tr>
              ) : (
                activeIssues.map((issue) => (
                  <tr key={issue.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{issue.bookTitle}</div>
                      <div className="text-xs text-slate-500">{issue.bookAuthor}</div>
                    </td>
                    <td className="py-3 pr-4">{issue.memberName}</td>
                    <td className="py-3 pr-4">{formatDate(issue.issueDate)}</td>
                    <td className="py-3 pr-4">
                      <span className={isOverdue(issue.dueDate) ? 'font-medium text-red-600' : ''}>
                        {formatDate(issue.dueDate)}
                        {isOverdue(issue.dueDate) && ' (Overdue)'}
                      </span>
                    </td>
                    <td className="py-3">
                      <button type="button" onClick={() => handleReturn(issue.id)} className="btn-primary py-1 text-xs">
                        Return
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Issue Book">
        <form onSubmit={handleIssue} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Book</label>
            <select
              className="input-field"
              value={issueForm.bookId}
              onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
            >
              <option value="">Select a book</option>
              {availableBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author} ({book.availableCopies} available)
                </option>
              ))}
            </select>
            {errors.bookId && <p className="mt-1 text-xs text-red-600">{errors.bookId}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Member</label>
            <select
              className="input-field"
              value={issueForm.memberId}
              onChange={(e) => setIssueForm({ ...issueForm, memberId: e.target.value })}
            >
              <option value="">Select a member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.activeIssuesCount ?? 0}/{MAX_BOOKS_PER_MEMBER} books)
                </option>
              ))}
            </select>
            {errors.memberId && <p className="mt-1 text-xs text-red-600">{errors.memberId}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Due Date</label>
            <input
              type="date"
              className="input-field"
              value={issueForm.dueDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
            />
            {errors.dueDate && <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsIssueModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              Issue Book
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Issues;
