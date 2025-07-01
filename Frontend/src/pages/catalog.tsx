import React, { useState } from 'react';
import {Link} from 'react-router-dom'

// Type definitions
interface Book {
  id: number;
  title: string;
  author: string;
  status: 'borrowed' | 'available' | 'overdue';
  category: string;
  price?: string;
  image: string;
}

interface StatusBadge {
  class: string;
  text: string;
}

type BookStatus = 'borrowed' | 'available' | 'overdue';
type Category = 'All categories' | 'Romance' | 'Poetry' | 'Fiction' | 'Non-Fiction';

const LibraryHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All categories');

  // Sample book data based on the image
  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: 'Love is Enough',
      author: 'Fr. Innocent',
      status: 'borrowed',
      category: 'Romance',
      image: '/api/placeholder/150/200'
    },
    {
      id: 2,
      title: 'Love is Enough',
      author: 'Fr. Innocent',
      status: 'borrowed',
      category: 'Romance',
      image: '/api/placeholder/150/200'
    },
    {
      id: 3,
      title: 'Love is Enough',
      author: 'Fr. Innocent',
      status: 'available',
      category: 'Romance',
      image: '/api/placeholder/150/200'
    },
    {
      id: 4,
      title: 'Love is Enough',
      author: 'Fr. Innocent',
      status: 'available',
      category: 'Romance',
      image: '/api/placeholder/150/200'
    },
    {
      id: 5,
      title: 'Milk and Honey',
      author: 'Rupi Kaur',
      status: 'available',
      category: 'Poetry',
      image: '/api/placeholder/150/200'
    },
    {
      id: 6,
      title: 'Milk and Honey',
      author: 'Rupi Kaur',
      status: 'overdue',
      category: 'Poetry',
      image: '/api/placeholder/150/200'
    },
    {
      id: 7,
      title: 'Love is Enough',
      author: 'Fr. Innocent',
      status: 'borrowed',
      category: 'Romance',
      price: '$10',
      image: '/api/placeholder/150/200'
    },
    {
      id: 8,
      title: 'Milk and Honey',
      author: 'Rupi Kaur',
      status: 'available',
      category: 'Poetry',
      image: '/api/placeholder/150/200'
    }
  ]);

  const categories: Category[] = ['All categories', 'Romance', 'Poetry', 'Fiction', 'Non-Fiction'];

  const getStatusBadge = (status: BookStatus): StatusBadge => {
    const badges: Record<BookStatus, StatusBadge> = {
      borrowed: { class: 'bg-danger', text: 'Borrowed' },
      available: { class: 'bg-success', text: 'Available' },
      overdue: { class: 'bg-warning text-dark', text: 'Overdue' }
    };
    return badges[status];
  };

  const getButtonVariant = (status: BookStatus): string => {
    return status === 'available' ? 'primary' : 'outline-primary';
  };

  const filteredBooks: Book[] = books.filter((book: Book) => {
    const matchesSearch: boolean = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory: boolean = selectedCategory === 'All categories' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBorrow = (bookId: number): void => {
    setBooks(books.map((book: Book) => 
      book.id === bookId 
        ? { ...book, status: book.status === 'available' ? 'borrowed' : 'available' }
        : book
    ));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCategory(e.target.value as Category);
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <div className="me-2" style={{ width: '24px', height: '24px', backgroundColor: '#8b5cf6' }}>
              <svg viewBox="0 0 24 24" fill="white" className="w-100 h-100 p-1">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
            </div>
            <span className="fw-bold" style={{ color: '#8b5cf6' }}>LibraryHub</span>
          </a>
          
          <div className="navbar-nav ms-auto">
            <Link to="/" className="nav-link text-muted" >Home</Link>
           <Link to="/catalog" className="nav-link text-muted" style={{ color: '#8b5cf6' }}>Catalog</Link>
            <Link to="/mybooks"className="nav-link text-muted" >MyBooks</Link>
            <div className="nav-link">
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
                   style={{ width: '32px', height: '32px' }}>
                <span className="text-muted">👤</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <h2 className="mb-4 fw-bold">Available books</h2>
        
        {/* Search and Filter Section */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-lg ps-5"
                placeholder="Search books..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ backgroundColor: 'white', border: '1px solid #e9ecef' }}
              />
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                <svg width="20" height="20" fill="#6c757d" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <select 
              className="form-select form-select-lg"
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ backgroundColor: 'white', border: '1px solid #e9ecef' }}
            >
              {categories.map((category: Category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Books Grid */}
        <div className="row g-4">
          {filteredBooks.map((book: Book) => {
            const statusBadge: StatusBadge = getStatusBadge(book.status);
            return (
              <div key={book.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: 'white' }}>
                  <div className="position-relative">
                    <div 
                      className="card-img-top d-flex align-items-center justify-content-center"
                      style={{ 
                        height: '200px', 
                        backgroundColor: '#e9ecef',
                        backgroundImage: 'linear-gradient(45deg, #d4b5a0 25%, transparent 25%), linear-gradient(-45deg, #d4b5a0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4b5a0 75%), linear-gradient(-45deg, transparent 75%, #d4b5a0 75%)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                      }}
                    >
                      <div className="text-center">
                        <div className="mb-2" style={{ fontSize: '3rem', opacity: 0.3 }}>📚</div>
                        <small className="text-muted">Book Cover</small>
                      </div>
                    </div>
                    <span className={`position-absolute top-0 end-0 badge ${statusBadge.class} m-2`}>
                      {statusBadge.text}
                    </span>
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-bold mb-1">{book.title}</h6>
                    <p className="card-text text-muted small mb-2">by {book.author}</p>
                    {book.price && (
                      <p className="card-text fw-bold text-success mb-2">{book.price}</p>
                    )}
                    <div className="mt-auto">
                      <button 
                        className={`btn btn-${getButtonVariant(book.status)} w-100`}
                        style={{ backgroundColor: book.status === 'available' ? '#8b5cf6' : 'transparent', borderColor: '#8b5cf6' }}
                        onClick={() => handleBorrow(book.id)}
                      >
                        {book.status === 'available' ? 'Borrow' : 'Return'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
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