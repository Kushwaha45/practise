import api from './axios';

export const memberApi = {
  getAll: () => api.get('/members'),
  getById: (id) => api.get(`/members/${id}`),
  getByEmail: (email) => api.get(`/members/by-email/${encodeURIComponent(email)}`),
  getIssuedBooks: (id) => api.get(`/members/${id}/books`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
};
