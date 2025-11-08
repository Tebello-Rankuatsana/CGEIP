import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Admin Layout Component
function AdminLayout({ children }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-light sidebar" style={{ minHeight: '100vh' }}>
          <div className="position-sticky pt-3">
            <div className="text-center mb-4">
              <h5>Welcome, {user?.name}</h5>
              <small className="text-muted">Admin Dashboard</small>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                  <i className="bi bi-speedometer2 me-2"></i>Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/institutions" className={`nav-link ${location.pathname.includes('institutions') ? 'active' : ''}`}>
                  <i className="bi bi-building me-2"></i>Manage Institutions
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/companies" className={`nav-link ${location.pathname.includes('companies') ? 'active' : ''}`}>
                  <i className="bi bi-briefcase me-2"></i>Manage Companies
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/users" className={`nav-link ${location.pathname.includes('users') ? 'active' : ''}`}>
                  <i className="bi bi-people me-2"></i>User Management
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/reports" className={`nav-link ${location.pathname.includes('reports') ? 'active' : ''}`}>
                  <i className="bi bi-graph-up me-2"></i>Reports & Analytics
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/admissions" className={`nav-link ${location.pathname.includes('admissions') ? 'active' : ''}`}>
                  <i className="bi bi-file-earmark-text me-2"></i>Admissions Monitor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9 col-lg-10">
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard Home
function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalStudents: 0,
    totalCompanies: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [instRes, studentsRes, companiesRes, approvalsRes] = await Promise.all([
        axios.get('http://localhost:5001/api/admin/institutions', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5001/api/admin/students', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5001/api/admin/companies', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5001/api/admin/pending-approvals', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setStats({
        totalInstitutions: instRes.data.length,
        totalStudents: studentsRes.data.length,
        totalCompanies: companiesRes.data.length,
        pendingApprovals: approvalsRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p className="text-muted">System overview and management</p>
      
      {/* Stats Cards */}
      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Institutions</h5>
              <h2 className="card-text">{stats.totalInstitutions}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Students</h5>
              <h2 className="card-text">{stats.totalStudents}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Companies</h5>
              <h2 className="card-text">{stats.totalCompanies}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Pending Approvals</h5>
              <h2 className="card-text">{stats.pendingApprovals}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-grid gap-2 d-md-flex">
                <Link to="/admin/institutions" className="btn btn-primary me-2">
                  Manage Institutions
                </Link>
                <Link to="/admin/companies" className="btn btn-success me-2">
                  Approve Companies
                </Link>
                <Link to="/admin/reports" className="btn btn-info me-2">
                  View Reports
                </Link>
                <Link to="/admin/admissions" className="btn btn-warning">
                  Monitor Admissions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Recent System Activity</h5>
              <div className="list-group">
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">New Institution Registration</h6>
                    <small>1 hour ago</small>
                  </div>
                  <p className="mb-1">National University of Lesotho</p>
                  <small className="text-warning">Pending approval</small>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Company Account Suspended</h6>
                    <small>3 hours ago</small>
                  </div>
                  <p className="mb-1">Tech Solutions Lesotho</p>
                  <small className="text-danger">Violation of terms</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Manage Institutions Component
function ManageInstitutions() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    contactPerson: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/institutions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInstitutions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddInstitution = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/admin/institutions', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Institution added successfully!');
      setShowAddForm(false);
      setFormData({ name: '', email: '', address: '', contactPerson: '', phone: '', website: '' });
      fetchInstitutions();
    } catch (error) {
      alert('Error adding institution');
      console.error('Error:', error);
    }
  };

  const handleEditInstitution = (institution) => {
    setEditingInstitution(institution);
    setFormData({
      name: institution.name,
      email: institution.email,
      address: institution.address,
      contactPerson: institution.contactPerson,
      phone: institution.phone,
      website: institution.website
    });
    setShowAddForm(true);
  };

  const handleUpdateInstitution = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/admin/institutions/${editingInstitution.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Institution updated successfully!');
      setShowAddForm(false);
      setEditingInstitution(null);
      setFormData({ name: '', email: '', address: '', contactPerson: '', phone: '', website: '' });
      fetchInstitutions();
    } catch (error) {
      alert('Error updating institution');
      console.error('Error:', error);
    }
  };

  const handleDeleteInstitution = async (id) => {
    if (window.confirm('Are you sure you want to delete this institution?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/institutions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Institution deleted successfully!');
        fetchInstitutions();
      } catch (error) {
        alert('Error deleting institution');
        console.error('Error:', error);
      }
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Manage Institutions</h2>
          <p className="text-muted">Add, edit, or remove higher learning institutions</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowAddForm(true);
            setEditingInstitution(null);
            setFormData({ name: '', email: '', address: '', contactPerson: '', phone: '', website: '' });
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>Add Institution
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editingInstitution ? 'Edit Institution' : 'Add New Institution'}</h5>
            <form onSubmit={editingInstitution ? handleUpdateInstitution : handleAddInstitution}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Institution Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    className="form-control"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingInstitution ? 'Update Institution' : 'Add Institution'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingInstitution(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact Person</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map(institution => (
                  <tr key={institution.id}>
                    <td>{institution.name}</td>
                    <td>{institution.email}</td>
                    <td>{institution.contactPerson}</td>
                    <td>{institution.phone}</td>
                    <td>
                      <span className={`badge ${institution.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                        {institution.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => handleEditInstitution(institution)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteInstitution(institution.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Manage Companies Component
function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  const handleApproveCompany = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/companies/${companyId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Company approved successfully!');
      fetchCompanies();
    } catch (error) {
      alert('Error approving company');
      console.error('Error:', error);
    }
  };

  const handleSuspendCompany = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/companies/${companyId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Company suspended successfully!');
      fetchCompanies();
    } catch (error) {
      alert('Error suspending company');
      console.error('Error:', error);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/companies/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Company deleted successfully!');
        fetchCompanies();
      } catch (error) {
        alert('Error deleting company');
        console.error('Error:', error);
      }
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <h2>Manage Companies</h2>
      <p className="text-muted">Approve, suspend, or remove company accounts</p>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Industry</th>
                  <th>Contact Email</th>
                  <th>Website</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(company => (
                  <tr key={company.id}>
                    <td>{company.name}</td>
                    <td>{company.industry}</td>
                    <td>{company.email}</td>
                    <td>{company.website}</td>
                    <td>
                      <span className={`badge ${
                        company.status === 'approved' ? 'bg-success' : 
                        company.status === 'pending' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {company.status}
                      </span>
                    </td>
                    <td>
                      {company.status === 'pending' && (
                        <button 
                          className="btn btn-sm btn-success me-1"
                          onClick={() => handleApproveCompany(company.id)}
                        >
                          Approve
                        </button>
                      )}
                      {company.status === 'approved' && (
                        <button 
                          className="btn btn-sm btn-warning me-1"
                          onClick={() => handleSuspendCompany(company.id)}
                        >
                          Suspend
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteCompany(company.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reports Component
function Reports() {
  const [reports, setReports] = useState({
    totalApplications: 0,
    admissionRate: 0,
    popularCourses: [],
    institutionStats: []
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  return (
    <div>
      <h2>Reports & Analytics</h2>
      <p className="text-muted">System-wide statistics and insights</p>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Application Statistics</h5>
              <div className="mb-3">
                <strong>Total Applications:</strong> {reports.totalApplications}
              </div>
              <div className="mb-3">
                <strong>Admission Rate:</strong> {reports.admissionRate}%
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Popular Courses</h5>
              <ul className="list-group">
                {reports.popularCourses.map((course, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    <span>{course.name}</span>
                    <span className="badge bg-primary">{course.applications} applications</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Institution Statistics</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Institution</th>
                  <th>Total Courses</th>
                  <th>Applications</th>
                  <th>Admission Rate</th>
                </tr>
              </thead>
              <tbody>
                {reports.institutionStats.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.name}</td>
                    <td>{stat.totalCourses}</td>
                    <td>{stat.applications}</td>
                    <td>{stat.admissionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Admin Dashboard Component
function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboardHome />} />
        <Route path="/institutions" element={<ManageInstitutions />} />
        <Route path="/companies" element={<ManageCompanies />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </AdminLayout>
  );
}

export default AdminDashboard;