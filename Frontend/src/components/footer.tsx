// Enhanced Footer Component
 export default function Footer() {
  const footerStyles = {
    footer: {
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '3rem 0 1rem 0'
    },
    linkStyle: {
      color: '#ccc',
      textDecoration: 'none',
      marginBottom: '8px',
      display: 'block'
    },
    socialIcon: {
      width: '40px',
      height: '40px',
      backgroundColor: '#7c3aed',
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 10px',
      textDecoration: 'none',
      color: 'white'
    },
    brandIcon: {
      width: '24px',
      height: '24px',
      backgroundColor: '#7c3aed',
      borderRadius: '4px',
      marginRight: '8px'
    }
  };

  return (
    <footer style={footerStyles.footer}>
      <div className="container">
        <div className="row">
          {/* Brand and Description */}
          <div className="col-md-4 mb-4">
            <div className="d-flex align-items-center mb-3">
              <div style={footerStyles.brandIcon}></div>
              <h5 className="mb-0 text-white">LibraryHub</h5>
            </div>
            <p className="text-muted">
              Your digital gateway to endless knowledge. Discover, read, and explore 
              thousands of books from the comfort of your home.
            </p>
            <div className="d-flex mt-3">
              <a href="#" style={footerStyles.socialIcon}>📘</a>
              <a href="#" style={footerStyles.socialIcon}>🐦</a>
              <a href="#" style={footerStyles.socialIcon}>📷</a>
              <a href="#" style={footerStyles.socialIcon}>💼</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h6 className="text-white mb-3">Quick Links</h6>
            <a href="#" style={footerStyles.linkStyle}>Home</a>
            <a href="#" style={footerStyles.linkStyle}>About Us</a>
            <a href="#" style={footerStyles.linkStyle}>Catalog</a>
            <a href="#" style={footerStyles.linkStyle}>My Books</a>
            <a href="#" style={footerStyles.linkStyle}>Contact</a>
          </div>

          {/* Categories */}
          <div className="col-md-2 mb-4">
            <h6 className="text-white mb-3">Categories</h6>
            <a href="#" style={footerStyles.linkStyle}>Fiction</a>
            <a href="#" style={footerStyles.linkStyle}>Non-Fiction</a>
            <a href="#" style={footerStyles.linkStyle}>Science</a>
            <a href="#" style={footerStyles.linkStyle}>Technology</a>
            <a href="#" style={footerStyles.linkStyle}>History</a>
          </div>

          {/* Support */}
          <div className="col-md-2 mb-4">
            <h6 className="text-white mb-3">Support</h6>
            <a href="#" style={footerStyles.linkStyle}>Help Center</a>
            <a href="#" style={footerStyles.linkStyle}>Privacy Policy</a>
            <a href="#" style={footerStyles.linkStyle}>Terms of Service</a>
            <a href="#" style={footerStyles.linkStyle}>FAQ</a>
            <a href="#" style={footerStyles.linkStyle}>Contact Support</a>
          </div>

          {/* Newsletter */}
          <div className="col-md-2 mb-4">
            <h6 className="text-white mb-3">Stay Updated</h6>
            <p className="text-muted small">Subscribe to our newsletter for the latest books and updates.</p>
            <div className="input-group">
              <input 
                type="email" 
                className="form-control form-control-sm" 
                placeholder="Your email"
                style={{ fontSize: '12px' }}
              />
              <button 
                className="btn btn-sm" 
                style={{ backgroundColor: '#7c3aed', color: 'white' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="border-secondary" />
        <div className="d-flex justify-content-between align-items-center">
          <p className="text-muted mb-0">© May 5 2025 @libraryhub.com All Rights Reserved</p>
          <div className="d-flex gap-3">
            <a href="#" className="text-muted text-decoration-none">Privacy</a>
            <a href="#" className="text-muted text-decoration-none">Terms</a>
            <a href="#" className="text-muted text-decoration-none">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
     );
}