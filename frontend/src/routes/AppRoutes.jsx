import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import LibrarianLayout from '../layouts/LibrarianLayout';
import MemberLayout from '../layouts/MemberLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Books from '../pages/Books';
import Members from '../pages/Members';
import Issues from '../pages/Issues';
import NotFound from '../pages/NotFound';
import MemberDashboard from '../pages/member/MemberDashboard';
import MemberBrowseBooks from '../pages/member/MemberBrowseBooks';
import MemberMyBooks from '../pages/member/MemberMyBooks';
import MemberProfile from '../pages/member/MemberProfile';
import { ROLES, ROUTES } from '../utils/constants';

const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

    <Route
      path="/librarian"
      element={
        <ProtectedRoute allowedRole={ROLES.LIBRARIAN}>
          <LibrarianLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="books" element={<Books />} />
      <Route path="members" element={<Members />} />
      <Route path="issues" element={<Issues />} />
    </Route>

    <Route
      path="/member"
      element={
        <ProtectedRoute allowedRole={ROLES.MEMBER}>
          <MemberLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<MemberDashboard />} />
      <Route path="browse" element={<MemberBrowseBooks />} />
      <Route path="my-books" element={<MemberMyBooks />} />
      <Route path="profile" element={<MemberProfile />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
