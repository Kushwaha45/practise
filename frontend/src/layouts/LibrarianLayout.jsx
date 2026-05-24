import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LibrarianSidebar from '../components/LibrarianSidebar';
import Navbar from '../components/Navbar';
import { ROUTES } from '../utils/constants';

const pageTitles = {
  [ROUTES.LIBRARIAN.DASHBOARD]: 'Librarian Dashboard',
  [ROUTES.LIBRARIAN.BOOKS]: 'Book Management',
  [ROUTES.LIBRARIAN.MEMBERS]: 'Member Management',
  [ROUTES.LIBRARIAN.ISSUES]: 'Issue Management',
};

const LibrarianLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Librarian Portal';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <LibrarianSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Navbar title={title} subtitle="Librarian Portal" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LibrarianLayout;
