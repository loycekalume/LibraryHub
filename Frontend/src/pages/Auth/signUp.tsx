import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "../../utils/axios";

interface FormData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  selectRole: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    selectRole: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ");
      return;
    }

    try {
      setLoading(true);

      // Send request to backend
      const res = await axios.post("/auth/register", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.emailAddress,
        phone_number: formData.phoneNumber,
        role: formData.selectRole.toLowerCase(), 
        password: formData.password,
      });

      alert(" Account created successfully!");
      console.log("Registered user:", res.data);

      // Redirect to login
      navigate("/login");

    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed ");
    } finally {
      setLoading(false);
    }
  }

  

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', maxWidth: '400px', width: '100%', border: '2px solid #93c5fd', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          
          {/* header same as before */}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <input type="text" name="firstName" placeholder="First Name"
              value={formData.firstName} onChange={handleInputChange} className="form-control mb-3" required />

            {/* Last Name */}
            <input type="text" name="lastName" placeholder="Last Name"
              value={formData.lastName} onChange={handleInputChange} className="form-control mb-3" required />

            {/* Email */}
            <input type="email" name="emailAddress" placeholder="Email Address"
              value={formData.emailAddress} onChange={handleInputChange} className="form-control mb-3" required />

            {/* Phone Number */}
            <input type="tel" name="phoneNumber" placeholder="Phone Number"
              value={formData.phoneNumber} onChange={handleInputChange} className="form-control mb-3" required />

            {/* Select Role */}
            <select name="selectRole" value={formData.selectRole}
              onChange={handleInputChange} className="form-select mb-3" required>
              <option value="" disabled>Select Role</option>
              <option value="borrower">Borrower</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Admin</option>
            </select>

            {/* Password */}
            <div className="mb-3 position-relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password"
                value={formData.password} onChange={handleInputChange} className="form-control pe-5" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} 
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none' }}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="mb-3 position-relative">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password"
                value={formData.confirmPassword} onChange={handleInputChange} className="form-control pe-5" required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none' }}>
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Login Link */}
            <p className="small text-muted text-center mb-3">
              Already have an account? <Link to="/login" style={{ color: '#7c3aed' }}>Login</Link>
            </p>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
