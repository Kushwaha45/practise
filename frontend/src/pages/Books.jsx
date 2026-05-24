import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const emptyBook = { title: '', author: '', isbn: '', category: '', totalCopies: 1 };

const Books = () => {
  const {
    books,
    loading,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    searchBooksByTitle,
    searchBooksByAuthor,
  } = useApp();

  const [formData, setFormData] = useState(emptyBook);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchType, setSearchType] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const displayBooks = searchResults ?? books;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.totalCopies || formData.totalCopies < 1) newErrors.totalCopies = 'Must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setEditingBook(null);
    setFormData(emptyBook);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      totalCopies: book.totalCopies,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingBook) {
        await updateBook(editingBook.id, formData);
      } else {
        await createBook(formData);
      }
      setIsModalOpen(false);
      setSearchResults(null);
      setSearchQuery('');
      await fetchBooks();
    } catch {
      // handled in context
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBook(deleteTarget.id);
      setIsDeleteOpen(false);
      setDeleteTarget(null);
      setSearchResults(null);
      await fetchBooks();
    } catch {
      // handled in context
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const result =
        searchType === 'title'
          ? await searchBooksByTitle(searchQuery)
          : await searchBooksByAuthor(searchQuery);
      setSearchResults(result.data || []);
    } catch {
      // handled in context
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="page-title">Books</h2>
          <p className="mt-1 text-sm text-slate-500">Manage library book inventory</p>
        </div>
        <button type="button" onClick={openAddModal} className="btn-primary">
          + Add Book
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search by ${searchType}...`}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Search By</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="input-field"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
          {searchResults && (
            <button type="button" onClick={clearSearch} className="btn-secondary">
              Clear
            </button>
          )}
        </form>
      </div>

      {loading && books.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 pr-4 font-medium">Title</th>
                <th className="pb-3 pr-4 font-medium">Author</th>
                <th className="pb-3 pr-4 font-medium">ISBN</th>
                <th className="pb-3 pr-4 font-medium">Category</th>
                <th className="pb-3 pr-4 font-medium">Copies</th>
                <th className="pb-3 pr-4 font-medium">Available</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayBooks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No books found
                  </td>
                </tr>
              ) : (
                displayBooks.map((book) => (
                  <tr key={book.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium">{book.title}</td>
                    <td className="py-3 pr-4">{book.author}</td>
                    <td className="py-3 pr-4">{book.isbn}</td>
                    <td className="py-3 pr-4">{book.category}</td>
                    <td className="py-3 pr-4">
                      {book.availableCopies}/{book.totalCopies}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          book.available
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {book.available ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEditModal(book)} className="text-primary-600 hover:underline">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget(book);
                            setIsDeleteOpen(true);
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBook ? 'Edit Book' : 'Add Book'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['title', 'author', 'isbn', 'category'].map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium capitalize">{field}</label>
              <input
                className="input-field"
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
              {errors[field] && <p className="mt-1 text-xs text-red-600">{errors[field]}</p>}
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium">Total Copies</label>
            <input
              type="number"
              min="1"
              className="input-field"
              value={formData.totalCopies}
              onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value, 10) || '' })}
            />
            {errors.totalCopies && <p className="mt-1 text-xs text-red-600">{errors.totalCopies}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {editingBook ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default Books;
