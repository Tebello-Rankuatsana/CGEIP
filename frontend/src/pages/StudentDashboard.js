import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Student Layout Component
function StudentLayout({ children }) {
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
              <small className="text-muted">Student Dashboard</small>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/student" className={`nav-link ${location.pathname === '/student' ? 'active' : ''}`}>
                  <i className="bi bi-house me-2"></i>Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/student/institutions" className={`nav-link ${location.pathname.includes('institutions') ? 'active' : ''}`}>
                  <i className="bi bi-building me-2"></i>Institutions & Courses
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/student/applications" className={`nav-link ${location.pathname.includes('applications') ? 'active' : ''}`}>
                  <i className="bi bi-file-text me-2"></i>My Applications
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/student/jobs" className={`nav-link ${location.pathname.includes('jobs') ? 'active' : ''}`}>
                  <i className="bi bi-briefcase me-2"></i>Job Opportunities
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/student/transcript" className={`nav-link ${location.pathname.includes('transcript') ? 'active' : ''}`}>
                  <i className="bi bi-file-earmark-text me-2"></i>Upload Transcript
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/student/profile" className={`nav-link ${location.pathname.includes('profile') ? 'active' : ''}`}>
                  <i className="bi bi-person me-2"></i>Profile
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

// Student Dashboard Home
function StudentDashboardHome() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    admittedApplications: 0,
    rejectedApplications: 0
  });

  useEffect(() => {
    fetchApplicationStats();
  }, []);

  const fetchApplicationStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/applications/student', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const applications = response.data;
      setStats({
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        admittedApplications: applications.filter(app => app.status === 'admitted').length,
        rejectedApplications: applications.filter(app => app.status === 'rejected').length
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <p className="text-muted">Overview of your academic applications and career opportunities</p>
      
      {/* Stats Cards */}
      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Applications</h5>
              <h2 className="card-text">{stats.totalApplications}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Pending</h5>
              <h2 className="card-text">{stats.pendingApplications}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Admitted</h5>
              <h2 className="card-text">{stats.admittedApplications}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h5 className="card-title">Rejected</h5>
              <h2 className="card-text">{stats.rejectedApplications}</h2>
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
                <Link to="/student/institutions" className="btn btn-primary me-2">
                  Browse Institutions & Courses
                </Link>
                <Link to="/student/jobs" className="btn btn-success me-2">
                  View Job Opportunities
                </Link>
                <Link to="/student/transcript" className="btn btn-info me-2">
                  Upload Academic Transcript
                </Link>
                <Link to="/student/profile" className="btn btn-outline-secondary">
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
                    <h6 className="mb-1">Course Application Submitted</h6>
                    <small>2 hours ago</small>
                  </div>
                  <p className="mb-1">Software Engineering at Limkokwing University</p>
                  <small className="text-warning">Status: Pending Review</small>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">New Job Match</h6>
                    <small>1 day ago</small>
                  </div>
                  <p className="mb-1">Junior Developer at Tech Solutions Lesotho</p>
                  <small className="text-success">Matches your profile</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Institutions and Courses Component
function InstitutionsAndCourses() {
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliedCourses, setAppliedCourses] = useState(new Set());

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/institutions');
      setInstitutions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setLoading(false);
    }
  };

  const fetchCourses = async (institutionId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/institutions/${institutionId}/courses`);
      setCourses(response.data);
      setSelectedInstitution(institutionId);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const applyForCourse = async (course) => {
    try {
      const token = localStorage.getItem('token');
      const applicationData = {
        courseId: course.id,
        institutionId: selectedInstitution,
        courseName: course.name,
        institutionName: institutions.find(inst => inst.id === selectedInstitution)?.name
      };

      await axios.post('http://localhost:5000/api/applications', applicationData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAppliedCourses(prev => new Set([...prev, course.id]));
      alert('Application submitted successfully!');
    } catch (error) {
      if (error.response?.data?.message === 'Maximum 2 courses per institution') {
        alert('You can only apply for maximum 2 courses per institution.');
      } else {
        alert('Error submitting application. Please try again.');
      }
      console.error('Error applying for course:', error);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <h2>Institutions & Courses</h2>
      <p className="text-muted">Browse higher learning institutions and apply for courses (maximum 2 per institution)</p>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Institutions</h5>
            </div>
            <div className="list-group list-group-flush">
              {institutions.map(institution => (
                <button
                  key={institution.id}
                  className={`list-group-item list-group-item-action ${
                    selectedInstitution === institution.id ? 'active' : ''
                  }`}
                  onClick={() => fetchCourses(institution.id)}
                >
                  <h6 className="mb-1">{institution.name}</h6>
                  <small>{institution.location}</small>
                  <br />
                  <small className="text-muted">{institution.contactEmail}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {selectedInstitution ? (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Available Courses</h4>
                <span className="badge bg-primary">
                  {courses.length} courses available
                </span>
              </div>
              
              {courses.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-book display-1 text-muted"></i>
                  <p className="mt-3">No courses available for this institution</p>
                </div>
              ) : (
                <div className="row">
                  {courses.map(course => (
                    <div key={course.id} className="col-md-6 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{course.name}</h5>
                          <h6 className="card-subtitle mb-2 text-muted">{course.faculty}</h6>
                          <p className="card-text">{course.description}</p>
                          <div className="mb-2">
                            <small><strong>Duration:</strong> {course.duration} years</small>
                          </div>
                          <div className="mb-2">
                            <small><strong>Requirements:</strong> {course.requirements}</small>
                          </div>
                          <div className="mb-3">
                            <small><strong>Tuition:</strong> M{course.tuitionFee}/year</small>
                          </div>
                          <button 
                            className={`btn btn-sm ${
                              appliedCourses.has(course.id) ? 'btn-success' : 'btn-primary'
                            }`}
                            onClick={() => applyForCourse(course)}
                            disabled={appliedCourses.has(course.id)}
                          >
                            {appliedCourses.has(course.id) ? 'Applied ✓' : 'Apply for Course'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-building display-1 text-muted"></i>
              <p className="mt-3">Select an institution to view available courses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Applications Component
function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/applications/student', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Pending' },
      admitted: { class: 'bg-success', text: 'Admitted' },
      rejected: { class: 'bg-danger', text: 'Rejected' },
      waiting: { class: 'bg-info', text: 'Waiting List' }
    };
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <h2>My Applications</h2>
      <p className="text-muted">Track your course applications and admission status</p>

      {applications.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-file-text display-1 text-muted"></i>
          <p className="mt-3">No applications submitted yet</p>
          <Link to="/student/institutions" className="btn btn-primary">
            Browse Courses to Apply
          </Link>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Institution</th>
                    <th>Application Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(application => (
                    <tr key={application.id}>
                      <td>{application.courseName}</td>
                      <td>{application.institutionName}</td>
                      <td>{new Date(application.appliedAt).toLocaleDateString()}</td>
                      <td>{getStatusBadge(application.status)}</td>
                      <td>
                        {application.status === 'admitted' && (
                          <button className="btn btn-success btn-sm">Accept Offer</button>
                        )}
                        <button className="btn btn-outline-danger btn-sm ms-1">Withdraw</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Job Opportunities Component
function JobOpportunities() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs');
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const applyForJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/jobs/${jobId}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAppliedJobs(prev => new Set([...prev, jobId]));
      alert('Job application submitted successfully!');
    } catch (error) {
      alert('Error applying for job. Please try again.');
      console.error('Error applying for job:', error);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>;
  }

  return (
    <div>
      <h2>Job Opportunities</h2>
      <p className="text-muted">Browse available job positions from partner companies</p>

      {jobs.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-briefcase display-1 text-muted"></i>
          <p className="mt-3">No job opportunities available at the moment</p>
        </div>
      ) : (
        <div className="row">
          {jobs.map(job => (
            <div key={job.id} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-primary">{job.companyName}</h6>
                  <p className="card-text">{job.description}</p>
                  
                  <div className="mb-2">
                    <strong>Requirements:</strong>
                    <ul className="mb-1">
                      {job.requirements?.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-3">
                    <small><strong>Location:</strong> {job.location}</small><br />
                    <small><strong>Salary:</strong> {job.salary}</small><br />
                    <small><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</small>
                  </div>
                  
                  <button 
                    className={`btn btn-sm ${
                      appliedJobs.has(job.id) ? 'btn-success' : 'btn-primary'
                    }`}
                    onClick={() => applyForJob(job.id)}
                    disabled={appliedJobs.has(job.id)}
                  >
                    {appliedJobs.has(job.id) ? 'Applied ✓' : 'Apply for Job'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Transcript Upload Component
function UploadTranscript() {
  const [transcript, setTranscript] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    setTranscript(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!transcript) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('transcript', transcript);

      await axios.post('http://localhost:5000/api/students/transcript', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadedFiles(prev => [...prev, {
        name: transcript.name,
        date: new Date().toLocaleDateString(),
        status: 'Uploaded'
      }]);
      
      alert('Transcript uploaded successfully!');
      setTranscript(null);
      document.getElementById('transcriptFile').value = '';
    } catch (error) {
      alert('Error uploading transcript. Please try again.');
      console.error('Error uploading transcript:', error);
    }
    setUploading(false);
  };

  return (
    <div>
      <h2>Upload Academic Transcript</h2>
      <p className="text-muted">Upload your academic transcripts and certificates for career opportunities</p>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Upload New Transcript</h5>
              
              <div className="mb-3">
                <label htmlFor="transcriptFile" className="form-label">Select Transcript File</label>
                <input 
                  type="file" 
                  className="form-control" 
                  id="transcriptFile"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange}
                />
                <div className="form-text">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max: 10MB)
                </div>
              </div>

              {transcript && (
                <div className="alert alert-info">
                  <strong>Selected file:</strong> {transcript.name}<br />
                  <strong>Size:</strong> {(transcript.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}

              <button 
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!transcript || uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Transcript'}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Uploaded Documents</h5>
              
              {uploadedFiles.length === 0 ? (
                <p className="text-muted">No documents uploaded yet</p>
              ) : (
                <div className="list-group">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{file.name}</h6>
                          <small>Uploaded: {file.date}</small>
                        </div>
                        <span className="badge bg-success">{file.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Why Upload Your Transcript?</h5>
          <ul>
            <li>Get matched with relevant job opportunities</li>
            <li>Increase your chances of employment</li>
            <li>Allow companies to view your academic performance</li>
            <li>Receive personalized career recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Student Profile Component
function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    address: '',
    highSchool: '',
    graduationYear: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/students/profile', {
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
      await axios.put('http://localhost:5000/api/students/profile', profile, {
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
      <h2>Student Profile</h2>
      <p className="text-muted">Manage your personal information and academic details</p>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Personal Information</h5>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <textarea
                  className="form-control"
                  id="address"
                    name="address"
                  value={profile.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <h6 className="mt-4 mb-3">Academic Background</h6>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="highSchool" className="form-label">High School</label>
                  <input
                    type="text"
                    className="form-control"
                    id="highSchool"
                    name="highSchool"
                    value={profile.highSchool}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="graduationYear" className="form-label">Graduation Year</label>
                  <input
                    type="number"
                    className="form-control"
                    id="graduationYear"
                    name="graduationYear"
                    value={profile.graduationYear}
                    onChange={handleChange}
                    min="2000"
                    max="2030"
                  />
                </div>
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
                <i className="bi bi-person-circle display-1 text-muted"></i>
              </div>
              <h5>{profile.name}</h5>
              <p className="text-muted">{profile.email}</p>
              <div className="mt-3">
                <small className="text-muted">Student ID: {user?.id}</small>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <h6>Profile Completion</h6>
              <div className="progress mb-2">
                <div className="progress-bar" style={{ width: '75%' }}>75%</div>
              </div>
              <small className="text-muted">Complete your profile for better job matches</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Student Dashboard Component
function StudentDashboard() {
  return (
    <StudentLayout>
      <Routes>
        <Route path="/" element={<StudentDashboardHome />} />
        <Route path="/institutions" element={<InstitutionsAndCourses />} />
        <Route path="/applications" element={<StudentApplications />} />
        <Route path="/jobs" element={<JobOpportunities />} />
        <Route path="/transcript" element={<UploadTranscript />} />
        <Route path="/profile" element={<StudentProfile />} />
      </Routes>
    </StudentLayout>
  );
}

export default StudentDashboard;