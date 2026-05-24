import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

const navItems = [
  { path: ROUTES.MEMBER.DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.MEMBER.BROWSE, label: 'Browse Books', icon: '📚' },
  { path: ROUTES.MEMBER.MY_BOOKS, label: 'My Books', icon: '📖' },
  { path: ROUTES.MEMBER.PROFILE, label: 'My Profile', icon: '👤' },
];

const MemberSidebar = ({ isOpen, onClose }) => {
  const { member, logout } = useAuth();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-emerald-900 text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-emerald-700 px-6 py-4">
          <span className="text-xl font-bold">👤 Member Portal</span>
          {member && <p className="mt-1 truncate text-xs text-emerald-200">{member.name}</p>}
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.MEMBER.DASHBOARD}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-emerald-600 text-white' : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-emerald-700 p-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-emerald-100 hover:bg-emerald-800 hover:text-white"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default MemberSidebar;
