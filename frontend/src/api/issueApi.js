import api from './axios';

export const issueApi = {
  getAll: () => api.get('/issues'),
  getActive: () => api.get('/issues/active'),
  issueBook: (data) => api.post('/issues/issue', data),
  returnBook: (issueId) => api.put(`/issues/return/${issueId}`),
};
