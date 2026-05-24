export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const ROLES = {
  LIBRARIAN: 'LIBRARIAN',
  MEMBER: 'MEMBER',
};

export const ROUTES = {
  LOGIN: '/login',
  LIBRARIAN: {
    DASHBOARD: '/librarian',
    BOOKS: '/librarian/books',
    MEMBERS: '/librarian/members',
    ISSUES: '/librarian/issues',
  },
  MEMBER: {
    DASHBOARD: '/member',
    BROWSE: '/member/browse',
    MY_BOOKS: '/member/my-books',
    PROFILE: '/member/profile',
  },
};

export const MAX_BOOKS_PER_MEMBER = 3;

export const AUTH_STORAGE_KEY = 'library_auth';
