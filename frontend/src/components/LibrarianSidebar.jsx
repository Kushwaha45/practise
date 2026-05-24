import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

const navItems = [
  { path: ROUTES.LIBRARIAN.DASHBOARD, label: 'Dashboard', icon: '📊' },
  { path: ROUTES.LIBRARIAN.BOOKS, label: 'Books', icon: '📚' },
  { path: ROUTES.LIBRARIAN.MEMBERS, label: 'Members', icon: '👥' },
  { path: ROUTES.LIBRARIAN.ISSUES, label: 'Issue Management', icon: '📋' },
];

const LibrarianSidebar = ({ isOpen, onClose }) => (
  <>
    {isOpen && (
      <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} aria-hidden="true" />
    )}
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center border-b border-slate-700 px-6">
        <span className="text-xl font-bold">📖 Librarian</span>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === ROUTES.LIBRARIAN.DASHBOARD}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full border-t border-slate-700 p-4">
        <LogoutButton />
      </div>
    </aside>
  </>
);

const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <button
      type="button"
      onClick={logout}
      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
    >
      🚪 Logout
    </button>
  );
};

export default LibrarianSidebar;
