import React, { useState } from 'react';
import {Link} from 'react-router-dom'

// Type definitions
interface MyBook {
  id: number;
  title: string;
  author: string;
  status: 'normal' | 'overdue' | 'due';
  category: 'all' | 'borrowed' | 'overdue' | 'due-soon';
  dueDate: string;
  image: string;
}

interface StatusFilter {
  key: 'all' | 'borrowed' | 'overdue' | 'due-soon';
  label: string;
  count: number;
  active: boolean;
}

type BookCategory = 'all' | 'borrowed' | 'overdue' | 'due-soon';
type BookStatus = 'normal' | 'overdue' | 'due';

const MyBooksPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<BookCategory>('all');

  // Sample user's book data
  const [userBooks, setUserBooks] = useState<MyBook[]>([
    {
      id: 1,
      title: 'Love is Enough',
      author: 'Fr. Innocent',
      status: 'normal',
      category: 'borrowed',
      dueDate: '25th May 2025',
      image: '/api/placeholder/150/200'
    },
    {
      id: 2,
      title: 'Love is Enough',
      author: 'Fr. Innocent',
      status: 'normal',
      category: 'borrowed',
      dueDate: '25th May 2025',
      image: '/api/placeholder/150/200'
    },
    {
      id: 3,
      title: 'Love is Enough',
      author: 'Fr. Innocent',
      status: 'normal',
      category: 'borrowed',
      dueDate: '25th May 2025',
      image: '/api/placeholder/150/200'
    },
    {
      id: 4,
      title: 'Milk and Honey',
      author: 'Rupi Kaur',
      status: 'normal',
      category: 'due-soon',
      dueDate: '20th May 2025',
      image: '/api/placeholder/150/200'
    },
    {
      id: 5,
      title: 'Milk and Honey',
      author: 'Rupi Kaur',
      status: 'due',
      category: 'due-soon',
      dueDate: '20th May 2025',
      image: '/api/placeholder/150/200'
    },
    {
      id: 6,
      title: 'Milk and Honey',
      author: 'Rupi Kaur',
      status: 'due',
      category: 'due-soon',
      dueDate: '20th May 2025',
      image: '/api/placeholder/150/200'
    },
    {
      id: 7,
      title: 'Love is Enough',
      author: 'Fr. Innocent',
      status: 'overdue',
      category: 'overdue',
      dueDate: '20th May 2025',
      image: '/api/placeholder/150/200'
    },
    {
      id: 8,
      title: 'Milk and Honey',
      author: 'Rupi Kaur',
      status: 'normal',
      category: 'borrowed',
      dueDate: '20th May 2025',
      image: '/api/placeholder/150/200'
    }
  ]);

  // Calculate counts for each filter
  const getFilterCounts = (): Record<BookCategory, number> => {
    return {
      all: userBooks.length,
      borrowed: userBooks.filter(book => book.category === 'borrowed').length,
      overdue: userBooks.filter(book => book.status === 'overdue').length,
      'due-soon': userBooks.filter(book => book.category === 'due-soon').length
    };
  };

  const filterCounts = getFilterCounts();

  const statusFilters: StatusFilter[] = [
    { key: 'all', label: 'All books', count: filterCounts.all, active: activeFilter === 'all' },
    { key: 'borrowed', label: 'Currently borrowed', count: filterCounts.borrowed, active: activeFilter === 'borrowed' },
    { key: 'overdue', label: 'Overdue', count: filterCounts.overdue, active: activeFilter === 'overdue' },
    { key: 'due-soon', label: 'Due soon', count: filterCounts['due-soon'], active: activeFilter === 'due-soon' }
  ];

  const getStatusBadge = (status: BookStatus): { class: string; text: string } => {
    const badges = {
      normal: { class: 'bg-success', text: 'Normal' },
      overdue: { class: 'bg-danger', text: 'Overdue' },
      due: { class: 'bg-warning text-dark', text: 'Due' }
    };
    return badges[status];
  };

  const filteredBooks: MyBook[] = userBooks.filter((book: MyBook) => {
    const matchesSearch: boolean = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter: boolean = true;
    if (activeFilter === 'borrowed') {
      matchesFilter = book.category === 'borrowed';
    } else if (activeFilter === 'overdue') {
      matchesFilter = book.status === 'overdue';
    } else if (activeFilter === 'due-soon') {
      matchesFilter = book.category === 'due-soon';
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleReturn = (bookId: number): void => {
    setUserBooks(userBooks.filter(book => book.id !== bookId));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter: BookCategory): void => {
    setActiveFilter(filter);
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
                <Link to="/catalog" className="nav-link text-muted">Catalog</Link>
                       
            <Link to="/mybooks"className="nav-link fw-bold" style={{ color: '#8b5cf6' }}>MyBooks</Link>
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
        <h2 className="mb-4 fw-bold">My books</h2>
        
        {/* Status Filter Pills */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {statusFilters.map((filter: StatusFilter) => (
            <button
              key={filter.key}
              className={`btn btn-pill px-4 py-2 rounded-pill ${
                filter.active 
                  ? 'text-white' 
                  : 'btn-outline-secondary text-muted'
              }`}
              style={{
                backgroundColor: filter.active ? '#8b5cf6' : 'white',
                borderColor: filter.active ? '#8b5cf6' : '#dee2e6'
              }}
              onClick={() => handleFilterChange(filter.key)}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Search Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-lg ps-5"
                placeholder="Search my books..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ backgroundColor: 'white', border: '1px solid #e9ecef' }}
              />
              <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                <svg width="20" height="20" fill="#6c757d" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="row g-4">
          {filteredBooks.map((book: MyBook) => {
            const statusBadge = getStatusBadge(book.status);
            return (
              <div key={book.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: 'white' }}>
                  <div className="position-relative">
                    <div 
                      className="card-img-top d-flex align-items-center justify-content-center"
                      style={{ 
                        height: '200px', 
                        backgroundColor: book.title === 'Milk and Honey' ? '#2c2c2c' : '#e9ecef',
                        backgroundImage: book.title !== 'Milk and Honey' 
                          ? 'linear-gradient(45deg, #d4b5a0 25%, transparent 25%), linear-gradient(-45deg, #d4b5a0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4b5a0 75%), linear-gradient(-45deg, transparent 75%, #d4b5a0 75%)'
                          : 'none',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                      }}
                    >
                      {book.title === 'Milk and Honey' ? (
                        <div className="text-center text-white">
                          <div className="mb-2" style={{ fontSize: '2rem' }}>🍯</div>
                          <small>{book.title}</small>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="mb-2" style={{ fontSize: '3rem', opacity: 0.3 }}>📚</div>
                          <small className="text-muted">Book Cover</small>
                        </div>
                      )}
                    </div>
                    <span className={`position-absolute top-0 end-0 badge ${statusBadge.class} m-2`}>
                      {statusBadge.text}
                    </span>
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title fw-bold mb-1">{book.title}</h6>
                    <p className="card-text text-muted small mb-2">by {book.author}</p>
                    <p className="card-text small mb-3">
                      <span className="text-muted">Due: </span>
                      <span className={book.status === 'overdue' ? 'text-danger fw-bold' : 'text-dark'}>
                        {book.dueDate}
                      </span>
                    </p>
                    <div className="mt-auto">
                      <button 
                        className="btn w-100"
                        style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6', color: 'white' }}
                        onClick={() => handleReturn(book.id)}
                      >
                        Return
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
            <p className="text-muted">
              {searchQuery 
                ? 'Try adjusting your search criteria' 
                : 'You don\'t have any books in this category'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooksPage;