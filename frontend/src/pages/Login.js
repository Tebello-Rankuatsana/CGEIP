import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

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

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'institute':
          navigate('/institute');
          break;
        case 'student':
          navigate('/student');
          break;
        case 'company':
          navigate('/company');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-4">
          {/* Logo/Brand Section */}
          <div className="text-center mb-4">
            <div className="logo-container mb-3">
              <div className="logo-icon" style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #40E0D0, #38c9b8)',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(64, 224, 208, 0.3)'
              }}>
                <i className="bi bi-briefcase text-white fs-2"></i>
              </div>
            </div>
            <h1 className="text-white fw-bold mb-2">Career Guidance</h1>
            <p className="text-turquoise mb-0">Lesotho Platform</p>
          </div>

          <div className="login-card" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '40px 30px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(64, 224, 208, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="card-header text-center mb-4" style={{ border: 'none', background: 'transparent' }}>
              <h2 className="text-dark fw-bold" style={{ fontSize: '2rem' }}>Welcome Back</h2>
              <p className="text-muted">Sign in to your account</p>
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

            <form onSubmit={handleSubmit}>
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
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted mb-3">Don't have an account?</p>
              <Link 
                to="/register" 
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
                Create New Account
              </Link>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
              <small className="text-muted">
                © 2024 Career Guidance Platform. All rights reserved.
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
        
        .login-card {
          animation: fadeIn 0.6s ease-out;
        }
        
        .logo-container {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;