import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { memberApi } from '../api/memberApi';
import { AUTH_STORAGE_KEY, ROLES, ROUTES } from '../utils/constants';
import { extractErrorMessage } from '../utils/helpers';

const AuthContext = createContext(null);

const loadStoredAuth = () => {
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(loadStoredAuth);

  const persistAuth = useCallback((nextAuth) => {
    setAuth(nextAuth);
    if (nextAuth) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const loginAsLibrarian = useCallback(() => {
    persistAuth({ role: ROLES.LIBRARIAN, member: null });
    toast.success('Welcome, Librarian!');
    navigate(ROUTES.LIBRARIAN.DASHBOARD);
  }, [navigate, persistAuth]);

  const loginAsMember = useCallback(async (email) => {
    try {
      const response = await memberApi.getByEmail(email.trim());
      const member = response.data.data;
      persistAuth({ role: ROLES.MEMBER, member });
      toast.success(`Welcome, ${member.name}!`);
      navigate(ROUTES.MEMBER.DASHBOARD);
      return member;
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    }
  }, [navigate, persistAuth]);

  const logout = useCallback(() => {
    persistAuth(null);
    toast.info('Logged out successfully');
    navigate(ROUTES.LOGIN);
  }, [navigate, persistAuth]);

  const updateMemberSession = useCallback((member) => {
    if (auth?.role === ROLES.MEMBER) {
      persistAuth({ ...auth, member });
    }
  }, [auth, persistAuth]);

  const value = useMemo(
    () => ({
      auth,
      role: auth?.role ?? null,
      member: auth?.member ?? null,
      isLibrarian: auth?.role === ROLES.LIBRARIAN,
      isMember: auth?.role === ROLES.MEMBER,
      isAuthenticated: Boolean(auth?.role),
      loginAsLibrarian,
      loginAsMember,
      logout,
      updateMemberSession,
    }),
    [auth, loginAsLibrarian, loginAsMember, logout, updateMemberSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
