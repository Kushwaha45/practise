import { createContext, useCallback, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { bookApi } from '../api/bookApi';
import { memberApi } from '../api/memberApi';
import { issueApi } from '../api/issueApi';
import { dashboardApi } from '../api/dashboardApi';
import { extractErrorMessage } from '../utils/helpers';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [activeIssues, setActiveIssues] = useState([]);
  const [stats, setStats] = useState(null);

  const handleRequest = useCallback(async (requestFn, successMessage) => {
    setLoading(true);
    try {
      const response = await requestFn();
      if (successMessage) toast.success(successMessage);
      return response.data;
    } catch (error) {
      toast.error(extractErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBooks = useCallback(async () => {
    const result = await handleRequest(() => bookApi.getAll());
    setBooks(result.data || []);
    return result.data;
  }, [handleRequest]);

  const fetchAvailableBooks = useCallback(async () => {
    const result = await handleRequest(() => bookApi.getAvailable());
    return result.data || [];
  }, [handleRequest]);

  const fetchMembers = useCallback(async () => {
    const result = await handleRequest(() => memberApi.getAll());
    setMembers(result.data || []);
    return result.data;
  }, [handleRequest]);

  const fetchIssues = useCallback(async () => {
    const result = await handleRequest(() => issueApi.getAll());
    setIssues(result.data || []);
    return result.data;
  }, [handleRequest]);

  const fetchActiveIssues = useCallback(async () => {
    const result = await handleRequest(() => issueApi.getActive());
    setActiveIssues(result.data || []);
    return result.data;
  }, [handleRequest]);

  const fetchStats = useCallback(async () => {
    const result = await handleRequest(() => dashboardApi.getStats());
    setStats(result.data);
    return result.data;
  }, [handleRequest]);

  const createBook = (data) => handleRequest(() => bookApi.create(data), 'Book added successfully');
  const updateBook = (id, data) => handleRequest(() => bookApi.update(id, data), 'Book updated successfully');
  const deleteBook = (id) => handleRequest(() => bookApi.delete(id), 'Book deleted successfully');

  const createMember = (data) => handleRequest(() => memberApi.create(data), 'Member registered successfully');
  const updateMember = (id, data) => handleRequest(() => memberApi.update(id, data), 'Member updated successfully');
  const deleteMember = (id) => handleRequest(() => memberApi.delete(id), 'Member deleted successfully');

  const issueBook = (data) => handleRequest(() => issueApi.issueBook(data), 'Book issued successfully');
  const returnBook = (issueId) => handleRequest(() => issueApi.returnBook(issueId), 'Book returned successfully');

  const searchBooksByTitle = (title) => handleRequest(() => bookApi.searchByTitle(title));
  const searchBooksByAuthor = (author) => handleRequest(() => bookApi.searchByAuthor(author));
  const getMemberIssuedBooks = (id) => handleRequest(() => memberApi.getIssuedBooks(id));

  const value = {
    loading,
    books,
    members,
    issues,
    activeIssues,
    stats,
    fetchBooks,
    fetchAvailableBooks,
    fetchMembers,
    fetchIssues,
    fetchActiveIssues,
    fetchStats,
    createBook,
    updateBook,
    deleteBook,
    createMember,
    updateMember,
    deleteMember,
    issueBook,
    returnBook,
    searchBooksByTitle,
    searchBooksByAuthor,
    getMemberIssuedBooks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
