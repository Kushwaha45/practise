import api from './axios';

export const bookApi = {
  getAll: () => api.get('/books'),
  getAvailable: () => api.get('/books/available'),
  searchByTitle: (title) => api.get(`/books/title/${encodeURIComponent(title)}`),
  searchByAuthor: (author) => api.get(`/books/author/${encodeURIComponent(author)}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};
