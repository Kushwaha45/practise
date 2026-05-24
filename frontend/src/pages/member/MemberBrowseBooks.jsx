import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const MemberBrowseBooks = () => {
  const { fetchAvailableBooks, searchBooksByTitle, searchBooksByAuthor, loading } = useApp();
  const [books, setBooks] = useState([]);
  const [searchType, setSearchType] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAvailableBooks().then(setBooks);
  }, [fetchAvailableBooks]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      const available = await fetchAvailableBooks();
      setBooks(available);
      return;
    }
    try {
      const result =
        searchType === 'title'
          ? await searchBooksByTitle(searchQuery)
          : await searchBooksByAuthor(searchQuery);
      const availableOnly = (result.data || []).filter((b) => b.available);
      setBooks(availableOnly);
    } catch {
      // handled in context
    }
  };

  const clearSearch = async () => {
    setSearchQuery('');
    const available = await fetchAvailableBooks();
    setBooks(available);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Browse Available Books</h2>
        <p className="mt-1 text-sm text-slate-500">Search and explore books you can borrow</p>
      </div>

      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">Search</label>
            <input
              type="text"
              className="input-field"
              placeholder={`Search by ${searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Search By</label>
            <select className="input-field" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Search</button>
          {searchQuery && (
            <button type="button" onClick={clearSearch} className="btn-secondary">Clear</button>
          )}
        </form>
      </div>

      {loading && books.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.length === 0 ? (
            <p className="col-span-full py-8 text-center text-slate-500">No available books found</p>
          ) : (
            books.map((book) => (
              <div key={book.id} className="card hover:shadow-md transition">
                <h3 className="font-semibold text-slate-900">{book.title}</h3>
                <p className="mt-1 text-sm text-slate-600">by {book.author}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{book.category}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">
                    {book.availableCopies} available
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">ISBN: {book.isbn}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MemberBrowseBooks;
