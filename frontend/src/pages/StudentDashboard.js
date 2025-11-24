import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, updateDoc, addDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';

// Student Layout Component
function StudentLayout({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

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

  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', user?.uid),
        where('isRead', '==', false)
      );
      const snapshot = await getDocs(q);
      setUnreadCount(snapshot.size);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={sidebarStyle}>
        <div style={{ padding: '1.5rem 1rem', position: 'sticky', top: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #374151' }}>
            <h5 style={{ color: '#40e0d0', margin: '0 0 0.25rem 0' }}>Welcome, {user?.name}</h5>
            <small style={{ color: '#9ca3af' }}>Student Dashboard</small>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { 
                path: '/student', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
                  </svg>
                ), 
                label: 'Dashboard' 
              },
              { 
                path: '/student/institutions', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18C5,17.18 8,16 12,16C16,16 19,17.18 19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                ), 
                label: 'Institutions & Courses' 
              },
              { 
                path: '/student/applications', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                ), 
                label: 'My Applications' 
              },
              { 
                path: '/student/jobs', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
                  </svg>
                ), 
                label: 'Job Opportunities' 
              },
              { 
                path: '/student/transcript', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z" />
                  </svg>
                ), 
                label: 'Upload Transcript' 
              },
              { 
                path: '/student/profile', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                ), 
                label: 'Profile' 
              },
              {
                path: '/student/notifications', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10,21H14A2,2 0 0,1 12,23A2,2 0 0,1 10,21M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19Z" />
                  </svg>
                ), 
                label: `Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}` 
              }
            ].map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/student' && location.pathname.includes(item.path.replace('/student/', '')));
              
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

// Student Dashboard Home
function StudentDashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    admittedApplications: 0,
    rejectedApplications: 0
  });

  useEffect(() => {
    if (user?.uid) {
      fetchApplicationStats();
    }
  }, [user]);

  const fetchApplicationStats = async () => {
    try {
      const applicationsRef = collection(db, 'applications');
      const q = query(applicationsRef, where('studentId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      const applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
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
    { label: 'Pending', value: stats.pendingApplications, color: '#f59e0b' },
    { label: 'Admitted', value: stats.admittedApplications, color: '#10b981' },
    { label: 'Rejected', value: stats.rejectedApplications, color: '#ef4444' }
  ];

  return (
    <div>
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Student Dashboard</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Overview of your academic applications and career opportunities</p>
      
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
            { path: '/student/institutions', label: 'Browse Institutions & Courses', color: '#40e0d0' },
            { path: '/student/jobs', label: 'View Job Opportunities', color: '#10b981' },
            { path: '/student/transcript', label: 'Upload Academic Transcript', color: '#3b82f6' },
            { path: '/student/profile', label: 'Update Profile', outline: true }
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

// Institutions and Courses Component
function InstitutionsAndCourses() {
  const { user } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [appliedCourses, setAppliedCourses] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutions();
    fetchAppliedCourses();
  }, [user]);

  const fetchInstitutions = async () => {
    try {
      const institutionsRef = collection(db, 'institutions');
      const snapshot = await getDocs(institutionsRef);
      const institutionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInstitutions(institutionsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setLoading(false);
    }
  };

  const fetchAppliedCourses = async () => {
    if (!user?.uid) return;
    
    try {
      const applicationsRef = collection(db, 'applications');
      const q = query(applicationsRef, where('studentId', '==', user.uid));
      const snapshot = await getDocs(q);
      const appliedCourseIds = snapshot.docs.map(doc => doc.data().courseId);
      setAppliedCourses(new Set(appliedCourseIds));
    } catch (error) {
      console.error('Error fetching applied courses:', error);
    }
  };

  const fetchCourses = async (institutionId) => {
    try {
      const coursesRef = collection(db, 'courses');
      const q = query(coursesRef, where('institutionId', '==', institutionId));
      const snapshot = await getDocs(q);
      const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesData);
      setSelectedInstitution(institutionId);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const applyForCourse = async (course) => {
    if (!user?.uid) {
      alert('Please log in to apply for courses');
      return;
    }

    try {
      // Check if already applied to 2 courses in this institution
      const applicationsRef = collection(db, 'applications');
      const q = query(
        applicationsRef,
        where('studentId', '==', user.uid),
        where('institutionId', '==', selectedInstitution)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.size >= 2) {
        alert('You can only apply for 2 courses per institution.');
        return;
      }

      // Check if already applied to this specific course
      const existingAppQuery = query(
        applicationsRef,
        where('studentId', '==', user.uid),
        where('courseId', '==', course.id)
      );
      const existingAppSnapshot = await getDocs(existingAppQuery);
      
      if (!existingAppSnapshot.empty) {
        alert('Already applied for this course');
        return;
      }

      // Get institution details
      const institutionDoc = await getDoc(doc(db, 'institutions', selectedInstitution));
      const institutionData = institutionDoc.data();

      // Create application
      const applicationData = {
        studentId: user.uid,
        institutionId: selectedInstitution,
        courseId: course.id,
        courseName: course.name,
        institutionName: institutionData.name,
        status: 'pending',
        appliedAt: new Date(),
        studentName: user.name,
        studentEmail: user.email
      };

      await addDoc(collection(db, 'applications'), applicationData);
      
      // Update applied courses
      setAppliedCourses(prev => new Set([...prev, course.id]));
      alert('Course application submitted successfully!');
      
    } catch (error) {
      console.error('Error applying for course:', error);
      alert('Error applying for course. Please try again.');
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #40e0d0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    backgroundColor: '#40e0d0',
    color: '#000000',
    border: '2px solid #40e0d0',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const appliedButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#10b981',
    borderColor: '#10b981',
    color: '#ffffff'
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Institutions & Courses</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Browse higher learning institutions and apply for courses (maximum 2 per institution)</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Institutions List */}
        <div style={cardStyle}>
          <div style={{ marginBottom: '1rem' }}>
            <h5 style={{ color: '#000000', margin: '0 0 0.25rem 0' }}>Institutions</h5>
            <small style={{ color: '#6b7280' }}>{institutions.length} institutions available</small>
          </div>
          <div style={{ maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {institutions.map(institution => (
              <button
                key={institution.id}
                style={{
                  backgroundColor: selectedInstitution === institution.id ? '#40e0d0' : 'transparent',
                  color: selectedInstitution === institution.id ? '#000000' : '#374151',
                  border: '1px solid #d1d5db',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => fetchCourses(institution.id)}
                onMouseEnter={(e) => {
                  if (selectedInstitution !== institution.id) {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.borderColor = '#40e0d0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedInstitution !== institution.id) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = '#d1d5db';
                  }
                }}
              >
                <h6 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>{institution.name}</h6>
                <small style={{ display: 'block', marginBottom: '0.25rem' }}>{institution.location}</small>
                <small style={{ color: selectedInstitution === institution.id ? '#000000' : '#6b7280' }}>{institution.type}</small>
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {selectedInstitution ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#000000', margin: 0 }}>
                  {institutions.find(inst => inst.id === selectedInstitution)?.name} - Courses
                </h4>
                <span style={{
                  backgroundColor: '#40e0d0',
                  color: '#000000',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {courses.length} courses available
                </span>
              </div>
              
              {courses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
                  <svg style={{ width: '3rem', height: '3rem', fill: '#6b7280', marginBottom: '1rem' }} viewBox="0 0 24 24">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18C5,17.18 8,16 12,16C16,16 19,17.18 19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                  <p style={{ margin: '0 0 1rem 0' }}>No courses available for this institution</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                  {courses.map(course => (
                    <div 
                      key={course.id} 
                      style={{
                        ...cardStyle,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 15px rgba(64, 224, 208, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <h5 style={{ color: '#000000', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{course.name}</h5>
                      <h6 style={{ color: '#40e0d0', margin: '0 0 1rem 0', fontSize: '0.875rem' }}>{course.faculty}</h6>
                      <p style={{ color: '#4b5563', margin: '0 0 1rem 0', fontSize: '0.875rem', flex: 1 }}>{course.description}</p>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <small style={{ color: '#000000', fontWeight: '600' }}>Duration:</small>
                          <small style={{ color: '#4b5563', marginLeft: '0.5rem' }}>{course.duration} years</small>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <small style={{ color: '#000000', fontWeight: '600' }}>Requirements:</small>
                          <small style={{ color: '#4b5563', marginLeft: '0.5rem' }}>{course.requirements}</small>
                        </div>
                        <div>
                          <small style={{ color: '#000000', fontWeight: '600' }}>Tuition:</small>
                          <small style={{ color: '#4b5563', marginLeft: '0.5rem' }}>M{course.tuitionFee}/year</small>
                        </div>
                      </div>
                      
                      <button 
                        style={appliedCourses.has(course.id) ? appliedButtonStyle : buttonStyle}
                        onClick={() => applyForCourse(course)}
                        disabled={appliedCourses.has(course.id)}
                        onMouseEnter={(e) => {
                          if (!appliedCourses.has(course.id)) {
                            e.target.style.backgroundColor = '#000000';
                            e.target.style.color = '#40e0d0';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!appliedCourses.has(course.id)) {
                            e.target.style.backgroundColor = '#40e0d0';
                            e.target.style.color = '#000000';
                          }
                        }}
                      >
                        {appliedCourses.has(course.id) ? 'Applied ✓' : 'Apply for Course'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
              <svg style={{ width: '3rem', height: '3rem', fill: '#6b7280', marginBottom: '1rem' }} viewBox="0 0 24 24">
                <path d="M18,15A4,4 0 0,1 22,19A4,4 0 0,1 18,23A4,4 0 0,1 14,19A4,4 0 0,1 18,15M18,17A2,2 0 0,0 16,19A2,2 0 0,0 18,21A2,2 0 0,0 20,19A2,2 0 0,0 18,17M6.05,14.54C6.05,14.54 7.46,13.12 7.47,10.3C7.11,8.11 7.97,5.54 9.94,3.58C12.87,0.65 17.14,0.17 19.5,2.5C21.83,4.86 21.35,9.13 18.42,12.06C16.46,14.03 13.89,14.89 11.7,14.53C8.88,14.54 7.46,15.95 7.46,15.95L3.22,20.19L1.81,18.78L6.05,14.54M18.07,3.93C16.5,2.37 13.5,2.84 11.35,5C9.21,7.14 8.73,10.15 10.29,11.71C11.86,13.27 14.86,12.79 17,10.65C19.16,8.5 19.63,5.5 18.07,3.93Z" />
              </svg>
              <p style={{ margin: '0 0 1rem 0' }}>Select an institution to view available courses</p>
              <small style={{ color: '#6b7280' }}>{institutions.length} institutions with courses available</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Applications Component
function StudentApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const applicationsRef = collection(db, 'applications');
      const q = query(applicationsRef, where('studentId', '==', user.uid), orderBy('appliedAt', 'desc'));
      const snapshot = await getDocs(q);
      const applicationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(applicationsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const withdrawApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await deleteDoc(doc(db, 'applications', applicationId));
        setApplications(prev => prev.filter(app => app.id !== applicationId));
        alert('Application withdrawn successfully!');
      } catch (error) {
        console.error('Error withdrawing application:', error);
        alert('Error withdrawing application. Please try again.');
      }
    }
  };

  const acceptAdmission = async (applicationId) => {
    try {
      // Update the application status to confirmed
      await updateDoc(doc(db, 'applications', applicationId), {
        status: 'confirmed',
        confirmedAt: new Date()
      });

      // Get all other admitted applications for this student
      const otherAdmittedAppsQuery = query(
        collection(db, 'applications'),
        where('studentId', '==', user.uid),
        where('status', '==', 'admitted'),
        where('id', '!=', applicationId)
      );
      
      const otherAdmittedSnapshot = await getDocs(otherAdmittedAppsQuery);
      
      // Decline all other admitted applications
      const batchUpdates = [];
      otherAdmittedSnapshot.forEach(doc => {
        batchUpdates.push(updateDoc(doc.ref, { 
          status: 'declined', 
          declinedAt: new Date() 
        }));
      });

      // Execute all updates
      await Promise.all(batchUpdates);
      
      alert('Admission accepted successfully! Other offers have been declined.');
      fetchApplications(); // Refresh the list
      
    } catch (error) {
      console.error('Error accepting admission:', error);
      alert('Error accepting admission. Please try again.');
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
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginRight: '0.5rem'
  };

  const outlineButtonStyle = {
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer'
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>My Applications</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Track your course applications and admission status</p>

      {applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
          <svg style={{ width: '3rem', height: '3rem', fill: '#6b7280', marginBottom: '1rem' }} viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          <p style={{ margin: '0 0 1.5rem 0' }}>No applications submitted yet</p>
          <Link 
            to="/student/institutions" 
            style={{
              backgroundColor: '#40e0d0',
              color: '#000000',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: '600',
              border: '2px solid #40e0d0',
              transition: 'all 0.3s ease',
              display: 'inline-block'
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
            Browse Courses to Apply
          </Link>
        </div>
      ) : (
        <div style={cardStyle}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Course</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Institution</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Application Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(application => (
                  <tr key={application.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem', color: '#000000' }}>{application.courseName}</td>
                    <td style={{ padding: '0.75rem', color: '#4b5563' }}>{application.institutionName}</td>
                    <td style={{ padding: '0.75rem', color: '#4b5563' }}>{application.appliedAt?.toDate().toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem' }}>{getStatusBadge(application.status)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {application.status === 'admitted' && (
                          <button 
                            style={buttonStyle}
                            onClick={() => acceptAdmission(application.id)}
                          >
                            Accept Offer
                          </button>
                        )}
                        {application.status === 'pending' && (
                          <button 
                            style={outlineButtonStyle}
                            onClick={() => withdrawApplication(application.id)}
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Job Opportunities Component
function JobOpportunities() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchJobs();
      fetchAppliedJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const jobsRef = collection(db, 'jobs');
      const q = query(
        jobsRef, 
        where('status', '==', 'active'),
        where('deadline', '>', new Date())
      );
      const snapshot = await getDocs(q);
      const jobsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        deadline: doc.data().deadline?.toDate()
      }));
      setJobs(jobsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    if (!user?.uid) return;
    
    try {
      const jobApplicationsRef = collection(db, 'jobApplications');
      const q = query(jobApplicationsRef, where('studentId', '==', user.uid));
      const snapshot = await getDocs(q);
      const appliedJobIds = snapshot.docs.map(doc => doc.data().jobId);
      setAppliedJobs(new Set(appliedJobIds));
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  };

  const applyForJob = async (jobId) => {
    if (!user?.uid) {
      alert('Please log in to apply for jobs');
      return;
    }

    try {
      // Check if already applied
      const jobApplicationsRef = collection(db, 'jobApplications');
      const existingAppQuery = query(
        jobApplicationsRef,
        where('studentId', '==', user.uid),
        where('jobId', '==', jobId)
      );
      const existingAppSnapshot = await getDocs(existingAppQuery);
      
      if (!existingAppSnapshot.empty) {
        alert('Already applied for this job');
        return;
      }

      // Get student and job data
      const studentDoc = await getDoc(doc(db, 'students', user.uid));
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));
      
      if (!studentDoc.exists() || !jobDoc.exists()) {
        alert('Student or job not found');
        return;
      }

      const studentData = studentDoc.data();
      const jobData = jobDoc.data();

      // Create job application
      const jobApplication = {
        studentId: user.uid,
        jobId: jobId,
        studentName: studentData.name,
        studentEmail: studentData.email,
        jobTitle: jobData.title,
        companyName: jobData.companyName,
        status: 'pending',
        appliedAt: new Date(),
        transcriptUrl: studentData.transcriptUrl || ''
      };

      await addDoc(collection(db, 'jobApplications'), jobApplication);
      
      // Update applied jobs
      setAppliedJobs(prev => new Set([...prev, jobId]));
      alert('Job application submitted successfully!');
      
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Error applying for job. Please try again.');
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #40e0d0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    height: '100%'
  };

  const buttonStyle = {
    backgroundColor: '#40e0d0',
    color: '#000000',
    border: '2px solid #40e0d0',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const appliedButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#10b981',
    borderColor: '#10b981',
    color: '#ffffff'
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Job Opportunities</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Browse available job positions from partner companies</p>

      {jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
          <svg style={{ width: '3rem', height: '3rem', fill: '#6b7280', marginBottom: '1rem' }} viewBox="0 0 24 24">
            <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
          </svg>
          <p style={{ margin: '0 0 1rem 0' }}>No job opportunities available at the moment</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {jobs.map(job => (
            <div 
              key={job.id} 
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(64, 224, 208, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h5 style={{ color: '#000000', margin: '0 0 0.5rem 0' }}>{job.title}</h5>
              <h6 style={{ color: '#40e0d0', margin: '0 0 1rem 0' }}>{job.companyName}</h6>
              <p style={{ color: '#4b5563', margin: '0 0 1rem 0' }}>{job.description}</p>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#000000' }}>Requirements:</strong>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: '#4b5563' }}>
                  {job.requirements?.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <small><strong style={{ color: '#000000' }}>Location:</strong> {job.location}</small>
                </div>
                <div style={{ marginBottom: '0.25rem' }}>
                  <small><strong style={{ color: '#000000' }}>Salary:</strong> {job.salary}</small>
                </div>
                <div>
                  <small><strong style={{ color: '#000000' }}>Deadline:</strong> {job.deadline?.toLocaleDateString()}</small>
                </div>
              </div>
              
              <button 
                style={appliedJobs.has(job.id) ? appliedButtonStyle : buttonStyle}
                onClick={() => applyForJob(job.id)}
                disabled={appliedJobs.has(job.id)}
                onMouseEnter={(e) => {
                  if (!appliedJobs.has(job.id)) {
                    e.target.style.backgroundColor = '#000000';
                    e.target.style.color = '#40e0d0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!appliedJobs.has(job.id)) {
                    e.target.style.backgroundColor = '#40e0d0';
                    e.target.style.color = '#000000';
                  }
                }}
              >
                {appliedJobs.has(job.id) ? 'Applied ✓' : 'Apply for Job'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Transcript Upload Component
function UploadTranscript() {
  const { user } = useAuth();
  const [transcript, setTranscript] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      const studentDoc = await getDoc(doc(db, 'students', user.uid));
      if (studentDoc.exists()) {
        setStudentData(studentDoc.data());
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const handleFileChange = (e) => {
    setTranscript(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!transcript) {
      alert('Please select a file to upload');
      return;
    }

    if (!user?.uid) {
      alert('Please log in to upload transcript');
      return;
    }

    setUploading(true);
    try {
      // In a real implementation, you would upload the file to Firebase Storage
      // For now, we'll simulate by storing the file name and update timestamp
      
      const transcriptUrl = `https://example.com/transcripts/${user.uid}/${transcript.name}`;
      
      await updateDoc(doc(db, 'students', user.uid), {
        transcriptUrl: transcriptUrl,
        transcriptUploadedAt: new Date(),
        updatedAt: new Date()
      });

      setStudentData(prev => ({
        ...prev,
        transcriptUrl: transcriptUrl,
        transcriptUploadedAt: new Date()
      }));
      
      alert('Transcript uploaded successfully!');
      setTranscript(null);
      document.getElementById('transcriptFile').value = '';
    } catch (error) {
      alert('Error uploading transcript. Please try again.');
      console.error('Error uploading transcript:', error);
    }
    setUploading(false);
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

  return (
    <div>
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Upload Academic Transcript</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Upload your academic transcripts and certificates for career opportunities</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={cardStyle}>
          <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Upload New Transcript</h5>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="transcriptFile" style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>
              Select Transcript File
            </label>
            <input 
              type="file" 
              id="transcriptFile"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: '#f9fafb'
              }}
            />
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max: 10MB)
            </div>
          </div>

          {transcript && (
            <div style={{
              backgroundColor: '#dbeafe',
              border: '1px solid #3b82f6',
              borderRadius: '0.375rem',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <strong style={{ color: '#000000' }}>Selected file:</strong> {transcript.name}<br />
              <strong style={{ color: '#000000' }}>Size:</strong> {(transcript.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}

          <button 
            style={{
              ...buttonStyle,
              opacity: (!transcript || uploading) ? 0.6 : 1,
              cursor: (!transcript || uploading) ? 'not-allowed' : 'pointer'
            }}
            onClick={handleUpload}
            disabled={!transcript || uploading}
            onMouseEnter={(e) => {
              if (transcript && !uploading) {
                e.target.style.backgroundColor = '#000000';
                e.target.style.color = '#40e0d0';
              }
            }}
            onMouseLeave={(e) => {
              if (transcript && !uploading) {
                e.target.style.backgroundColor = '#40e0d0';
                e.target.style.color = '#000000';
              }
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Transcript'}
          </button>
        </div>

        <div style={cardStyle}>
          <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Uploaded Documents</h5>
          
          {!studentData?.transcriptUrl ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No documents uploaded yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  backgroundColor: '#f9fafb'
                }}
              >
                <div>
                  <h6 style={{ margin: '0 0 0.25rem 0', color: '#000000' }}>Academic Transcript</h6>
                  <small style={{ color: '#6b7280' }}>
                    Uploaded: {studentData.transcriptUploadedAt?.toDate().toLocaleDateString()}
                  </small>
                </div>
                <span style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Uploaded
                </span>
              </div>
              {studentData.transcriptUrl && (
                <a 
                  href={studentData.transcriptUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'inline-block',
                    marginTop: '0.5rem'
                  }}
                >
                  View Transcript →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Student Profile Component
function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    highSchool: '',
    graduationYear: '',
    transcriptUrl: ''
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
      const studentDoc = await getDoc(doc(db, 'students', user.uid));
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        setProfile({
          name: studentData.name || '',
          email: studentData.email || '',
          phone: studentData.phone || '',
          dateOfBirth: studentData.dateOfBirth || '',
          address: studentData.address || '',
          highSchool: studentData.highSchool || '',
          graduationYear: studentData.graduationYear || '',
          transcriptUrl: studentData.transcriptUrl || ''
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
      await updateDoc(doc(db, 'students', user.uid), {
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Student Profile</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Manage your personal information and academic details</p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={cardStyle}>
          <h5 style={{ color: '#000000', marginBottom: '1.5rem' }}>Personal Information</h5>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                style={{ ...inputStyle, backgroundColor: '#f3f4f6', color: '#6b7280' }}
                disabled
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="address" style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows="3"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <h6 style={{ color: '#000000', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
            Academic Background
          </h6>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="highSchool" style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>
                High School
              </label>
              <input
                type="text"
                id="highSchool"
                name="highSchool"
                value={profile.highSchool}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="graduationYear" style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>
                Graduation Year
              </label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={profile.graduationYear}
                onChange={handleChange}
                min="2000"
                max="2030"
                style={inputStyle}
              />
            </div>
          </div>

          <button 
            style={{
              ...buttonStyle,
              marginTop: '1.5rem',
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
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </div>
            <h5 style={{ color: '#000000', margin: '0 0 0.5rem 0' }}>{profile.name}</h5>
            <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>{profile.email}</p>
            <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}>
              <small style={{ color: '#6b7280' }}>Student ID: {user?.uid}</small>
            </div>
            {profile.transcriptUrl && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#10b981', borderRadius: '0.375rem' }}>
                <small style={{ color: '#ffffff', fontWeight: '600' }}>Transcript Uploaded</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Student Notifications Component
function StudentNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef, 
        where('userId', '==', user?.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const notificationsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.isRead).length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true,
        readAt: new Date()
      });
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      const updatePromises = unreadNotifications.map(notification =>
        updateDoc(doc(db, 'notifications', notification.id), {
          isRead: true,
          readAt: new Date()
        })
      );
      
      await Promise.all(updatePromises);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
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
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: '#000000', margin: 0 }}>Notifications</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {unreadCount > 0 && (
            <span style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {unreadCount} unread
            </span>
          )}
          {unreadCount > 0 && (
            <button 
              style={buttonStyle}
              onClick={markAllAsRead}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#000000';
                e.target.style.color = '#40e0d0';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#40e0d0';
                e.target.style.color = '#000000';
              }}
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      <div style={cardStyle}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p>No notifications yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map(notification => (
              <div
                key={notification.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  backgroundColor: notification.isRead ? '#ffffff' : '#f0f9ff',
                  borderLeft: `4px solid ${
                    notification.type === 'success' ? '#10b981' : 
                    notification.type === 'warning' ? '#f59e0b' : 
                    notification.type === 'error' ? '#ef4444' : '#3b82f6'
                  }`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h6 style={{ margin: '0 0 0.5rem 0', color: '#000000' }}>
                      {notification.title}
                    </h6>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#4b5563' }}>
                      {notification.message}
                    </p>
                    <small style={{ color: '#6b7280' }}>
                      {notification.createdAt?.toLocaleDateString()} at{' '}
                      {notification.createdAt?.toLocaleTimeString()}
                    </small>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #d1d5db',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#40e0d0';
                        e.target.style.color = '#000000';
                        e.target.style.borderColor = '#40e0d0';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#6b7280';
                        e.target.style.borderColor = '#d1d5db';
                      }}
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
        <Route path="/notifications" element={<StudentNotifications />} />
      </Routes>
    </StudentLayout>
  );
}

export default StudentDashboard;