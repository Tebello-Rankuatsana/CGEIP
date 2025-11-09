import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom" style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      borderBottom: '3px solid #40E0D0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      padding: '15px 0'
    }}>
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/" style={{
          color: '#40E0D0',
          fontWeight: '700',
          fontSize: '1.8rem',
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #40E0D0, #38c9b8)',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            boxShadow: '0 4px 12px rgba(64, 224, 208, 0.3)'
          }}>
            <i className="bi bi-briefcase text-white"></i>
          </div>
          Career Guidance
        </Link>
        
        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{
            border: '2px solid #40E0D0',
            padding: '8px'
          }}
        >
          <span className="navbar-toggler-icon" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%2340E0D0' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`
          }}></span>
        </button>
        
        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto" style={{ marginLeft: '30px' }}>
            <li className="nav-item">
              <Link 
                className="nav-link-custom" 
                to="/"
                style={{
                  color: '#ffffff',
                  fontWeight: '500',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  margin: '0 5px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(64, 224, 208, 0.1)';
                  e.target.style.color = '#40E0D0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#ffffff';
                }}
              >
                <i className="bi bi-house me-2"></i>
                Home
              </Link>
            </li>
            {user && user.role === 'student' && (
              <>
                <li className="nav-item">
                  <Link 
                    className="nav-link-custom" 
                    to="/student/institutions"
                    style={{
                      color: '#ffffff',
                      fontWeight: '500',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      margin: '0 5px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(64, 224, 208, 0.1)';
                      e.target.style.color = '#40E0D0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#ffffff';
                    }}
                  >
                    <i className="bi bi-building me-2"></i>
                    Institutions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link-custom" 
                    to="/student/jobs"
                    style={{
                      color: '#ffffff',
                      fontWeight: '500',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      margin: '0 5px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(64, 224, 208, 0.1)';
                      e.target.style.color = '#40E0D0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#ffffff';
                    }}
                  >
                    <i className="bi bi-briefcase me-2"></i>
                    Job Opportunities
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          {/* User Section */}
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <span 
                    className="nav-link-welcome" 
                    style={{
                      color: '#40E0D0',
                      fontWeight: '600',
                      padding: '10px 20px',
                      background: 'rgba(64, 224, 208, 0.1)',
                      borderRadius: '8px',
                      margin: '0 10px',
                      border: '1px solid rgba(64, 224, 208, 0.3)'
                    }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    Welcome, {user.name}
                  </span>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn-logout" 
                    onClick={handleLogout}
                    style={{
                      background: 'linear-gradient(135deg, #dc3545, #c82333)',
                      border: 'none',
                      color: 'white',
                      fontWeight: '600',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      marginLeft: '10px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #c82333, #dc3545)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    className="btn-nav-login" 
                    to="/login"
                    style={{
                      background: 'transparent',
                      border: '2px solid #40E0D0',
                      color: '#40E0D0',
                      fontWeight: '600',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      margin: '0 5px'
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
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="btn-nav-register" 
                    to="/register"
                    style={{
                      background: 'linear-gradient(135deg, #40E0D0, #38c9b8)',
                      border: 'none',
                      color: 'white',
                      fontWeight: '600',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      margin: '0 5px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #38c9b8, #40E0D0)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(64, 224, 208, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #40E0D0, #38c9b8)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            padding: 20px;
            border-radius: 0 0 15px 15px;
            border: 2px solid #40E0D0;
            border-top: none;
            margin-top: 10px;
          }
          
          .nav-item {
            margin: 5px 0;
          }
          
          .nav-link-custom, .btn-nav-login, .btn-nav-register {
            display: block;
            text-align: center;
            margin: 10px 0 !important;
          }
        }
        
        .navbar-brand:hover {
          color: #40E0D0 !important;
          transform: translateY(-1px);
          transition: all 0.3s ease;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;