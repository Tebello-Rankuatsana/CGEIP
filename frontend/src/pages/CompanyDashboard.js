import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Company Layout Component
function CompanyLayout({ children }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-light sidebar" style={{ minHeight: '100vh' }}>
          <div className="position-sticky pt-3">
            <div className="text-center mb-4">
              <h5>{user?.name}</h5>
              <small className="text-muted">Company Dashboard</small>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/company" className={`nav-link ${location.pathname === '/company' ? 'active' : ''}`}>
                  <i className="bi bi-speedometer2 me-2"></i>Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/company/jobs" className={`nav-link ${location.pathname.includes('jobs') ? 'active' : ''}`}>
                  <i className="bi bi-briefcase me-2"></i>Manage Jobs
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/company/applications" className={`nav-link ${location.pathname.includes('applications') ? 'active' : ''}`}>
                  <i className="bi bi-people me-2"></i>Job Applications
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/company/qualified" className={`nav-link ${location.pathname.includes('qualified') ? 'active' : ''}`}>
                  <i className="bi bi-star me-2"></i>Qualified Candidates
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/company/profile" className={`nav-link ${location.pathname.includes('profile') ? 'active' : ''}`}>
                  <i className="bi bi-gear me-2"></i>Company Profile
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

// Company Dashboard Home
function CompanyDashboardHome() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    qualifiedCandidates: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [jobsRes, appsRes, candidatesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/company/jobs', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/company/applications', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/company/qualified-candidates', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const jobs = jobsRes.data;
      setStats({
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === 'active').length,
        totalApplications: appsRes.data.length,
        qualifiedCandidates: candidatesRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <h2>Company Dashboard</h2>
      <p className="text-muted">Manage job postings and find qualified candidates</p>
      
      {/* Stats Cards */}
      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Jobs</h5>
              <h2 className="card-text">{stats.totalJobs}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Active Jobs</h5>
              <h2 className="card-text">{stats.activeJobs}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Total Applications</h5>
              <h2 className="card-text">{stats.totalApplications}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Qualified Candidates</h5>
              <h2 className="card-text">{stats.qualifiedCandidates}</h2>
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
                <Link to="/company/jobs" className="btn btn-primary me-2">
                  Post New Job
                </Link>
                <Link to="/company/applications" className="btn btn-success me-2">
                  View Applications
                </Link>
                <Link to="/company/qualified" className="btn btn-info me-2">
                  Find Candidates
                </Link>
                <Link to="/company/profile" className="btn btn-outline-secondary">
                  Update Profile
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
              <h5 className="card-title">Recent Activity</h5>
              <div className="list-group">
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">New Job Application</h6>
                    <small>2 hours ago</small>
                  </div>
                  <p className="mb-1">Software Developer position</p>
                  <small className="text-success">From qualified candidate</small>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Job Posted</h6>
                    <small>1 day ago</small>
                  </div>
                  <p className="mb-1">Data Analyst position</p>
                  <small className="text-primary">Active - 15 applications</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Manage Jobs Component
function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    salary: '',
    type: 'full-time',
    description: '',
    requirements: '',
    qualifications: '',
    deadline: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/company/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/company/jobs', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Job posted successfully!');
      setShowAddForm(false);
      setFormData({
        title: '', department: '', location: '', salary: '', type: 'full-time',
        description: '', requirements: '', qualifications: '', deadline: ''
      });
      fetchJobs();
    } catch (error) {
      alert('Error posting job');
      console.error('Error:', error);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      salary: job.salary,
      type: job.type,
      description: job.description,
      requirements: job.requirements,
      qualifications: job.qualifications,
      deadline: job.deadline.split('T')[0]
    });
    setShowAddForm(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/company/jobs/${editingJob.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Job updated successfully!');
      setShowAddForm(false);
      setEditingJob(null);
      setFormData({
        title: '', department: '', location: '', salary: '', type: 'full-time',
        description: '', requirements: '', qualifications: '', deadline: ''
      });
      fetchJobs();
    } catch (error) {
      alert('Error updating job');
      console.error('Error:', error);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/company/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Job deleted successfully!');
        fetchJobs();
      } catch (error) {
        alert('Error deleting job');
        console.error('Error:', error);
      }
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/company/jobs/${jobId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Job ${newStatus} successfully!`);
      fetchJobs();
    } catch (error) {
      alert('Error updating job status');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Manage Job Postings</h2>
          <p className="text-muted">Create and manage job opportunities for graduates</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowAddForm(true);
            setEditingJob(null);
            setFormData({
              title: '', department: '', location: '', salary: '', type: 'full-time',
              description: '', requirements: '', qualifications: '', deadline: ''
            });
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>Post New Job
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editingJob ? 'Edit Job' : 'Post New Job'}</h5>
            <form onSubmit={editingJob ? handleUpdateJob : handleAddJob}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Salary</label>
                  <input
                    type="text"
                    className="form-control"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Job Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Requirements</label>
                <textarea
                  className="form-control"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  placeholder="List key requirements (one per line)"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Qualifications</label>
                <textarea
                  className="form-control"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  placeholder="List required qualifications"
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Application Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingJob ? 'Update Job' : 'Post Job'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingJob(null);
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
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Applications</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.department}</td>
                    <td>{job.location}</td>
                    <td>
                      <span className="badge bg-info text-capitalize">{job.type}</span>
                    </td>
                    <td>
                      <span className="badge bg-primary">{job.applicationCount || 0}</span>
                    </td>
                    <td>
                      <span className={`badge ${job.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => handleEditJob(job)}
                        >
                          Edit
                        </button>
                        <button 
                          className={`btn ${job.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => handleToggleJobStatus(job.id, job.status)}
                        >
                          {job.status === 'active' ? 'Close' : 'Activate'}
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          Delete
                        </button>
                      </div>
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

// Job Applications Component
function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/company/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/company/applications/${applicationId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Application ${status} successfully!`);
      fetchApplications();
    } catch (error) {
      alert('Error updating application status');
      console.error('Error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Pending' },
      reviewed: { class: 'bg-info', text: 'Reviewed' },
      interviewed: { class: 'bg-primary', text: 'Interviewed' },
      rejected: { class: 'bg-danger', text: 'Rejected' },
      hired: { class: 'bg-success', text: 'Hired' }
    };
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <h2>Job Applications</h2>
      <p className="text-muted">Review and manage job applications from candidates</p>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Job Position</th>
                  <th>Applied Date</th>
                  <th>Qualifications</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(application => (
                  <tr key={application.id}>
                    <td>
                      <div>
                        <strong>{application.candidateName}</strong>
                        <br />
                        <small className="text-muted">{application.candidateEmail}</small>
                      </div>
                    </td>
                    <td>{application.jobTitle}</td>
                    <td>{new Date(application.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <small>
                        <strong>Degree:</strong> {application.degree}<br />
                        <strong>GPA:</strong> {application.gpa}<br />
                        <strong>Skills:</strong> {application.skills}
                      </small>
                    </td>
                    <td>{getStatusBadge(application.status)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => handleUpdateStatus(application.id, 'reviewed')}
                        >
                          Review
                        </button>
                        <button 
                          className="btn btn-outline-info"
                          onClick={() => handleUpdateStatus(application.id, 'interviewed')}
                        >
                          Interview
                        </button>
                        <button 
                          className="btn btn-outline-success"
                          onClick={() => handleUpdateStatus(application.id, 'hired')}
                        >
                          Hire
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => handleUpdateStatus(application.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
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

// Qualified Candidates Component
function QualifiedCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    degree: '',
    skills: '',
    minGPA: ''
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/company/qualified-candidates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredCandidates = candidates.filter(candidate => {
    return (
      (!filters.degree || candidate.degree.toLowerCase().includes(filters.degree.toLowerCase())) &&
      (!filters.skills || candidate.skills.toLowerCase().includes(filters.skills.toLowerCase())) &&
      (!filters.minGPA || candidate.gpa >= parseFloat(filters.minGPA))
    );
  });

  const handleInviteToApply = async (candidateId, jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/company/invite-candidate`, {
        candidateId,
        jobId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Candidate invited to apply successfully!');
    } catch (error) {
      alert('Error inviting candidate');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <h2>Qualified Candidates</h2>
      <p className="text-muted">Find and connect with qualified graduates based on academic performance and skills</p>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filter Candidates</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Degree</label>
              <input
                type="text"
                className="form-control"
                name="degree"
                value={filters.degree}
                onChange={handleFilterChange}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Skills</label>
              <input
                type="text"
                className="form-control"
                name="skills"
                value={filters.skills}
                onChange={handleFilterChange}
                placeholder="e.g., JavaScript, React"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Minimum GPA</label>
              <input
                type="number"
                className="form-control"
                name="minGPA"
                value={filters.minGPA}
                onChange={handleFilterChange}
                placeholder="e.g., 3.0"
                step="0.1"
                min="0"
                max="4.0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            Qualified Candidates ({filteredCandidates.length})
          </h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Degree</th>
                  <th>Institution</th>
                  <th>GPA</th>
                  <th>Skills</th>
                  <th>Certificates</th>
                  <th>Match Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map(candidate => (
                  <tr key={candidate.id}>
                    <td>
                      <div>
                        <strong>{candidate.name}</strong>
                        <br />
                        <small className="text-muted">{candidate.email}</small>
                      </div>
                    </td>
                    <td>{candidate.degree}</td>
                    <td>{candidate.institution}</td>
                    <td>
                      <span className={`badge ${
                        candidate.gpa >= 3.5 ? 'bg-success' : 
                        candidate.gpa >= 3.0 ? 'bg-warning' : 'bg-secondary'
                      }`}>
                        {candidate.gpa}
                      </span>
                    </td>
                    <td>
                      <small>{candidate.skills}</small>
                    </td>
                    <td>
                      {candidate.certificates > 0 ? (
                        <span className="badge bg-info">{candidate.certificates} certificates</span>
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        candidate.matchScore >= 80 ? 'bg-success' : 
                        candidate.matchScore >= 60 ? 'bg-warning' : 'bg-secondary'
                      }`}>
                        {candidate.matchScore}%
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleInviteToApply(candidate.id, 'job-id-here')}
                      >
                        Invite to Apply
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

// Company Profile Component
function CompanyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    industry: '',
    website: '',
    description: '',
    address: '',
    phone: '',
    size: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/company/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/company/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile. Please try again.');
      console.error('Error updating profile:', error);
    }
    setSaving(false);
  };

  return (
    <div>
      <h2>Company Profile</h2>
      <p className="text-muted">Manage your company's profile information</p>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Company Information</h5>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Industry</label>
                  <input
                    type="text"
                    className="form-control"
                    name="industry"
                    value={profile.industry}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Company Size</label>
                  <select
                    className="form-select"
                    name="size"
                    value={profile.size}
                    onChange={handleChange}
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    className="form-control"
                    name="website"
                    value={profile.website}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Company Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={profile.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <button 
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-building display-1 text-muted"></i>
              </div>
              <h5>{profile.name}</h5>
              <p className="text-muted">{profile.industry}</p>
              <div className="mt-3">
                <small className="text-muted">Company ID: {user?.id}</small>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <h6>Profile Completion</h6>
              <div className="progress mb-2">
                <div className="progress-bar" style={{ width: '85%' }}>85%</div>
              </div>
              <small className="text-muted">Complete your profile to attract better candidates</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Company Dashboard Component
function CompanyDashboard() {
  return (
    <CompanyLayout>
      <Routes>
        <Route path="/" element={<CompanyDashboardHome />} />
        <Route path="/jobs" element={<ManageJobs />} />
        <Route path="/applications" element={<JobApplications />} />
        <Route path="/qualified" element={<QualifiedCandidates />} />
        <Route path="/profile" element={<CompanyProfile />} />
      </Routes>
    </CompanyLayout>
  );
}

export default CompanyDashboard;