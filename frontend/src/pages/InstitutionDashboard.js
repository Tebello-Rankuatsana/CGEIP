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
  orderBy,
  writeBatch
} from 'firebase/firestore';

// Institute Layout Component
function InstituteLayout({ children }) {
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
            <small style={{ color: '#9ca3af' }}>Institution Dashboard</small>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { 
                path: '/institute', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
                  </svg>
                ), 
                label: 'Dashboard' 
              },
              { 
                path: '/institute/faculties', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18C5,17.18 8,16 12,16C16,16 19,17.18 19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                ), 
                label: 'Manage Faculties' 
              },
              { 
                path: '/institute/courses', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18C5,17.18 8,16 12,16C16,16 19,17.18 19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                ), 
                label: 'Manage Courses' 
              },
              { 
                path: '/institute/applications', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                ), 
                label: 'Student Applications' 
              },
              { 
                path: '/institute/admissions', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                ), 
                label: 'Admissions' 
              },
              { 
                path: '/institute/profile', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                  </svg>
                ), 
                label: 'Institution Profile' 
              }
            ].map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/institute' && location.pathname.includes(item.path.replace('/institute/', '')));
              
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

// Institute Dashboard Home
function InstituteDashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    admittedStudents: 0,
    totalCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const instituteId = user.uid;
      
      // Get applications count
      const applicationsRef = collection(db, 'applications');
      const applicationsQuery = query(applicationsRef, where('institutionId', '==', instituteId));
      const applicationsSnapshot = await getDocs(applicationsQuery);
      
      // Get courses count
      const coursesRef = collection(db, 'courses');
      const coursesQuery = query(coursesRef, where('institutionId', '==', instituteId));
      const coursesSnapshot = await getDocs(coursesQuery);

      const applications = applicationsSnapshot.docs.map(doc => doc.data());
      
      setStats({
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        admittedStudents: applications.filter(app => app.status === 'admitted' || app.status === 'confirmed').length,
        totalCourses: coursesSnapshot.size
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
    { label: 'Total Applications', value: stats.totalApplications, color: '#40e0d0' },
    { label: 'Pending Review', value: stats.pendingApplications, color: '#f59e0b' },
    { label: 'Admitted Students', value: stats.admittedStudents, color: '#10b981' },
    { label: 'Total Courses', value: stats.totalCourses, color: '#3b82f6' }
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Institution Dashboard</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Manage your institution's courses and admissions</p>
      
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
      <div style={{ ...cardStyle }}>
        <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Quick Actions</h5>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { path: '/institute/courses', label: 'Manage Courses', color: '#40e0d0' },
            { path: '/institute/applications', label: 'Review Applications', color: '#10b981' },
            { path: '/institute/admissions', label: 'Publish Admissions', color: '#3b82f6' },
            { path: '/institute/profile', label: 'Update Profile', outline: true }
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

// Manage Faculties Component
function ManageFaculties() {
  const { user } = useAuth();
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (user?.uid) {
      fetchFaculties();
    }
  }, [user]);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const facultiesRef = collection(db, 'faculties');
      const q = query(facultiesRef, where('institutionId', '==', user.uid));
      const snapshot = await getDocs(q);
      const facultiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFaculties(facultiesData);
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
    if (!user?.uid) return;

    try {
      const facultyData = {
        institutionId: user.uid,
        name: formData.name,
        description: formData.description,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'faculties'), facultyData);
      
      alert('Faculty added successfully!');
      setShowAddForm(false);
      setFormData({ name: '', description: '' });
      fetchFaculties(); // Refresh the list
    } catch (error) {
      alert('Error adding faculty');
      console.error('Error:', error);
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty? This will also delete all associated courses.')) {
      try {
        // First, check if there are any courses in this faculty
        const coursesRef = collection(db, 'courses');
        const coursesQuery = query(coursesRef, where('faculty', '==', faculties.find(f => f.id === id)?.name));
        const coursesSnapshot = await getDocs(coursesQuery);
        
        if (!coursesSnapshot.empty) {
          alert('Cannot delete faculty. There are courses associated with this faculty. Please delete or reassign the courses first.');
          return;
        }

        await deleteDoc(doc(db, 'faculties', id));
        alert('Faculty deleted successfully!');
        fetchFaculties();
      } catch (error) {
        alert('Error deleting faculty');
        console.error('Error:', error);
      }
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
          <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Manage Faculties</h2>
          <p style={{ color: '#6b7280' }}>Add and manage faculties for your institution</p>
        </div>
        <button 
          style={buttonStyle}
          onClick={() => setShowAddForm(true)}
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
          Add Faculty
        </button>
      </div>

      {showAddForm && (
        <div style={{ ...cardStyle, marginBottom: '2rem' }}>
          <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Add New Faculty</h5>
          <form onSubmit={handleAddFaculty}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Faculty Name</label>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Description</label>
                <input
                  type="text"
                  style={inputStyle}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={buttonStyle}>Add Faculty</button>
              <button 
                type="button" 
                style={{
                  ...buttonStyle,
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  borderColor: '#d1d5db'
                }}
                onClick={() => setShowAddForm(false)}
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
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Faculty Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Description</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Created Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map(faculty => (
                <tr key={faculty.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{faculty.name}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{faculty.description}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>
                    {faculty.createdAt?.toDate().toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      style={deleteButtonStyle}
                      onClick={() => handleDeleteFaculty(faculty.id)}
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

// Manage Courses Component
function ManageCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
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
    if (user?.uid) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch courses
      const coursesRef = collection(db, 'courses');
      const coursesQuery = query(coursesRef, where('institutionId', '==', user.uid));
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesData = coursesSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setCourses(coursesData);

      // Fetch faculties
      const facultiesRef = collection(db, 'faculties');
      const facultiesQuery = query(facultiesRef, where('institutionId', '==', user.uid));
      const facultiesSnapshot = await getDocs(facultiesQuery);
      const facultiesData = facultiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFaculties(facultiesData);

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
    if (!user?.uid) return;

    try {
      const courseData = {
        institutionId: user.uid,
        name: formData.name,
        faculty: formData.faculty,
        duration: parseInt(formData.duration),
        requirements: formData.requirements,
        description: formData.description,
        tuitionFee: parseFloat(formData.tuitionFee),
        capacity: parseInt(formData.capacity),
        createdAt: new Date()
      };

      await addDoc(collection(db, 'courses'), courseData);
      
      alert('Course added successfully!');
      setShowAddForm(false);
      setFormData({ name: '', faculty: '', duration: '', requirements: '', description: '', tuitionFee: '', capacity: '' });
      fetchData(); // Refresh the list
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
      duration: course.duration.toString(),
      requirements: course.requirements,
      description: course.description,
      tuitionFee: course.tuitionFee.toString(),
      capacity: course.capacity.toString()
    });
    setShowAddForm(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      const courseData = {
        name: formData.name,
        faculty: formData.faculty,
        duration: parseInt(formData.duration),
        requirements: formData.requirements,
        description: formData.description,
        tuitionFee: parseFloat(formData.tuitionFee),
        capacity: parseInt(formData.capacity),
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'courses', editingCourse.id), courseData);
      
      alert('Course updated successfully!');
      setShowAddForm(false);
      setEditingCourse(null);
      setFormData({ name: '', faculty: '', duration: '', requirements: '', description: '', tuitionFee: '', capacity: '' });
      fetchData(); // Refresh the list
    } catch (error) {
      alert('Error updating course');
      console.error('Error:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all associated applications.')) {
      try {
        // Check if there are any applications for this course
        const applicationsRef = collection(db, 'applications');
        const applicationsQuery = query(applicationsRef, where('courseId', '==', id));
        const applicationsSnapshot = await getDocs(applicationsQuery);
        
        if (!applicationsSnapshot.empty) {
          alert('Cannot delete course. There are applications associated with this course. Please process or delete the applications first.');
          return;
        }

        await deleteDoc(doc(db, 'courses', id));
        alert('Course deleted successfully!');
        fetchData();
      } catch (error) {
        alert('Error deleting course');
        console.error('Error:', error);
      }
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
          <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Manage Courses</h2>
          <p style={{ color: '#6b7280' }}>Add, edit, or remove courses offered by your institution</p>
        </div>
        <button 
          style={buttonStyle}
          onClick={() => {
            setShowAddForm(true);
            setEditingCourse(null);
            setFormData({ name: '', faculty: '', duration: '', requirements: '', description: '', tuitionFee: '', capacity: '' });
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
          Add Course
        </button>
      </div>

      {showAddForm && (
        <div style={{ ...cardStyle, marginBottom: '2rem' }}>
          <h5 style={{ color: '#000000', marginBottom: '1rem' }}>{editingCourse ? 'Edit Course' : 'Add New Course'}</h5>
          <form onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Course Name</label>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Faculty</label>
                <select
                  style={selectStyle}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Duration (years)</label>
                <input
                  type="number"
                  style={inputStyle}
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  max="6"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Tuition Fee (M)</label>
                <input
                  type="number"
                  style={inputStyle}
                  name="tuitionFee"
                  value={formData.tuitionFee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Capacity</label>
                <input
                  type="number"
                  style={inputStyle}
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Requirements</label>
              <textarea
                style={textareaStyle}
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Description</label>
              <textarea
                style={textareaStyle}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={buttonStyle}>
                {editingCourse ? 'Update Course' : 'Add Course'}
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
                  setEditingCourse(null);
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
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Course Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Faculty</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Duration</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Tuition Fee</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Capacity</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{course.name}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{course.faculty}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{course.duration} years</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>M{course.tuitionFee}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{course.capacity}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      style={editButtonStyle}
                      onClick={() => handleEditCourse(course)}
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
                      style={deleteButtonStyle}
                      onClick={() => handleDeleteCourse(course.id)}
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

// Student Applications Component
function StudentApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const applicationsRef = collection(db, 'applications');
      const q = query(
        applicationsRef, 
        where('institutionId', '==', user.uid),
        orderBy('appliedAt', 'desc')
      );
      const snapshot = await getDocs(q);
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

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const application = applications.find(app => app.id === applicationId);
      
      // Check if student is already admitted elsewhere in this institution
      if (status === 'admitted') {
        const otherAdmissionsQuery = query(
          collection(db, 'applications'),
          where('studentId', '==', application.studentId),
          where('institutionId', '==', user.uid),
          where('status', '==', 'admitted')
        );
        const otherAdmissionsSnapshot = await getDocs(otherAdmissionsQuery);
        
        if (!otherAdmissionsSnapshot.empty) {
          alert('Student is already admitted to another program at this institution.');
          return;
        }
      }

      await updateDoc(doc(db, 'applications', applicationId), {
        status: status,
        updatedAt: new Date(),
        ...(status === 'admitted' && { admittedAt: new Date() })
      });

      // Create notification for student
      let notificationTitle, notificationMessage;
      
      switch (status) {
        case 'admitted':
          notificationTitle = "🎉 Admission Offer!";
          notificationMessage = `Congratulations! You have been admitted to ${application.courseName} at ${application.institutionName}`;
          break;
        case 'rejected':
          notificationTitle = "Application Update";
          notificationMessage = `Your application to ${application.courseName} at ${application.institutionName} has been reviewed`;
          break;
        case 'waiting':
          notificationTitle = "Application Waitlisted";
          notificationMessage = `Your application to ${application.courseName} has been placed on waitlist`;
          break;
        default:
          notificationTitle = "Application Status Updated";
          notificationMessage = `Your application status has been updated to ${status}`;
      }

      // Add notification for student
      await addDoc(collection(db, 'notifications'), {
        userId: application.studentId,
        title: notificationTitle,
        message: notificationMessage,
        type: status === 'admitted' ? 'success' : 'info',
        isRead: false,
        createdAt: new Date(),
        link: '/student/applications'
      });

      alert(`Application ${status} successfully!`);
      fetchApplications(); // Refresh the list
    } catch (error) {
      alert('Error updating application status');
      console.error('Error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { backgroundColor: '#f59e0b', color: '#000000' },
      admitted: { backgroundColor: '#10b981', color: '#ffffff' },
      rejected: { backgroundColor: '#ef4444', color: '#ffffff' },
      waiting: { backgroundColor: '#3b82f6', color: '#ffffff' },
      confirmed: { backgroundColor: '#059669', color: '#ffffff' },
      declined: { backgroundColor: '#dc2626', color: '#ffffff' }
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

  const admitButtonStyle = {
    ...buttonStyle,
    color: '#10b981',
    borderColor: '#10b981'
  };

  const waitlistButtonStyle = {
    ...buttonStyle,
    color: '#f59e0b',
    borderColor: '#f59e0b'
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Student Applications</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Review and manage student course applications</p>

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Student Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Course</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Application Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(application => (
                <tr key={application.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{application.studentName}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{application.courseName}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{application.appliedAt?.toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem' }}>{getStatusBadge(application.status)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {application.status !== 'admitted' && application.status !== 'confirmed' && application.status !== 'declined' && (
                        <>
                          <button 
                            style={admitButtonStyle}
                            onClick={() => handleUpdateStatus(application.id, 'admitted')}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#10b981';
                              e.target.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = '#10b981';
                            }}
                          >
                            Admit
                          </button>
                          <button 
                            style={waitlistButtonStyle}
                            onClick={() => handleUpdateStatus(application.id, 'waiting')}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#f59e0b';
                              e.target.style.color = '#000000';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = '#f59e0b';
                            }}
                          >
                            Waitlist
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
                        </>
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

// Admissions Component
function Admissions() {
  const { user } = useAuth();
  const [admittedStudents, setAdmittedStudents] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchAdmissionsData();
    }
  }, [user]);

  const fetchAdmissionsData = async () => {
    setLoading(true);
    try {
      const instituteId = user.uid;
      
      // Fetch admitted students
      const admittedQuery = query(
        collection(db, 'applications'),
        where('institutionId', '==', instituteId),
        where('status', 'in', ['admitted', 'confirmed']),
        orderBy('admittedAt', 'desc')
      );
      const admittedSnapshot = await getDocs(admittedQuery);
      const admittedData = admittedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        admittedAt: doc.data().admittedAt?.toDate(),
        appliedAt: doc.data().appliedAt?.toDate()
      }));

      // Fetch pending applications count
      const pendingQuery = query(
        collection(db, 'applications'),
        where('institutionId', '==', instituteId),
        where('status', '==', 'pending')
      );
      const pendingSnapshot = await getDocs(pendingQuery);

      setAdmittedStudents(admittedData);
      setPendingApplications(pendingSnapshot.size);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      setLoading(false);
    }
  };

  const handlePublishAdmissions = async () => {
    if (!user?.uid) return;

    try {
      const instituteId = user.uid;
      
      // Get institution details
      const instituteDoc = await getDoc(doc(db, 'institutions', instituteId));
      const instituteName = instituteDoc.exists() ? instituteDoc.data().name : "Institution";

      // Get all admitted students to notify them
      const admittedStudentsQuery = query(
        collection(db, 'applications'),
        where('institutionId', '==', instituteId),
        where('status', '==', 'admitted')
      );
      const admittedStudentsSnapshot = await getDocs(admittedStudentsQuery);

      // Create notifications for admitted students
      const notificationPromises = admittedStudentsSnapshot.docs.map(doc => {
        const application = doc.data();
        return addDoc(collection(db, 'notifications'), {
          userId: application.studentId,
          title: "📢 Admissions Published!",
          message: `Admission results have been published by ${instituteName}. Check your application status now!`,
          type: 'info',
          isRead: false,
          createdAt: new Date(),
          link: '/student/applications'
        });
      });

      await Promise.all(notificationPromises);

      // Update pending applications to waiting
      const pendingAppsQuery = query(
        collection(db, 'applications'),
        where('institutionId', '==', instituteId),
        where('status', '==', 'pending')
      );
      const pendingAppsSnapshot = await getDocs(pendingAppsQuery);

      const batch = writeBatch(db);
      pendingAppsSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { 
          status: 'waiting',
          updatedAt: new Date()
        });
      });

      await batch.commit();
      
      alert(`Admissions published successfully! ${admittedStudentsSnapshot.size} students admitted and ${pendingAppsSnapshot.size} waitlisted. Students have been notified.`);
      fetchAdmissionsData(); // Refresh data
      
    } catch (error) {
      alert('Error publishing admissions');
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
          <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Admissions Management</h2>
          <p style={{ color: '#6b7280' }}>Manage admitted students and publish admission results</p>
        </div>
        <button 
          style={buttonStyle}
          onClick={handlePublishAdmissions}
          disabled={pendingApplications === 0}
          onMouseEnter={(e) => {
            if (pendingApplications > 0) {
              e.target.style.backgroundColor = '#000000';
              e.target.style.color = '#40e0d0';
            }
          }}
          onMouseLeave={(e) => {
            if (pendingApplications > 0) {
              e.target.style.backgroundColor = '#40e0d0';
              e.target.style.color = '#000000';
            }
          }}
        >
          <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
          </svg>
          Publish Admissions ({pendingApplications} pending)
        </button>
      </div>

      <div style={cardStyle}>
        <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Admitted Students ({admittedStudents.length})</h5>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Student Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Course</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Application Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Admission Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Contact Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {admittedStudents.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{student.studentName}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{student.courseName}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{student.appliedAt?.toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{student.admittedAt?.toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{student.studentEmail}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      backgroundColor: student.status === 'confirmed' ? '#059669' : '#10b981',
                      color: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {student.status === 'confirmed' ? 'Confirmed' : 'Admitted'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {admittedStudents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p>No students admitted yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Institute Profile Component
function InstituteProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    contactPerson: '',
    phone: '',
    website: '',
    description: '',
    type: '',
    location: '',
    established: ''
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const instituteDoc = await getDoc(doc(db, 'institutions', user.uid));
      if (instituteDoc.exists()) {
        const instituteData = instituteDoc.data();
        setProfile({
          name: instituteData.name || '',
          email: instituteData.email || '',
          address: instituteData.address || '',
          contactPerson: instituteData.contactPerson || '',
          phone: instituteData.phone || '',
          website: instituteData.website || '',
          description: instituteData.description || '',
          type: instituteData.type || '',
          location: instituteData.location || '',
          established: instituteData.established || ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'institutions', user.uid), {
        ...profile,
        updatedAt: new Date()
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile. Please try again.');
      console.error('Error updating profile:', error);
    }
    setSaving(false);
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Institution Profile</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Manage your institution's profile information</p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={cardStyle}>
          <h5 style={{ color: '#000000', marginBottom: '1.5rem' }}>Institution Information</h5>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Institution Name</label>
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
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Contact Person</label>
              <input
                type="text"
                style={inputStyle}
                name="contactPerson"
                value={profile.contactPerson}
                onChange={handleChange}
              />
            </div>
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Institution Type</label>
              <select
                style={inputStyle}
                name="type"
                value={profile.type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="University">University</option>
                <option value="College">College</option>
                <option value="Institute">Institute</option>
                <option value="Polytechnic">Polytechnic</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Location</label>
              <input
                type="text"
                style={inputStyle}
                name="location"
                value={profile.location}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
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
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Established Year</label>
              <input
                type="number"
                style={inputStyle}
                name="established"
                value={profile.established}
                onChange={handleChange}
                min="1800"
                max="2030"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Description</label>
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

        <div style={cardStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <svg style={{ width: '3rem', height: '3rem', fill: '#40e0d0' }} viewBox="0 0 24 24">
                <path d="M18,15A4,4 0 0,1 22,19A4,4 0 0,1 18,23A4,4 0 0,1 14,19A4,4 0 0,1 18,15M18,17A2,2 0 0,0 16,19A2,2 0 0,0 18,21A2,2 0 0,0 20,19A2,2 0 0,0 18,17M6.05,14.54C6.05,14.54 7.46,13.12 7.47,10.3C7.11,8.11 7.97,5.54 9.94,3.58C12.87,0.65 17.14,0.17 19.5,2.5C21.83,4.86 21.35,9.13 18.42,12.06C16.46,14.03 13.89,14.89 11.7,14.53C8.88,14.54 7.46,15.95 7.46,15.95L3.22,20.19L1.81,18.78L6.05,14.54M18.07,3.93C16.5,2.37 13.5,2.84 11.35,5C9.21,7.14 8.73,10.15 10.29,11.71C11.86,13.27 14.86,12.79 17,10.65C19.16,8.5 19.63,5.5 18.07,3.93Z" />
              </svg>
            </div>
            <h5 style={{ color: '#000000', margin: '0 0 0.5rem 0' }}>{profile.name}</h5>
            <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>{profile.email}</p>
            <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              <small style={{ color: '#6b7280' }}>Institution ID: {user?.uid}</small>
            </div>
            <div style={{ textAlign: 'left', fontSize: '0.875rem', color: '#4b5563' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Type:</strong> {profile.type || 'Not specified'}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Location:</strong> {profile.location || 'Not specified'}
              </div>
              <div>
                <strong>Established:</strong> {profile.established || 'Not specified'}
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