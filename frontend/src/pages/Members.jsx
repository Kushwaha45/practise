import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';

const emptyMember = { name: '', email: '', phone: '', address: '' };

const Members = () => {
  const {
    members,
    loading,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
    getMemberIssuedBooks,
  } = useApp();

  const [formData, setFormData] = useState(emptyMember);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBooksModalOpen, setIsBooksModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormData(emptyMember);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingMember) {
        await updateMember(editingMember.id, formData);
      } else {
        await createMember(formData);
      }
      setIsModalOpen(false);
      await fetchMembers();
    } catch {
      // handled in context
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMember(deleteTarget.id);
      setIsDeleteOpen(false);
      setDeleteTarget(null);
      await fetchMembers();
    } catch {
      // handled in context
    }
  };

  const viewIssuedBooks = async (member) => {
    setSelectedMember(member);
    try {
      const result = await getMemberIssuedBooks(member.id);
      setIssuedBooks(result.data || []);
      setIsBooksModalOpen(true);
    } catch {
      // handled in context
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="page-title">Members</h2>
          <p className="mt-1 text-sm text-slate-500">Register and manage library members</p>
        </div>
        <button type="button" onClick={openAddModal} className="btn-primary">
          + Register Member
        </button>
      </div>

      {loading && members.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Email</th>
                <th className="pb-3 pr-4 font-medium">Phone</th>
                <th className="pb-3 pr-4 font-medium">Active Issues</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium">{member.name}</td>
                    <td className="py-3 pr-4">{member.email}</td>
                    <td className="py-3 pr-4">{member.phone}</td>
                    <td className="py-3 pr-4">{member.activeIssuesCount ?? 0}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => viewIssuedBooks(member)} className="text-emerald-600 hover:underline">
                          Books
                        </button>
                        <button type="button" onClick={() => openEditModal(member)} className="text-primary-600 hover:underline">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget(member);
                            setIsDeleteOpen(true);
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Edit Member' : 'Register Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'phone', 'address'].map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium capitalize">{field}</label>
              <input
                className="input-field"
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
              {errors[field] && <p className="mt-1 text-xs text-red-600">{errors[field]}</p>}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {editingMember ? 'Update' : 'Register'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isBooksModalOpen}
        onClose={() => setIsBooksModalOpen(false)}
        title={`Books issued to ${selectedMember?.name}`}
        size="lg"
      >
        {issuedBooks.length === 0 ? (
          <p className="text-slate-500">No books issued to this member.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="pb-2 pr-4">Book</th>
                  <th className="pb-2 pr-4">Issue Date</th>
                  <th className="pb-2 pr-4">Due Date</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {issuedBooks.map((issue) => (
                  <tr key={issue.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{issue.bookTitle}</td>
                    <td className="py-2 pr-4">{formatDate(issue.issueDate)}</td>
                    <td className="py-2 pr-4">{formatDate(issue.dueDate)}</td>
                    <td className="py-2">{issue.returned ? 'Returned' : 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Member"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default Members;
