import React, { useState } from 'react';
import{Link} from 'react-router-dom'
interface LoginFormData {
  email: string;
  password: string;
}

function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit() {
    console.log('Login submitted:', formData);
    // Add your login logic here
  }

  const customStyles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    },
    formCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '2px solid #93c5fd',
      padding: '2rem',
      maxWidth: '400px',
      margin: '0 auto'
    },
    brandIcon: {
      width: '16px',
      height: '16px',
      backgroundColor: '#7c3aed',
      borderRadius: '2px',
      display: 'inline-block',
      marginRight: '8px'
    },
    inputField: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '6px',
      padding: '12px',
      fontSize: '14px'
    },
    submitButton: {
      backgroundColor: '#7c3aed',
      borderColor: '#7c3aed',
      padding: '12px',
      fontWeight: '500'
    },
    eyeButton: {
      position: 'absolute' as const,
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'none',
      color: '#6c757d',
      cursor: 'pointer',
      fontSize: '16px'
    },
   
  };

  // Simple SVG eye icons
  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <>
      {/* Bootstrap CSS CDN */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="d-flex align-items-center justify-content-center" style={customStyles.container}>
        <div style={customStyles.formCard}>
          {/* Header */}
          <div className="text-center mb-4">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <h1 className="h3 fw-bold text-primary mb-0">Login</h1>
              <div className="ms-2 text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center text-muted mb-2">
              <div style={customStyles.brandIcon}></div>
              <span className="fw-semibold">LibraryHub</span>
            </div>
            <p className="text-muted mb-1">Welcome back</p>
            <p className="text-muted small">Enter your credentials to access your account</p>
          </div>

          {/* Form */}
          <div>
            {/* Email Address */}
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                style={customStyles.inputField}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-control pe-5"
                style={customStyles.inputField}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={customStyles.eyeButton}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

           

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary w-100 mb-3"
              style={customStyles.submitButton}
            >
              Login
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="small text-muted mb-0">
                Don't have an account?{' '}
                <Link to="/register">
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none fw-medium"
                  style={{ color: '#7c3aed' }}
                  onClick={() => console.log('Navigate to signup')}
                >
                  Sign Up
                </button>
                </Link>
              </p>
            </div>

           

        
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;