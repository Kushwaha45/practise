import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-center">
    <h1 className="text-6xl font-bold text-primary-600">404</h1>
    <p className="mt-4 text-xl font-medium text-slate-900">Page Not Found</p>
    <p className="mt-2 text-slate-500">The page you are looking for does not exist.</p>
    <Link to={ROUTES.LOGIN} className="btn-primary mt-6">
      Go to Login
    </Link>
  </div>
);

export default NotFound;
