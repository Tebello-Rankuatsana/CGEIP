import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy
} from 'firebase/firestore';

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
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                ), 
                label: 'Job Applications' 
              },
              { 
                path: '/company/qualified-applicants', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                  </svg>
                ), 
                label: 'Qualified Applicants' 
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
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    qualifiedApplicants: 0,
    interviewCandidates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const companyId = user.uid;
      
      // Get jobs count
      const jobsRef = collection(db, 'jobs');
      const jobsQuery = query(jobsRef, where('companyId', '==', companyId));
      const jobsSnapshot = await getDocs(jobsQuery);
      
      // Get active jobs count
      const activeJobsQuery = query(
        jobsRef, 
        where('companyId', '==', companyId),
        where('status', '==', 'active'),
        where('deadline', '>', new Date())
      );
      const activeJobsSnapshot = await getDocs(activeJobsQuery);

      // Get total applications
      const applicationsRef = collection(db, 'jobApplications');
      const applicationsQuery = query(applicationsRef, where('companyId', '==', companyId));
      const applicationsSnapshot = await getDocs(applicationsQuery);

      // Get qualified applicants (applications with transcripts)
      const qualifiedApplicantsQuery = query(
        applicationsRef,
        where('companyId', '==', companyId),
        where('transcriptUrl', '!=', '')
      );
      const qualifiedApplicantsSnapshot = await getDocs(qualifiedApplicantsQuery);

      // Get interview candidates
      const interviewCandidatesQuery = query(
        applicationsRef,
        where('companyId', '==', companyId),
        where('status', '==', 'shortlisted')
      );
      const interviewCandidatesSnapshot = await getDocs(interviewCandidatesQuery);

      setStats({
        totalJobs: jobsSnapshot.size,
        activeJobs: activeJobsSnapshot.size,
        totalApplications: applicationsSnapshot.size,
        qualifiedApplicants: qualifiedApplicantsSnapshot.size,
        interviewCandidates: interviewCandidatesSnapshot.size
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
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
    { label: 'Total Jobs Posted', value: stats.totalJobs, color: '#40e0d0' },
    { label: 'Active Job Postings', value: stats.activeJobs, color: '#10b981' },
    { label: 'Total Applications', value: stats.totalApplications, color: '#3b82f6' },
    { label: 'Qualified Applicants', value: stats.qualifiedApplicants, color: '#f59e0b' },
    { label: 'Interview Candidates', value: stats.interviewCandidates, color: '#8b5cf6' }
  ];

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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Company Dashboard</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Manage your job postings and track qualified applicants</p>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
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
      <div style={{ ...cardStyle }}>
        <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Quick Actions</h5>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { path: '/company/jobs', label: 'Post New Job', color: '#40e0d0' },
            { path: '/company/applications', label: 'View Applications', color: '#10b981' },
            { path: '/company/qualified-applicants', label: 'Qualified Applicants', color: '#3b82f6' },
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
    </div>
  );
}

// Manage Jobs Component
function ManageJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    jobType: 'full-time',
    deadline: '',
    status: 'active'
  });

  useEffect(() => {
    if (user?.uid) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const jobsRef = collection(db, 'jobs');
      const jobsQuery = query(
        jobsRef,
        where('companyId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(jobsQuery);
      const jobsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        deadline: doc.data().deadline?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setJobs(jobsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRequirementsChange = (e) => {
    const requirements = e.target.value.split('\n').filter(req => req.trim() !== '');
    setFormData({
      ...formData,
      requirements: requirements
    });
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      const jobData = {
        companyId: user.uid,
        companyName: user.name,
        ...formData,
        salary: formData.salary,
        deadline: new Date(formData.deadline),
        createdAt: new Date(),
        applications: 0
      };

      await addDoc(collection(db, 'jobs'), jobData);
      
      alert('Job posted successfully!');
      setShowJobForm(false);
      setFormData({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        jobType: 'full-time',
        deadline: '',
        status: 'active'
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
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements,
      location: job.location,
      salary: job.salary,
      jobType: job.jobType,
      deadline: job.deadline?.toISOString().split('T')[0],
      status: job.status
    });
    setShowJobForm(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    if (!editingJob) return;

    try {
      const jobData = {
        ...formData,
        salary: formData.salary,
        deadline: new Date(formData.deadline),
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'jobs', editingJob.id), jobData);
      
      alert('Job updated successfully!');
      setShowJobForm(false);
      setEditingJob(null);
      setFormData({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        jobType: 'full-time',
        deadline: '',
        status: 'active'
      });
      fetchJobs();
    } catch (error) {
      alert('Error updating job');
      console.error('Error:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This will also delete all associated applications.')) {
      try {
        // Check if there are applications for this job
        const applicationsQuery = query(collection(db, 'jobApplications'), where('jobId', '==', jobId));
        const applicationsSnapshot = await getDocs(applicationsQuery);
        
        if (!applicationsSnapshot.empty) {
          alert('Cannot delete job. There are applications associated with this job.');
          return;
        }

        await deleteDoc(doc(db, 'jobs', jobId));
        alert('Job deleted successfully!');
        fetchJobs();
      } catch (error) {
        alert('Error deleting job');
        console.error('Error:', error);
      }
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        status: newStatus,
        updatedAt: new Date()
      });
      alert(`Job ${newStatus} successfully!`);
      fetchJobs();
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

  const statusButtonStyle = (status) => ({
    backgroundColor: status === 'active' ? '#10b981' : '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginRight: '0.5rem'
  });

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

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '100px'
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
          <p style={{ color: '#6b7280' }}>Create and manage your job opportunities</p>
        </div>
        <button 
          style={buttonStyle}
          onClick={() => {
            setShowJobForm(true);
            setEditingJob(null);
            setFormData({
              title: '',
              description: '',
              requirements: '',
              location: '',
              salary: '',
              jobType: 'full-time',
              deadline: '',
              status: 'active'
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

      {showJobForm && (
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
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Job Type</label>
                <select
                  style={inputStyle}
                  name="jobType"
                  value={formData.jobType}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
                  placeholder="e.g., M8,000 - M12,000"
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Description</label>
              <textarea
                style={textareaStyle}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>
                Requirements (one per line)
              </label>
              <textarea
                style={textareaStyle}
                name="requirements"
                value={formData.requirements}
                onChange={handleRequirementsChange}
                placeholder="Bachelor's degree in Computer Science&#10;2+ years of experience&#10;Knowledge of JavaScript and React"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Application Deadline</label>
                <input
                  type="date"
                  style={inputStyle}
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Status</label>
                <select
                  style={inputStyle}
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  setShowJobForm(false);
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
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Type</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Location</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Salary</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Deadline</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{job.title}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>
                    <span style={{
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {job.jobType}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{job.location}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{job.salary}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{job.deadline?.toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      backgroundColor: job.status === 'active' ? '#10b981' : '#6b7280',
                      color: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                        style={statusButtonStyle(job.status === 'active' ? 'inactive' : 'active')}
                        onClick={() => handleStatusChange(job.id, job.status === 'active' ? 'inactive' : 'active')}
                      >
                        {job.status === 'active' ? 'Deactivate' : 'Activate'}
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
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?.uid) {
      fetchApplications();
    }
  }, [user, filter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const applicationsRef = collection(db, 'jobApplications');
      let applicationsQuery;

      if (filter !== 'all') {
        applicationsQuery = query(
          applicationsRef,
          where('companyId', '==', user.uid),
          where('status', '==', filter)
        );
      } else {
        applicationsQuery = query(
          applicationsRef,
          where('companyId', '==', user.uid),
          orderBy('appliedAt', 'desc')
        );
      }

      const snapshot = await getDocs(applicationsQuery);
      const applicationsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        appliedAt: doc.data().appliedAt?.toDate()
      }));
      setApplications(applicationsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'jobApplications', applicationId), {
        status: newStatus,
        updatedAt: new Date()
      });
      alert(`Application ${newStatus} successfully!`);
      fetchApplications();
    } catch (error) {
      alert('Error updating application status');
      console.error('Error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { backgroundColor: '#f59e0b', color: '#000000' },
      shortlisted: { backgroundColor: '#3b82f6', color: '#ffffff' },
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
    marginRight: '0.5rem'
  };

  const shortlistButtonStyle = {
    ...buttonStyle,
    color: '#3b82f6',
    borderColor: '#3b82f6'
  };

  const rejectButtonStyle = {
    ...buttonStyle,
    color: '#ef4444',
    borderColor: '#ef4444'
  };

  const hireButtonStyle = {
    ...buttonStyle,
    color: '#10b981',
    borderColor: '#10b981'
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
          <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Job Applications</h2>
          <p style={{ color: '#6b7280' }}>Review and manage job applications</p>
        </div>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: '#ffffff',
              fontSize: '0.875rem'
            }}
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Applicant</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Job Title</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Applied Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Transcript</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(application => (
                <tr key={application.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{application.studentName}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{application.studentEmail}</div>
                      {application.studentPhone && (
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{application.studentPhone}</div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{application.jobTitle}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{application.appliedAt?.toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      backgroundColor: application.transcriptUrl ? '#10b981' : '#6b7280',
                      color: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {application.transcriptUrl ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{getStatusBadge(application.status)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {application.status === 'pending' && (
                        <>
                          <button 
                            style={shortlistButtonStyle}
                            onClick={() => handleStatusChange(application.id, 'shortlisted')}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#3b82f6';
                              e.target.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = '#3b82f6';
                            }}
                          >
                            Shortlist
                          </button>
                          <button 
                            style={rejectButtonStyle}
                            onClick={() => handleStatusChange(application.id, 'rejected')}
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
                        </>
                      )}
                      {application.status === 'shortlisted' && (
                        <button 
                          style={hireButtonStyle}
                          onClick={() => handleStatusChange(application.id, 'hired')}
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
                      )}
                      {application.transcriptUrl && (
                        <a 
                          href={application.transcriptUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            ...buttonStyle,
                            color: '#8b5cf6',
                            borderColor: '#8b5cf6',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#8b5cf6';
                            e.target.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#8b5cf6';
                          }}
                        >
                          View Transcript
                        </a>
                      )}
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
// Qualified Applicants Component
function QualifiedApplicants() {
  const { user } = useAuth();
  const [qualifiedApplicants, setQualifiedApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchQualifiedApplicants();
    }
  }, [user]);

  const fetchQualifiedApplicants = async () => {
    setLoading(true);
    try {
      const applicationsRef = collection(db, 'jobApplications');
      const qualifiedQuery = query(
        applicationsRef,
        where('companyId', '==', user.uid),
        where('transcriptUrl', '!=', ''),
        orderBy('appliedAt', 'desc')
      );

      const snapshot = await getDocs(qualifiedQuery);
      const applicantsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        appliedAt: doc.data().appliedAt?.toDate()
      }));

      const enhancedApplicants = await Promise.all(
        applicantsData.map(async (applicant) => {
          const studentDoc = await getDoc(doc(db, 'students', applicant.studentId));
          const studentData = studentDoc.exists() ? studentDoc.data() : {};
          
          const jobDoc = await getDoc(doc(db, 'jobs', applicant.jobId));
          const jobData = jobDoc.exists() ? jobDoc.data() : {};

          let matchScore = 50;
          
          if (jobData.requirements) {
            const requirements = Array.isArray(jobData.requirements) ? jobData.requirements : [jobData.requirements];
            requirements.forEach(req => {
              const requirement = req.toLowerCase();
              const studentProfile = `${studentData.highSchool || ''} ${studentData.graduationYear || ''}`.toLowerCase();
              
              if (requirement.includes('degree') && applicant.transcriptUrl) {
                matchScore += 20;
              }
              if (requirement.includes('computer science') && studentProfile.includes('science')) {
                matchScore += 15;
              }
              if (requirement.includes('mathematics') && studentProfile.includes('math')) {
                matchScore += 15;
              }
            });
          }

          return {
            ...applicant,
            studentData,
            jobData,
            matchScore: Math.min(matchScore, 100)
          };
        })
      );

      enhancedApplicants.sort((a, b) => b.matchScore - a.matchScore);
      setQualifiedApplicants(enhancedApplicants);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching qualified applicants:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'jobApplications', applicationId), {
        status: newStatus,
        updatedAt: new Date()
      });
      alert(`Applicant ${newStatus} successfully!`);
      fetchQualifiedApplicants();
    } catch (error) {
      alert('Error updating applicant status');
      console.error('Error:', error);
    }
  };

  const getMatchLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: '#10b981' };
    if (score >= 60) return { level: 'Good', color: '#3b82f6' };
    if (score >= 40) return { level: 'Fair', color: '#f59e0b' };
    return { level: 'Basic', color: '#6b7280' };
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
    marginRight: '0.5rem'
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Qualified Applicants</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Automatically filtered applicants based on job requirements and academic qualifications</p>

      {qualifiedApplicants.length === 0 ? (
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <svg style={{ width: '3rem', height: '3rem', fill: '#6b7280', marginBottom: '1rem' }} viewBox="0 0 24 24">
              <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
            </svg>
            <p style={{ margin: '0 0 1rem 0' }}>No qualified applicants found</p>
            <small style={{ color: '#6b7280' }}>Applicants with uploaded transcripts will appear here automatically</small>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {qualifiedApplicants.map(applicant => {
            const matchInfo = getMatchLevel(applicant.matchScore);
            return (
              <div key={applicant.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#000000', margin: '0 0 0.5rem 0' }}>{applicant.studentName}</h4>
                    <p style={{ color: '#4b5563', margin: '0 0 0.5rem 0' }}>
                      Applied for: <strong>{applicant.jobTitle}</strong>
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <small style={{ color: '#6b7280' }}>Email: {applicant.studentEmail}</small>
                      </div>
                      {applicant.studentData?.phone && (
                        <div>
                          <small style={{ color: '#6b7280' }}>Phone: {applicant.studentData.phone}</small>
                        </div>
                      )}
                      <div>
                        <small style={{ color: '#6b7280' }}>
                          Applied: {applicant.appliedAt?.toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      backgroundColor: matchInfo.color,
                      color: '#ffffff',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>
                      {applicant.matchScore}% Match
                    </div>
                    <small style={{ color: matchInfo.color, fontWeight: '600' }}>
                      {matchInfo.level} Match
                    </small>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h6 style={{ color: '#000000', margin: '0 0 0.5rem 0' }}>Academic Background</h6>
                    <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                      <div>High School: {applicant.studentData?.highSchool || 'Not specified'}</div>
                      <div>Graduation Year: {applicant.studentData?.graduationYear || 'Not specified'}</div>
                      <div>Transcript: <span style={{ color: '#10b981', fontWeight: '600' }}>Available</span></div>
                    </div>
                  </div>
                  <div>
                    <h6 style={{ color: '#000000', margin: '0 0 0.5rem 0' }}>Job Requirements Match</h6>
                    <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                      {applicant.jobData.requirements && (
                        <div>
                          {Array.isArray(applicant.jobData.requirements) 
                            ? applicant.jobData.requirements.map((req, idx) => (
                                <div key={idx}>• {req}</div>
                              ))
                            : <div>• {applicant.jobData.requirements}</div>
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a 
                      href={applicant.transcriptUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        ...buttonStyle,
                        color: '#8b5cf6',
                        borderColor: '#8b5cf6',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#8b5cf6';
                        e.target.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#8b5cf6';
                      }}
                    >
                      View Transcript
                    </a>
                    {applicant.studentData?.address && (
                      <button 
                        style={{
                          ...buttonStyle,
                          color: '#6b7280',
                          borderColor: '#6b7280'
                        }}
                        onClick={() => alert(`Address: ${applicant.studentData.address}`)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#6b7280';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#6b7280';
                        }}
                      >
                        View Address
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {applicant.status === 'pending' && (
                      <>
                        <button 
                          style={{
                            ...buttonStyle,
                            color: '#3b82f6',
                            borderColor: '#3b82f6'
                          }}
                          onClick={() => handleStatusChange(applicant.id, 'shortlisted')}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#3b82f6';
                            e.target.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#3b82f6';
                          }}
                        >
                          Shortlist for Interview
                        </button>
                        <button 
                          style={{
                            ...buttonStyle,
                            color: '#ef4444',
                            borderColor: '#ef4444'
                          }}
                          onClick={() => handleStatusChange(applicant.id, 'rejected')}
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
                      </>
                    )}
                    {applicant.status === 'shortlisted' && (
                      <button 
                        style={{
                          ...buttonStyle,
                          color: '#10b981',
                          borderColor: '#10b981'
                        }}
                        onClick={() => handleStatusChange(applicant.id, 'hired')}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#10b981';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#10b981';
                        }}
                      >
                        Mark as Hired
                      </button>
                    )}
                    {(applicant.status === 'shortlisted' || applicant.status === 'hired') && (
                      <span style={{
                        backgroundColor: applicant.status === 'hired' ? '#10b981' : '#3b82f6',
                        color: '#ffffff',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Company Profile Component
function CompanyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    industry: '',
    location: '',
    contactPerson: '',
    phone: '',
    description: '',
    website: ''
  });

  useEffect(() => {
    if (user?.uid) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const companyDoc = await getDoc(doc(db, 'companies', user.uid));
      if (companyDoc.exists()) {
        const companyData = companyDoc.data();
        setProfile(companyData);
        setFormData({
          name: companyData.name || '',
          email: companyData.email || '',
          industry: companyData.industry || '',
          location: companyData.location || '',
          contactPerson: companyData.contactPerson || '',
          phone: companyData.phone || '',
          description: companyData.description || '',
          website: companyData.website || ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'companies', user.uid), {
        ...formData,
        updatedAt: new Date()
      });
      alert('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      alert('Error updating profile');
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

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: '#ffffff',
    fontSize: '0.875rem'
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
          <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Company Profile</h2>
          <p style={{ color: '#6b7280' }}>Manage your company information</p>
        </div>
        {!editing && (
          <button 
            style={buttonStyle}
            onClick={() => setEditing(true)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#000000';
              e.target.style.color = '#40e0d0';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#40e0d0';
              e.target.style.color = '#000000';
            }}
          >
            Edit Profile
          </button>
        )}
      </div>

      <div style={cardStyle}>
        {editing ? (
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Company Name</label>
                <input
                  type="text"
                  style={inputStyle}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Email</label>
                <input
                  type="email"
                  style={inputStyle}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
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
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Contact Person</label>
                <input
                  type="text"
                  style={inputStyle}
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Phone</label>
                <input
                  type="tel"
                  style={inputStyle}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Description</label>
              <textarea
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Website</label>
              <input
                type="url"
                style={inputStyle}
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={buttonStyle}>Save Changes</button>
              <button 
                type="button" 
                style={{
                  ...buttonStyle,
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  borderColor: '#d1d5db'
                }}
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Company Information</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <strong style={{ color: '#000000' }}>Company Name:</strong>
                    <div style={{ color: '#4b5563' }}>{profile?.name}</div>
                  </div>
                  <div>
                    <strong style={{ color: '#000000' }}>Email:</strong>
                    <div style={{ color: '#4b5563' }}>{profile?.email}</div>
                  </div>
                  <div>
                    <strong style={{ color: '#000000' }}>Industry:</strong>
                    <div style={{ color: '#4b5563' }}>{profile?.industry}</div>
                  </div>
                  <div>
                    <strong style={{ color: '#000000' }}>Location:</strong>
                    <div style={{ color: '#4b5563' }}>{profile?.location}</div>
                  </div>
                </div>
              </div>
              <div>
                <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Contact Information</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <strong style={{ color: '#000000' }}>Contact Person:</strong>
                    <div style={{ color: '#4b5563' }}>{profile?.contactPerson}</div>
                  </div>
                  <div>
                    <strong style={{ color: '#000000' }}>Phone:</strong>
                    <div style={{ color: '#4b5563' }}>{profile?.phone}</div>
                  </div>
                  {profile?.website && (
                    <div>
                      <strong style={{ color: '#000000' }}>Website:</strong>
                      <div style={{ color: '#4b5563' }}>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#40e0d0' }}>
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}
                  <div>
                    <strong style={{ color: '#000000' }}>Status:</strong>
                    <span style={{
                      backgroundColor: profile?.status === 'active' ? '#10b981' : 
                                     profile?.status === 'pending' ? '#f59e0b' : '#ef4444',
                      color: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginLeft: '0.5rem'
                    }}>
                      {profile?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {profile?.description && (
              <div>
                <h5 style={{ color: '#000000', marginBottom: '0.5rem' }}>Company Description</h5>
                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{profile.description}</p>
              </div>
            )}
          </div>
        )}
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
        <Route path="/qualified-applicants" element={<QualifiedApplicants />} />
        <Route path="/profile" element={<CompanyProfile />} />
      </Routes>
    </CompanyLayout>
  );
}

export default CompanyDashboard;