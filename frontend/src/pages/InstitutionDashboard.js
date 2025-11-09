import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Institute Layout Component
function InstituteLayout({ children }) {
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
              <small className="text-muted">Institution Dashboard</small>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/institute" className={`nav-link ${location.pathname === '/institute' ? 'active' : ''}`}>
                  <i className="bi bi-speedometer2 me-2"></i>Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/institute/faculties" className={`nav-link ${location.pathname.includes('faculties') ? 'active' : ''}`}>
                  <i className="bi bi-building me-2"></i>Manage Faculties
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/institute/courses" className={`nav-link ${location.pathname.includes('courses') ? 'active' : ''}`}>
                  <i className="bi bi-book me-2"></i>Manage Courses
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/institute/applications" className={`nav-link ${location.pathname.includes('applications') ? 'active' : ''}`}>
                  <i className="bi bi-file-text me-2"></i>Student Applications
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/institute/admissions" className={`nav-link ${location.pathname.includes('admissions') ? 'active' : ''}`}>
                  <i className="bi bi-person-check me-2"></i>Admissions
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/institute/profile" className={`nav-link ${location.pathname.includes('profile') ? 'active' : ''}`}>
                  <i className="bi bi-gear me-2"></i>Institution Profile
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

// Institute Dashboard Home
function InstituteDashboardHome() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    admittedStudents: 0,
    totalCourses: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [appsRes, coursesRes] = await Promise.all([
        axios.get('http://localhost:5001/api/institute/applications', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5001/api/institute/courses', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const applications = appsRes.data;
      setStats({
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        admittedStudents: applications.filter(app => app.status === 'admitted').length,
        totalCourses: coursesRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <h2>Institution Dashboard</h2>
      <p className="text-muted">Manage your institution's courses and admissions</p>
      
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
              <h5 className="card-title">Pending Review</h5>
              <h2 className="card-text">{stats.pendingApplications}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Admitted Students</h5>
              <h2 className="card-text">{stats.admittedStudents}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Total Courses</h5>
              <h2 className="card-text">{stats.totalCourses}</h2>
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
                <Link to="/institute/courses" className="btn btn-primary me-2">
                  Manage Courses
                </Link>
                <Link to="/institute/applications" className="btn btn-success me-2">
                  Review Applications
                </Link>
                <Link to="/institute/admissions" className="btn btn-info me-2">
                  Publish Admissions
                </Link>
                <Link to="/institute/profile" className="btn btn-outline-secondary">
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Manage Faculties Component
function ManageFaculties() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/institute/faculties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaculties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching faculties:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/institute/faculties', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Faculty added successfully!');
      setShowAddForm(false);
      setFormData({ name: '', description: '' });
      fetchFaculties();
    } catch (error) {
      alert('Error adding faculty');
      console.error('Error:', error);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/institute/faculties/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Faculty deleted successfully!');
        fetchFaculties();
      } catch (error) {
        alert('Error deleting faculty');
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
          <h2>Manage Faculties</h2>
          <p className="text-muted">Add and manage faculties for your institution</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>Add Faculty
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add New Faculty</h5>
            <form onSubmit={handleAddFaculty}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Faculty Name</label>
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
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">Add Faculty</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
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
                  <th>Faculty Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculties.map(faculty => (
                  <tr key={faculty.id}>
                    <td>{faculty.name}</td>
                    <td>{faculty.description}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteFaculty(faculty.id)}
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

// Manage Courses Component
function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    faculty: '',
    duration: '',
    requirements: '',
    description: '',
    tuitionFee: '',
    capacity: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [coursesRes, facultiesRes] = await Promise.all([
        axios.get('http://localhost:5001/api/institute/courses', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5001/api/institute/faculties', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setCourses(coursesRes.data);
      setFaculties(facultiesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/institute/courses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Course added successfully!');
      setShowAddForm(false);
      setFormData({ name: '', faculty: '', duration: '', requirements: '', description: '', tuitionFee: '', capacity: '' });
      fetchData();
    } catch (error) {
      alert('Error adding course');
      console.error('Error:', error);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      faculty: course.faculty,
      duration: course.duration,
      requirements: course.requirements,
      description: course.description,
      tuitionFee: course.tuitionFee,
      capacity: course.capacity
    });
    setShowAddForm(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/institute/courses/${editingCourse.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Course updated successfully!');
      setShowAddForm(false);
      setEditingCourse(null);
      setFormData({ name: '', faculty: '', duration: '', requirements: '', description: '', tuitionFee: '', capacity: '' });
      fetchData();
    } catch (error) {
      alert('Error updating course');
      console.error('Error:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/institute/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Course deleted successfully!');
        fetchData();
      } catch (error) {
        alert('Error deleting course');
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
          <h2>Manage Courses</h2>
          <p className="text-muted">Add, edit, or remove courses offered by your institution</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowAddForm(true);
            setEditingCourse(null);
            setFormData({ name: '', faculty: '', duration: '', requirements: '', description: '', tuitionFee: '', capacity: '' });
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>Add Course
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editingCourse ? 'Edit Course' : 'Add New Course'}</h5>
            <form onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Course Name</label>
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
                  <label className="form-label">Faculty</label>
                  <select
                    className="form-select"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map(faculty => (
                      <option key={faculty.id} value={faculty.name}>{faculty.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Duration (years)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Tuition Fee (M)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="tuitionFee"
                    value={formData.tuitionFee}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCourse(null);
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
                  <th>Course Name</th>
                  <th>Faculty</th>
                  <th>Duration</th>
                  <th>Tuition Fee</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td>{course.name}</td>
                    <td>{course.faculty}</td>
                    <td>{course.duration} years</td>
                    <td>M{course.tuitionFee}</td>
                    <td>{course.capacity}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => handleEditCourse(course)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteCourse(course.id)}
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

// Student Applications Component
function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/institute/applications', {
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
      await axios.put(`http://localhost:5001/api/institute/applications/${applicationId}`, { status }, {
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
      <h2>Student Applications</h2>
      <p className="text-muted">Review and manage student course applications</p>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Application Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(application => (
                  <tr key={application.id}>
                    <td>{application.studentName}</td>
                    <td>{application.courseName}</td>
                    <td>{new Date(application.appliedAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(application.status)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-success"
                          onClick={() => handleUpdateStatus(application.id, 'admitted')}
                          disabled={application.status === 'admitted'}
                        >
                          Admit
                        </button>
                        <button 
                          className="btn btn-outline-warning"
                          onClick={() => handleUpdateStatus(application.id, 'waiting')}
                          disabled={application.status === 'waiting'}
                        >
                          Waitlist
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => handleUpdateStatus(application.id, 'rejected')}
                          disabled={application.status === 'rejected'}
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

// Admissions Component
function Admissions() {
  const [admittedStudents, setAdmittedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmittedStudents();
  }, []);

  const fetchAdmittedStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/institute/admissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmittedStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      setLoading(false);
    }
  };

  const handlePublishAdmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/institute/publish-admissions', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Admissions published successfully! Students will be notified.');
    } catch (error) {
      alert('Error publishing admissions');
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
          <h2>Admissions Management</h2>
          <p className="text-muted">Manage admitted students and publish admission results</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handlePublishAdmissions}
        >
          <i className="bi bi-megaphone me-2"></i>Publish Admissions
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Admitted Students</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Admission Date</th>
                  <th>Contact Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {admittedStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.studentName}</td>
                    <td>{student.courseName}</td>
                    <td>{new Date(student.admittedAt).toLocaleDateString()}</td>
                    <td>{student.studentEmail}</td>
                    <td>
                      <span className="badge bg-success">Admitted</span>
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

// Institute Profile Component
function InstituteProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    contactPerson: '',
    phone: '',
    website: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/institute/profile', {
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
      await axios.patch('http://localhost:5001/api/institute/profile', profile, {
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
      <h2>Institution Profile</h2>
      <p className="text-muted">Manage your institution's profile information</p>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Institution Information</h5>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Institution Name</label>
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
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactPerson"
                    value={profile.contactPerson}
                    onChange={handleChange}
                  />
                </div>
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

              <div className="row">
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
                <label className="form-label">Description</label>
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
              <p className="text-muted">{profile.email}</p>
              <div className="mt-3">
                <small className="text-muted">Institution ID: {user?.uid}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Institute Dashboard Component
function InstituteDashboard() {
  return (
    <InstituteLayout>
      <Routes>
        <Route path="/" element={<InstituteDashboardHome />} />
        <Route path="/faculties" element={<ManageFaculties />} />
        <Route path="/courses" element={<ManageCourses />} />
        <Route path="/applications" element={<StudentApplications />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/profile" element={<InstituteProfile />} />
      </Routes>
    </InstituteLayout>
  );
}

export default InstituteDashboard;