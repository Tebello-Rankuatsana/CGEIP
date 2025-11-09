import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Company Layout Component
function CompanyLayout({ children }) {
  const location = useLocation();
  const { user } = useAuth();

  const sidebarStyle = {
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh',
    borderRight: '3px solid #40e0d0',
    width: '280px'
  };

  const navItemStyle = {
    color: '#d1d5db',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    display: 'block',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderRadius: '0.375rem',
    marginBottom: '0.25rem',
    fontSize: '0.875rem'
  };

  const activeNavItemStyle = {
    ...navItemStyle,
    backgroundColor: '#40e0d0',
    color: '#000000',
    fontWeight: '600'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ padding: '1.5rem 1rem', position: 'sticky', top: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #374151' }}>
            <h5 style={{ color: '#40e0d0', margin: '0 0 0.25rem 0' }}>{user?.name}</h5>
            <small style={{ color: '#9ca3af' }}>Company Dashboard</small>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { 
                path: '/company', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
                  </svg>
                ), 
                label: 'Dashboard' 
              },
              { 
                path: '/company/jobs', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
                  </svg>
                ), 
                label: 'Manage Jobs' 
              },
              { 
                path: '/company/applications', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,6C14.9,6 14,6.9 14,8C14,9.1 14.9,10 16,10C17.1,10 18,9.1 18,8C18,6.9 17.1,6 16,6M16,13C14.67,13 12,13.67 12,15V16H20V15C20,13.67 17.33,13 16,13M4,8C4,10.21 5.79,12 8,12C10.21,12 12,10.21 12,8C12,5.79 10.21,4 8,4C5.79,4 4,5.79 4,8M6,8C6,6.9 6.9,6 8,6C9.1,6 10,6.9 10,8C10,9.1 9.1,10 8,10C6.9,10 6,9.1 6,8M4,14C2.67,14 0,14.67 0,16V17H8V16C8,14.67 5.33,14 4,14Z" />
                  </svg>
                ), 
                label: 'Job Applications' 
              },
              { 
                path: '/company/qualified', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                  </svg>
                ), 
                label: 'Qualified Candidates' 
              },
              { 
                path: '/company/profile', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                  </svg>
                ), 
                label: 'Company Profile' 
              }
            ].map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/company' && location.pathname.includes(item.path.replace('/company/', '')));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={isActive ? activeNavItemStyle : navItemStyle}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = '#1f2937';
                      e.target.style.color = '#40e0d0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#d1d5db';
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <div style={{ padding: '2rem' }}>
          {children}
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
      // Simulated data for demo
      setStats({
        totalJobs: 8,
        activeJobs: 5,
        totalApplications: 42,
        qualifiedCandidates: 15
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #40e0d0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    color: '#000000',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease'
  };

  const statCards = [
    { label: 'Total Jobs', value: stats.totalJobs, color: '#40e0d0' },
    { label: 'Active Jobs', value: stats.activeJobs, color: '#10b981' },
    { label: 'Total Applications', value: stats.totalApplications, color: '#3b82f6' },
    { label: 'Qualified Candidates', value: stats.qualifiedCandidates, color: '#f59e0b' }
  ];

  return (
    <div>
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Company Dashboard</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Manage job postings and find qualified candidates</p>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((stat, index) => (
          <div 
            key={index}
            style={{ 
              ...cardStyle, 
              borderColor: stat.color,
              backgroundColor: stat.color === '#40e0d0' ? '#40e0d0' : '#ffffff',
              color: stat.color === '#40e0d0' ? '#000000' : '#000000'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', opacity: stat.color === '#40e0d0' ? '1' : '0.8' }}>
              {stat.label}
            </h5>
            <h2 style={{ margin: 0, color: stat.color === '#40e0d0' ? '#000000' : stat.color, fontSize: '2rem' }}>
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ ...cardStyle, marginBottom: '2rem' }}>
        <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Quick Actions</h5>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { path: '/company/jobs', label: 'Post New Job', color: '#40e0d0' },
            { path: '/company/applications', label: 'View Applications', color: '#10b981' },
            { path: '/company/qualified', label: 'Find Candidates', color: '#3b82f6' },
            { path: '/company/profile', label: 'Update Profile', outline: true }
          ].map((action, index) => (
            <Link
              key={index}
              to={action.path}
              style={{
                backgroundColor: action.outline ? 'transparent' : action.color,
                color: action.outline ? '#374151' : '#000000',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '600',
                border: action.outline ? '2px solid #d1d5db' : `2px solid ${action.color}`,
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                if (action.outline) {
                  e.target.style.backgroundColor = '#40e0d0';
                  e.target.style.color = '#000000';
                  e.target.style.borderColor = '#40e0d0';
                } else {
                  e.target.style.backgroundColor = '#000000';
                  e.target.style.color = action.color;
                }
              }}
              onMouseLeave={(e) => {
                if (action.outline) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#374151';
                  e.target.style.borderColor = '#d1d5db';
                } else {
                  e.target.style.backgroundColor = action.color;
                  e.target.style.color = '#000000';
                }
              }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={cardStyle}>
        <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Recent Activity</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { 
              title: 'New Job Application', 
              time: '2 hours ago', 
              description: 'Software Developer position',
              status: 'From qualified candidate',
              statusColor: '#10b981'
            },
            { 
              title: 'Job Posted', 
              time: '1 day ago', 
              description: 'Data Analyst position',
              status: 'Active - 15 applications',
              statusColor: '#3b82f6'
            }
          ].map((activity, index) => (
            <div 
              key={index}
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                backgroundColor: '#f9fafb'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h6 style={{ margin: 0, color: '#000000' }}>{activity.title}</h6>
                <small style={{ color: '#6b7280' }}>{activity.time}</small>
              </div>
              <p style={{ margin: '0 0 0.5rem 0', color: '#4b5563' }}>{activity.description}</p>
              <small style={{ color: activity.statusColor, fontWeight: '600' }}>{activity.status}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Manage Jobs Component
function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      // Simulated data
      setTimeout(() => {
        setJobs([
          { 
            id: '1', 
            title: 'Software Developer', 
            department: 'Engineering', 
            location: 'Maseru', 
            type: 'full-time', 
            applicationCount: 12, 
            status: 'active',
            salary: 'M8,000 - M12,000'
          },
          { 
            id: '2', 
            title: 'Data Analyst', 
            department: 'Analytics', 
            location: 'Maseru', 
            type: 'full-time', 
            applicationCount: 8, 
            status: 'active',
            salary: 'M6,000 - M9,000'
          }
        ]);
        setLoading(false);
      }, 1000);
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
      const newJob = {
        id: Date.now().toString(),
        ...formData,
        applicationCount: 0,
        status: 'active'
      };
      setJobs(prev => [...prev, newJob]);
      alert('Job posted successfully!');
      setShowAddForm(false);
      setFormData({
        title: '', department: '', location: '', salary: '', type: 'full-time',
        description: '', requirements: '', qualifications: '', deadline: ''
      });
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
      description: job.description || '',
      requirements: job.requirements || '',
      qualifications: job.qualifications || '',
      deadline: job.deadline || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      setJobs(prev => prev.map(job => 
        job.id === editingJob.id ? { ...job, ...formData } : job
      ));
      alert('Job updated successfully!');
      setShowAddForm(false);
      setEditingJob(null);
      setFormData({
        title: '', department: '', location: '', salary: '', type: 'full-time',
        description: '', requirements: '', qualifications: '', deadline: ''
      });
    } catch (error) {
      alert('Error updating job');
      console.error('Error:', error);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        setJobs(prev => prev.filter(job => job.id !== id));
        alert('Job deleted successfully!');
      } catch (error) {
        alert('Error deleting job');
        console.error('Error:', error);
      }
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    try {
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
      alert(`Job ${newStatus} successfully!`);
    } catch (error) {
      alert('Error updating job status');
      console.error('Error:', error);
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #40e0d0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const buttonStyle = {
    backgroundColor: '#40e0d0',
    color: '#000000',
    border: '2px solid #40e0d0',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const editButtonStyle = {
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '1px solid #3b82f6',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginRight: '0.5rem',
    transition: 'all 0.3s ease'
  };

  const statusButtonStyle = {
    backgroundColor: 'transparent',
    color: '#f59e0b',
    border: '1px solid #f59e0b',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginRight: '0.5rem',
    transition: 'all 0.3s ease'
  };

  const deleteButtonStyle = {
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: '#ffffff',
    fontSize: '0.875rem'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: '#ffffff'
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px'
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { backgroundColor: '#10b981', color: '#ffffff' },
      closed: { backgroundColor: '#6b7280', color: '#ffffff' }
    };
    const config = statusConfig[status] || { backgroundColor: '#6b7280', color: '#ffffff' };
    
    return (
      <span style={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.75rem',
        fontWeight: '600'
      }}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    return (
      <span style={{
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'capitalize'
      }}>
        {type}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid #40e0d0',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Manage Job Postings</h2>
          <p style={{ color: '#6b7280' }}>Create and manage job opportunities for graduates</p>
        </div>
        <button 
          style={buttonStyle}
          onClick={() => {
            setShowAddForm(true);
            setEditingJob(null);
            setFormData({
              title: '', department: '', location: '', salary: '', type: 'full-time',
              description: '', requirements: '', qualifications: '', deadline: ''
            });
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#000000';
            e.target.style.color = '#40e0d0';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#40e0d0';
            e.target.style.color = '#000000';
          }}
        >
          <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          Post New Job
        </button>
      </div>

      {showAddForm && (
        <div style={{ ...cardStyle, marginBottom: '2rem' }}>
          <h5 style={{ color: '#000000', marginBottom: '1rem' }}>{editingJob ? 'Edit Job' : 'Post New Job'}</h5>
          <form onSubmit={editingJob ? handleUpdateJob : handleAddJob}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Job Title</label>
                <input
                  type="text"
                  style={inputStyle}
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Department</label>
                <input
                  type="text"
                  style={inputStyle}
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Location</label>
                <input
                  type="text"
                  style={inputStyle}
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Salary</label>
                <input
                  type="text"
                  style={inputStyle}
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Job Type</label>
                <select
                  style={selectStyle}
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
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Job Description</label>
              <textarea
                style={textareaStyle}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Requirements</label>
              <textarea
                style={textareaStyle}
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows="3"
                required
                placeholder="List key requirements (one per line)"
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Qualifications</label>
              <textarea
                style={textareaStyle}
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                rows="3"
                required
                placeholder="List required qualifications"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Application Deadline</label>
                <input
                  type="date"
                  style={inputStyle}
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={buttonStyle}>
                {editingJob ? 'Update Job' : 'Post Job'}
              </button>
              <button 
                type="button" 
                style={{
                  ...buttonStyle,
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  borderColor: '#d1d5db'
                }}
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
      )}

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Job Title</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Department</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Location</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Type</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Applications</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{job.title}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{job.department}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{job.location}</td>
                  <td style={{ padding: '0.75rem' }}>{getTypeBadge(job.type)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {job.applicationCount}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{getStatusBadge(job.status)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button 
                        style={editButtonStyle}
                        onClick={() => handleEditJob(job)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#3b82f6';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#3b82f6';
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        style={statusButtonStyle}
                        onClick={() => handleToggleJobStatus(job.id, job.status)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f59e0b';
                          e.target.style.color = '#000000';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#f59e0b';
                        }}
                      >
                        {job.status === 'active' ? 'Close' : 'Activate'}
                      </button>
                      <button 
                        style={deleteButtonStyle}
                        onClick={() => handleDeleteJob(job.id)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#ef4444';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#ef4444';
                        }}
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
  );
}

// Job Applications Component
function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Simulated data
      setTimeout(() => {
        setApplications([
          { 
            id: '1', 
            candidateName: 'Tebello Rankuatsana', 
            candidateEmail: 'tr@email.com',
            jobTitle: 'Software Developer', 
            appliedAt: '2025-01-15', 
            status: 'pending',
            degree: 'BSC In Software Engineering',
            gpa: '3.6',
            skills: 'JavaScript, React, Node.js'
          },
          { 
            id: '2', 
            candidateName: 'Tholoane Mokoena', 
            candidateEmail: 'tm@email.com',
            jobTitle: 'Data Analyst', 
            appliedAt: '2025-01-10', 
            status: 'reviewed',
            degree: 'Statistics',
            gpa: '3.3',
            skills: 'Python, SQL, Data Visualization'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
      alert(`Application ${status} successfully!`);
    } catch (error) {
      alert('Error updating application status');
      console.error('Error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { backgroundColor: '#f59e0b', color: '#000000' },
      reviewed: { backgroundColor: '#3b82f6', color: '#ffffff' },
      interviewed: { backgroundColor: '#8b5cf6', color: '#ffffff' },
      rejected: { backgroundColor: '#ef4444', color: '#ffffff' },
      hired: { backgroundColor: '#10b981', color: '#ffffff' }
    };
    const config = statusConfig[status] || { backgroundColor: '#6b7280', color: '#ffffff' };
    
    return (
      <span style={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.75rem',
        fontWeight: '600'
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #40e0d0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    border: '1px solid',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '0.25rem'
  };

  const reviewButtonStyle = {
    ...buttonStyle,
    color: '#3b82f6',
    borderColor: '#3b82f6'
  };

  const interviewButtonStyle = {
    ...buttonStyle,
    color: '#8b5cf6',
    borderColor: '#8b5cf6'
  };

  const hireButtonStyle = {
    ...buttonStyle,
    color: '#10b981',
    borderColor: '#10b981'
  };

  const rejectButtonStyle = {
    ...buttonStyle,
    color: '#ef4444',
    borderColor: '#ef4444'
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid #40e0d0',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Job Applications</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Review and manage job applications from candidates</p>

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Candidate Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Job Position</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Applied Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Qualifications</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(application => (
                <tr key={application.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <div>
                      <strong style={{ color: '#000000' }}>{application.candidateName}</strong>
                      <br />
                      <small style={{ color: '#6b7280' }}>{application.candidateEmail}</small>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{application.jobTitle}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{new Date(application.appliedAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <small style={{ color: '#4b5563' }}>
                      <strong>Degree:</strong> {application.degree}<br />
                      <strong>GPA:</strong> {application.gpa}<br />
                      <strong>Skills:</strong> {application.skills}
                    </small>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{getStatusBadge(application.status)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      <button 
                        style={reviewButtonStyle}
                        onClick={() => handleUpdateStatus(application.id, 'reviewed')}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#3b82f6';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#3b82f6';
                        }}
                      >
                        Review
                      </button>
                      <button 
                        style={interviewButtonStyle}
                        onClick={() => handleUpdateStatus(application.id, 'interviewed')}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#8b5cf6';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#8b5cf6';
                        }}
                      >
                        Interview
                      </button>
                      <button 
                        style={hireButtonStyle}
                        onClick={() => handleUpdateStatus(application.id, 'hired')}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#10b981';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#10b981';
                        }}
                      >
                        Hire
                      </button>
                      <button 
                        style={rejectButtonStyle}
                        onClick={() => handleUpdateStatus(application.id, 'rejected')}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#ef4444';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#ef4444';
                        }}
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
  );
}

// Qualified Candidates Component
function QualifiedCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    degree: '',
    skills: '',
    minGPA: ''
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      // Simulated data
      setTimeout(() => {
        setCandidates([
          { 
            id: '1', 
            name: 'Mike Johnson', 
            email: 'mike@email.com',
            degree: 'Computer Science', 
            institution: 'National University of Lesotho',
            gpa: 3.8,
            skills: 'JavaScript, React, Node.js, Python',
            certificates: 3,
            matchScore: 85
          },
          { 
            id: '2', 
            name: 'Sarah Wilson', 
            email: 'sarah@email.com',
            degree: 'Data Science', 
            institution: 'Limkokwing University',
            gpa: 3.9,
            skills: 'Python, SQL, Machine Learning, Data Analysis',
            certificates: 2,
            matchScore: 92
          }
        ]);
        setLoading(false);
      }, 1000);
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

  const handleInviteToApply = async (candidateId) => {
    try {
      alert('Candidate invited to apply successfully!');
    } catch (error) {
      alert('Error inviting candidate');
      console.error('Error:', error);
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #40e0d0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: '#ffffff',
    fontSize: '0.875rem'
  };

  const buttonStyle = {
    backgroundColor: '#40e0d0',
    color: '#000000',
    border: '2px solid #40e0d0',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const getGPABadge = (gpa) => {
    let backgroundColor = '#6b7280';
    if (gpa >= 3.5) backgroundColor = '#10b981';
    else if (gpa >= 3.0) backgroundColor = '#f59e0b';
    
    return (
      <span style={{
        backgroundColor,
        color: backgroundColor === '#f59e0b' ? '#000000' : '#ffffff',
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.75rem',
        fontWeight: '600'
      }}>
        {gpa}
      </span>
    );
  };

  const getMatchScoreBadge = (score) => {
    let backgroundColor = '#6b7280';
    if (score >= 80) backgroundColor = '#10b981';
    else if (score >= 60) backgroundColor = '#f59e0b';
    
    return (
      <span style={{
        backgroundColor,
        color: backgroundColor === '#f59e0b' ? '#000000' : '#ffffff',
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.75rem',
        fontWeight: '600'
      }}>
        {score}%
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid #40e0d0',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Qualified Candidates</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Find and connect with qualified graduates based on academic performance and skills</p>

      {/* Filters */}
      <div style={{ ...cardStyle, marginBottom: '2rem' }}>
        <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Filter Candidates</h5>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Degree</label>
            <input
              type="text"
              style={inputStyle}
              name="degree"
              value={filters.degree}
              onChange={handleFilterChange}
              placeholder="e.g., Computer Science"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Skills</label>
            <input
              type="text"
              style={inputStyle}
              name="skills"
              value={filters.skills}
              onChange={handleFilterChange}
              placeholder="e.g., JavaScript, React"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Minimum GPA</label>
            <input
              type="number"
              style={inputStyle}
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

      <div style={cardStyle}>
        <h5 style={{ color: '#000000', marginBottom: '1rem' }}>
          Qualified Candidates ({filteredCandidates.length})
        </h5>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Candidate Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Degree</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Institution</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>GPA</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Skills</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Certificates</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Match Score</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map(candidate => (
                <tr key={candidate.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <div>
                      <strong style={{ color: '#000000' }}>{candidate.name}</strong>
                      <br />
                      <small style={{ color: '#6b7280' }}>{candidate.email}</small>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{candidate.degree}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{candidate.institution}</td>
                  <td style={{ padding: '0.75rem' }}>{getGPABadge(candidate.gpa)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <small style={{ color: '#4b5563' }}>{candidate.skills}</small>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {candidate.certificates > 0 ? (
                      <span style={{
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {candidate.certificates} certificates
                      </span>
                    ) : (
                      <span style={{ color: '#6b7280' }}>None</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{getMatchScoreBadge(candidate.matchScore)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      style={buttonStyle}
                      onClick={() => handleInviteToApply(candidate.id)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#000000';
                        e.target.style.color = '#40e0d0';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#40e0d0';
                        e.target.style.color = '#000000';
                      }}
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
      // Simulated profile data
      setProfile({
        name: user?.name || 'Tech Solutions Lesotho',
        email: user?.email || 'hr@techsolutions.ls',
        industry: 'Information Technology',
        website: 'www.techsolutions.ls',
        description: 'Leading technology solutions provider in Lesotho, specializing in software development and digital transformation.',
        address: 'Maseru, Lesotho',
        phone: '+266 2234 5678',
        size: '51-200'
      });
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
      // Simulate API call
      setTimeout(() => {
        alert('Profile updated successfully!');
        setSaving(false);
      }, 1000);
    } catch (error) {
      alert('Error updating profile. Please try again.');
      console.error('Error updating profile:', error);
      setSaving(false);
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #40e0d0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: '#ffffff',
    fontSize: '0.875rem'
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: '#ffffff'
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px'
  };

  const buttonStyle = {
    backgroundColor: '#40e0d0',
    color: '#000000',
    border: '2px solid #40e0d0',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  return (
    <div>
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Company Profile</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Manage your company's profile information</p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={cardStyle}>
          <h5 style={{ color: '#000000', marginBottom: '1.5rem' }}>Company Information</h5>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Company Name</label>
              <input
                type="text"
                style={inputStyle}
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Email</label>
              <input
                type="email"
                style={{ ...inputStyle, backgroundColor: '#f3f4f6', color: '#6b7280' }}
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Industry</label>
              <input
                type="text"
                style={inputStyle}
                name="industry"
                value={profile.industry}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Company Size</label>
              <select
                style={selectStyle}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Phone</label>
              <input
                type="tel"
                style={inputStyle}
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Website</label>
              <input
                type="url"
                style={inputStyle}
                name="website"
                value={profile.website}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Address</label>
            <textarea
              style={textareaStyle}
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Company Description</label>
            <textarea
              style={textareaStyle}
              name="description"
              value={profile.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button 
            style={{
              ...buttonStyle,
              opacity: saving ? 0.6 : 1,
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
            onClick={handleSave}
            disabled={saving}
            onMouseEnter={(e) => {
              if (!saving) {
                e.target.style.backgroundColor = '#000000';
                e.target.style.color = '#40e0d0';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.target.style.backgroundColor = '#40e0d0';
                e.target.style.color = '#000000';
              }
            }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={cardStyle}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                <svg style={{ width: '3rem', height: '3rem', fill: '#40e0d0' }} viewBox="0 0 24 24">
                  <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
                </svg>
              </div>
              <h5 style={{ color: '#000000', margin: '0 0 0.5rem 0' }}>{profile.name}</h5>
              <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>{profile.industry}</p>
              <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}>
                <small style={{ color: '#6b7280' }}>Company ID: {user?.id}</small>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h6 style={{ color: '#000000', marginBottom: '1rem' }}>Profile Completion</h6>
            <div style={{ 
              width: '100%', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '0.5rem',
              overflow: 'hidden',
              marginBottom: '0.5rem'
            }}>
              <div style={{ 
                width: '85%', 
                backgroundColor: '#40e0d0', 
                color: '#000000',
                padding: '0.5rem',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                85%
              </div>
            </div>
            <small style={{ color: '#6b7280' }}>Complete your profile to attract better candidates</small>
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