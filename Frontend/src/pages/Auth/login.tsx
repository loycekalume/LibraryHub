import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios'; 
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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e?: React.FormEvent) {
  e?.preventDefault();
  setError(null);

  try {
    const res = await axios.post("/auth/login", formData);

    // Save token + user in localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    const role = res.data.user.role.toLowerCase();

    //  Redirect based on role
    if (role === "admin") {
      navigate("/admindashboard");
    } else if (role === "librarian") {
      navigate("/librariandashboard");
    } else if (role === "borrower") {
      navigate("/");
    } else {
      navigate("/"); 
    }
  } catch (err: any) {
    console.error("Login failed", err);
    setError(err.response?.data?.message || "Login failed. Try again.");
  }
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
    }
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
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet"/>

      <div className="d-flex align-items-center justify-content-center" style={customStyles.container}>
        <div style={customStyles.formCard}>
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary mb-2">Login</h1>
            <span className="fw-semibold text-muted">LibraryHub</span>
            <p className="text-muted small">Enter your credentials to access your account</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
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

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              style={customStyles.submitButton}
            >
              Login
            </button>
          </form>

          <div className="text-center">
            <p className="small text-muted mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="fw-medium" style={{ color: '#7c3aed' }}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
