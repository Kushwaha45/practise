import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { memberApi } from '../../api/memberApi';
import { extractErrorMessage } from '../../utils/helpers';
import { toast } from 'react-toastify';

const MemberProfile = () => {
  const { member, updateMemberSession } = useAuth();
  const { updateMember, loading } = useApp();
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    address: member?.address || '',
  });
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateMember(member.id, formData);
      const response = await memberApi.getById(member.id);
      updateMemberSession(response.data.data);
      setEditing(false);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: member?.name || '',
      email: member?.email || '',
      phone: member?.phone || '',
      address: member?.address || '',
    });
    setErrors({});
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="page-title">My Profile</h2>
          <p className="mt-1 text-sm text-slate-500">View and update your member details</p>
        </div>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="btn-primary">
            Edit Profile
          </button>
        )}
      </div>

      <div className="card max-w-xl">
        {editing ? (
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
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary" disabled={loading}>
                Save Changes
              </button>
              <button type="button" onClick={cancelEdit} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="space-y-4">
            {[
              ['Name', member?.name],
              ['Email', member?.email],
              ['Phone', member?.phone],
              ['Address', member?.address],
              ['Active Books', member?.activeIssuesCount ?? 0],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-slate-100 pb-3">
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="mt-1 font-medium text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;
