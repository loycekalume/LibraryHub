import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

interface Book {
  book_id: number;
  title: string;
  author: string;
  image_url: string | null;
  genre: string;
  total_copies: number;
  available_copies: number;
}

const LibraryHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All categories');
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>(['All categories']);

useEffect(() => {
  const fetchBooks = async () => {
    try {
      const res = await axios.get('/books/overview');

      const normalized: Book[] = (res.data.books || []).map((b: any) => {
      

        return {
          book_id: b.book_id,
          title: b.title,
          author: b.author,
          image_url: b.image_url,
          genre: b.genre ?? b.book_genre ?? b.Genre ?? "", 
          total_copies: b.total_copies ?? 0,
          available_copies: b.available_copies ?? 0,
        };
      });

      setBooks(normalized);

      const uniqueGenres = Array.from(
        new Set(normalized.map((b) => b.genre).filter(Boolean))
      );

    

      setCategories(['All categories', ...uniqueGenres]);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  };

  fetchBooks();
}, []);


  const getFilteredBooks = () => {
    return books.filter((book) => {
      const title = book.title || "";
      const author = book.author || "";
      const genre = (book.genre || "").toLowerCase().trim();
      const search = searchQuery.toLowerCase().trim();
      const selected = selectedCategory.toLowerCase().trim();

      const matchesSearch =
        title.toLowerCase().includes(search) ||
        author.toLowerCase().includes(search);

      const matchesCategory =
        selected === "all categories" || genre === selected;

      return matchesSearch && matchesCategory;
    });
  };

  const filtered = getFilteredBooks();

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/" style={{ color: '#8b5cf6' }}>
            LibraryHub
          </Link>
          <div className="navbar-nav ms-auto">
            <Link to="/" className="nav-link text-muted">Home</Link>
            <Link to="/catalog" className="nav-link fw-bold" style={{ color: '#8b5cf6' }}>Catalog</Link>
            <Link to="/mybooks" className="nav-link text-muted">MyBooks</Link>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <h2 className="mb-4 fw-bold">Available books</h2>

        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select form-select-lg"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Book Cards */}
        <div className="row g-4">
          {filtered.map((book) => (
            <div key={book.book_id} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="position-relative">
                  <img
                    src={book.image_url || '/book-placeholder.jpg'}
                    className="card-img-top"
                    alt={book.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <span className={`position-absolute top-0 end-0 badge ${book.available_copies > 0 ? 'bg-success' : 'bg-danger'} m-2`}>
                    {book.available_copies > 0 ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold mb-1">{book.title}</h6>
                  <p className="card-text text-muted small mb-2">by {book.author}</p>
                  <p className="card-text text-muted small mb-2">
                    {book.available_copies} of {book.total_copies} copies
                  </p>
                  <div className="mt-auto">
                    <button
                      className="btn btn-outline-secondary w-100"
                      disabled
                    >
                      Borrow at library
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filtered.length === 0 && (
          <div className="text-center py-5">
            <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>📚</div>
            <h5 className="text-muted">No books found</h5>
            <p className="text-muted">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryHub;
