import{useState} from 'react'
import { Link } from 'react-router-dom'


export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearch() {
    console.log('Searching for:', searchQuery);
  }

  const navStyles = {
    navbar: {
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 0'
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: '#7c3aed'
    },
    brandIcon: {
      width: '24px',
      height: '24px',
      backgroundColor: '#7c3aed',
      borderRadius: '4px',
      marginRight: '8px'
    },
    searchBar: {
      maxWidth: '400px',
      position: 'relative' as const
    },
    searchInput: {
      paddingRight: '45px',
      borderRadius: '20px',
      border: '1px solid #dee2e6'
    },
    searchButton: {
      position: 'absolute' as const,
      right: '5px',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: '#7c3aed',
      border: 'none',
      borderRadius: '15px',
      padding: '5px 15px',
      color: 'white'
    }
  };

  return (
    <nav style={navStyles.navbar}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Brand */}
          <a href="#" style={navStyles.brand} className="fw-bold h4 mb-0">
            <div style={navStyles.brandIcon}></div>
            LibraryHub
          </a>

          {/* Navigation Links */}
          <div className="d-flex align-items-center">
            <Link to="/" className="text-decoration-none text-dark me-4" style={{ color: '#8b5cf6' }}>Home</Link>
            <Link to="/catalog" className="text-decoration-none text-dark me-4">Catalog</Link>
            <Link to="/mybooks" className="text-decoration-none text-dark me-4">MyBooks</Link>
          </div>

          {/* Search Bar */}
          <div style={navStyles.searchBar}>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={navStyles.searchInput}
              />
              <button type="button" onClick={handleSearch} style={navStyles.searchButton}>
                🔍
              </button>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="d-flex gap-2">
           <Link to="/login"><button className="btn btn-outline-primary">Login</button>
           </Link>
    
             <Link to="/register"><button className="btn btn-primary" style={{ backgroundColor: '#7c3aed', borderColor: '#7c3aed' }}>
              Sign Up
            </button>
            </Link>
            
          </div>
        </div>
      </div>
    </nav>
  );
}