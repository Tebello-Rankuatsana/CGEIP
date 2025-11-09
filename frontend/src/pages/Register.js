import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
            <div className="mb-3">
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 'institute':
        return (
          <>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contactPerson" className="form-label">Contact Person</label>
              <input
                type="text"
                className="form-control"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 'company':
        return (
          <>
            <div className="mb-3">
              <label htmlFor="industry" className="form-label">Industry</label>
              <input
                type="text"
                className="form-control"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="website" className="form-label">Website</label>
              <input
                type="url"
                className="form-control"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Register</h3>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    {formData.role === 'student' ? 'Full Name' : 
                     formData.role === 'institute' ? 'Institution Name' : 'Company Name'}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="institute">Institution</option>
                    <option value="company">Company</option>
                  </select>
                </div>

                {renderRoleSpecificFields()}

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <div className="text-center mt-3">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;