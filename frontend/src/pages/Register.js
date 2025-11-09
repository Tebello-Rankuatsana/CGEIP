import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../k&t logo.png';

function Register() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'student';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
    // Student specific
    dateOfBirth: '',
    phone: '',
    // Institute specific
    address: '',
    contactPerson: '',
    // Company specific
    industry: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(prev => ({ ...prev, role: defaultRole }));
  }, [defaultRole]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      setSuccess('Registration successful! Please check your email for verification.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'student':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="dateOfBirth" className="form-label text-dark fw-semibold">Date of Birth</label>
              <div className="input-group-custom">
                <input
                  type="date"
                  className="form-control login-input"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  style={{
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '15px 20px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                />
                <i className="bi bi-calendar input-icon"></i>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="form-label text-dark fw-semibold">Phone Number</label>
              <div className="input-group-custom">
                <input
                  type="tel"
                  className="form-control login-input"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  style={{
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '15px 20px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                />
                <i className="bi bi-phone input-icon"></i>
              </div>
            </div>
          </>
        );
      case 'institute':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="address" className="form-label text-dark fw-semibold">Address</label>
              <div className="input-group-custom">
                <input
                  type="text"
                  className="form-control login-input"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter institution address"
                  style={{
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '15px 20px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                />
                <i className="bi bi-geo-alt input-icon"></i>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="contactPerson" className="form-label text-dark fw-semibold">Contact Person</label>
              <div className="input-group-custom">
                <input
                  type="text"
                  className="form-control login-input"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  placeholder="Enter contact person name"
                  style={{
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '15px 20px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                />
                <i className="bi bi-person input-icon"></i>
              </div>
            </div>
          </>
        );
      case 'company':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="industry" className="form-label text-dark fw-semibold">Industry</label>
              <div className="input-group-custom">
                <input
                  type="text"
                  className="form-control login-input"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  placeholder="Enter company industry"
                  style={{
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '15px 20px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                />
                <i className="bi bi-building input-icon"></i>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="website" className="form-label text-dark fw-semibold">Website</label>
              <div className="input-group-custom">
                <input
                  type="url"
                  className="form-control login-input"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter company website"
                  style={{
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '15px 20px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                />
                <i className="bi bi-globe input-icon"></i>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="register-container" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="row justify-content-center w-100">
        <div className="col-md-8 col-lg-6">
          {/* Logo/Brand Section */}
          <div className="text-center mb-4">
            <div className="logo-container mb-3">
              <img src={logo} width={'80px'} height={'50px'} alt="K&T Pathways" />
            </div>
          </div>

          <div className="register-card" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '40px 30px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(64, 224, 208, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="card-header text-center mb-4" style={{ border: 'none', background: 'transparent' }}>
              <h2 className="text-dark fw-bold" style={{ fontSize: '2rem' }}>Create Account</h2>
              <p className="text-muted">Join K&T Pathways today</p>
            </div>
            
            {error && (
              <div className="alert alert-custom" role="alert" style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px'
              }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success-custom" role="alert" style={{
                background: 'linear-gradient(135deg, #51cf66, #40c057)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px'
              }}>
                <i className="bi bi-check-circle-fill me-2"></i>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label text-dark fw-semibold">
                  {formData.role === 'student' ? 'Full Name' : 
                   formData.role === 'institute' ? 'Institution Name' : 'Company Name'}
                </label>
                <div className="input-group-custom">
                  <input
                    type="text"
                    className="form-control login-input"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={
                      formData.role === 'student' ? 'Enter your full name' : 
                      formData.role === 'institute' ? 'Enter institution name' : 'Enter company name'
                    }
                    style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '15px 20px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <i className="bi bi-person input-icon"></i>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="form-label text-dark fw-semibold">Email Address</label>
                <div className="input-group-custom">
                  <input
                    type="email"
                    className="form-control login-input"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '15px 20px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <i className="bi bi-envelope input-icon"></i>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="role" className="form-label text-dark fw-semibold">Role</label>
                <div className="input-group-custom">
                  <select
                    className="form-control login-input"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '15px 20px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      appearance: 'none'
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="institute">Institution</option>
                    <option value="company">Company</option>
                  </select>
                  <i className="bi bi-chevron-down input-icon"></i>
                </div>
              </div>

              {renderRoleSpecificFields()}

              <div className="mb-4">
                <label htmlFor="password" className="form-label text-dark fw-semibold">Password</label>
                <div className="input-group-custom">
                  <input
                    type="password"
                    className="form-control login-input"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    placeholder="Enter your password"
                    style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '15px 20px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <i className="bi bi-lock input-icon"></i>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label text-dark fw-semibold">Confirm Password</label>
                <div className="input-group-custom">
                  <input
                    type="password"
                    className="form-control login-input"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '15px 20px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <i className="bi bi-lock-fill input-icon"></i>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn login-btn w-100"
                disabled={loading}
                style={{
                  background: loading 
                    ? '#cccccc' 
                    : 'linear-gradient(135deg, #40E0D0, #38c9b8)',
                  border: 'none',
                  color: 'white',
                  fontWeight: '600',
                  padding: '15px 20px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  marginBottom: '20px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(64, 224, 208, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i>
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted mb-3">Already have an account?</p>
              <Link 
                to="/login" 
                className="btn btn-outline-custom"
                style={{
                  border: '2px solid #40E0D0',
                  color: '#40E0D0',
                  background: 'transparent',
                  fontWeight: '600',
                  padding: '12px 30px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#40E0D0';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#40E0D0';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Sign In
              </Link>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
              <small className="text-muted">
                © 2025 K&T Pathways. All rights reserved.
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style>{`
        .login-input:focus {
          border-color: #40E0D0 !important;
          box-shadow: 0 0 0 0.2rem rgba(64, 224, 208, 0.25) !important;
          transform: translateY(-1px);
        }
        
        .input-group-custom {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          font-size: 18px;
          pointer-events: none;
        }
        
        .login-btn:disabled {
          cursor: not-allowed;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .register-card {
          animation: fadeIn 0.6s ease-out;
        }
        
        .logo-container {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Register;