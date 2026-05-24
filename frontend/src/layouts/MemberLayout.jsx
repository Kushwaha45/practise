import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MemberSidebar from '../components/MemberSidebar';
import Navbar from '../components/Navbar';
import { ROUTES } from '../utils/constants';

const pageTitles = {
  [ROUTES.MEMBER.DASHBOARD]: 'Member Dashboard',
  [ROUTES.MEMBER.BROWSE]: 'Browse Books',
  [ROUTES.MEMBER.MY_BOOKS]: 'My Issued Books',
  [ROUTES.MEMBER.PROFILE]: 'My Profile',
};

const MemberLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Member Portal';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <MemberSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Navbar title={title} subtitle="Member Portal" onMenuClick={() => setSidebarOpen(true)} accent="emerald" />
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
