import{useState} from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { Link } from 'react-router-dom';
 export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  function handleMainSearch() {
    console.log('Main search:', searchQuery);
  }

  const homeStyles = {
    heroSection: {
      backgroundColor: '#f8f9fa',
      padding: '4rem 0',
      textAlign: 'center' as const
    },
    searchSection: {
      maxWidth: '600px',
      margin: '2rem auto'
    },
    bookCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    },
    bookImage: {
      width: '100%',
      height: '200px',
      backgroundColor: '#ddd',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    borrowButton: {
      backgroundColor: '#7c3aed',
      border: 'none',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '4px',
      width: '100%'
    },
    signUpSection: {
      backgroundColor: '#7c3aed',
      padding: '3rem 0',
      textAlign: 'center' as const,
      color: 'white'
    }
  };

  const books = [
    { id: 1, title: 'Milk and Honey', author: 'Rupi Kaur', status: 'Available', image: '/api/placeholder/150/200' },
    { id: 2, title: 'Milk and Honey', author: 'Rupi Kaur', status: 'Available', image: '/api/placeholder/150/200' },
    { id: 3, title: 'Love is Enough', author: 'Vi. Innocent', status: 'Borrowed', image: '/api/placeholder/150/200' },
    { id: 4, title: 'Love is Enough', author: 'Vi. Innocent', status: 'Borrowed', image: '/api/placeholder/150/200' }
  ];

  return (
    <>
      {/* Bootstrap CSS CDN */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-vh-100 d-flex flex-column">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow-1">
          {/* Hero Section */}
          <section style={homeStyles.heroSection}>
            <div className="container">
              <h1 className="display-4 fw-bold mb-3">
                Discover a Word of <span style={{ color: '#7c3aed' }}>Knowledge</span>
              </h1>
              <p className="lead text-muted mb-4">
                Embark, discover and explore amazing books, stories with more books
              </p>

              {/* Main Search */}
              <div style={homeStyles.searchSection}>
                <div className="input-group input-group-lg">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search books by title, author, year..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    className="btn" 
                    type="button"
                    onClick={handleMainSearch}
                    style={{ backgroundColor: '#7c3aed', color: 'white' }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Books Section */}
          <section className="py-5">
            <div className="container">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Our Books</h3>
                <small className="text-muted">Showing 4 of 1000 books</small>
              </div>

              <div className="row">
                {books.map((book) => (
                  <div key={book.id} className="col-md-3 mb-4">
                    <div style={homeStyles.bookCard}>
                      <div 
                        style={{
                          ...homeStyles.bookImage,
                          backgroundColor: '#2d3748',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        📚 Book Cover
                      </div>
                      <div className="p-3">
                        <h6 className="fw-bold mb-1">{book.title}</h6>
                        <p className="text-muted small mb-2">{book.author}</p>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span 
                            className={`badge ${book.status === 'Available' ? 'bg-success' : 'bg-warning'}`}
                          >
                            {book.status}
                          </span>
                        </div>
                        <button 
                          style={homeStyles.borrowButton}
                          disabled={book.status === 'Borrowed'}
                        >
                          {book.status === 'Available' ? 'Borrow' : 'Borrowed'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section style={homeStyles.signUpSection}>
            <div className="container">
              <h2 className="mb-3">Ready to Start Reading?</h2>
              <Link to="/register">
              <button className="btn btn-light btn-lg">Sign Up</button>
              </Link>
            </div>
          </section>
        </main>

        {/* Enhanced Footer */}
        <Footer />
      </div>
    </>
  );
}

