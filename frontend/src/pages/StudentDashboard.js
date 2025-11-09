import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Student Layout Component
function StudentLayout({ children }) {
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
      const user = JSON.parse(localStorage.getItem('user'));
      const userApplications = JSON.parse(localStorage.getItem('studentApplications') || '{}');
      const applications = userApplications[user?.uid] || [];
      
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

      {/* Recent Activity */}
      <div style={cardStyle}>
        <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Recent Activity</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { 
              title: 'Course Application Submitted', 
              time: '2 hours ago', 
              description: 'Software Engineering at Limkokwing University',
              status: 'Pending Review',
              statusColor: '#f59e0b'
            },
            { 
              title: 'New Job Match', 
              time: '1 day ago', 
              description: 'Junior Developer at Tech Solutions Lesotho',
              status: 'Matches your profile',
              statusColor: '#10b981'
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

// Institutions and Courses Component
function InstitutionsAndCourses() {
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [appliedCourses, setAppliedCourses] = useState(new Set());

  // Hardcoded Institutions Data
  const hardcodedInstitutions = [
    {
      id: 'inst1',
      name: 'National University of Lesotho (NUL)',
      location: 'Roma, Maseru',
      contactEmail: 'admissions@nul.ls',
      description: 'Premier institution of higher learning in Lesotho',
      type: 'University',
      established: '1945'
    },
    {
      id: 'inst2',
      name: 'Limkokwing University of Creative Technology',
      location: 'Maseru',
      contactEmail: 'info@limkokwing.ls',
      description: 'Innovative university focusing on creative technology',
      type: 'University',
      established: '2008'
    },
    {
      id: 'inst3',
      name: 'Botho University Lesotho',
      location: 'Maseru',
      contactEmail: 'enquiry@bothocollege.ac.ls',
      description: 'Private university offering professional education',
      type: 'University',
      established: '1997'
    },
    {
      id: 'inst4',
      name: 'Lesotho College of Education',
      location: 'Maseru',
      contactEmail: 'admissions@lce.ac.ls',
      description: 'Specialized in teacher education and training',
      type: 'College',
      established: '1975'
    },
    {
      id: 'inst5',
      name: 'Lesotho Agricultural College',
      location: 'Maseru',
      contactEmail: 'info@agricollege.ls',
      description: 'Leading institution in agricultural sciences',
      type: 'College',
      established: '1955'
    },
    {
      id: 'inst6',
      name: 'Lesotho Institute of Public Administration',
      location: 'Maseru',
      contactEmail: 'admin@lipam.ls',
      description: 'Training public servants and administrators',
      type: 'Institute',
      established: '1975'
    },
    {
      id: 'inst7',
      name: 'Maseru Private Hospital Nursing School',
      location: 'Maseru',
      contactEmail: 'nursing@mph.org.ls',
      description: 'Healthcare and nursing education',
      type: 'College',
      established: '1985'
    },
    {
      id: 'inst8',
      name: 'Lesotho Tourism Development College',
      location: 'Maseru',
      contactEmail: 'tourism@ltdc.ls',
      description: 'Specialized in tourism and hospitality',
      type: 'College',
      established: '2001'
    },
    {
      id: 'inst9',
      name: 'Computer Training Institute Lesotho',
      location: 'Maseru',
      contactEmail: 'info@cti.ls',
      description: 'IT and computer science education',
      type: 'Institute',
      established: '2003'
    },
    {
      id: 'inst10',
      name: 'Lesotho Business School',
      location: 'Maseru',
      contactEmail: 'admissions@lbs.ls',
      description: 'Business and management education',
      type: 'College',
      established: '1999'
    },
    {
      id: 'inst11',
      name: 'Mokhotlong Technical Institute',
      location: 'Mokhotlong',
      contactEmail: 'info@mti.ls',
      description: 'Technical and vocational training',
      type: 'Institute',
      established: '1988'
    },
    {
      id: 'inst12',
      name: 'Quthing Nursing School',
      location: 'Quthing',
      contactEmail: 'nursing@quthinghospital.ls',
      description: 'Healthcare education in southern Lesotho',
      type: 'College',
      established: '1992'
    },
    {
      id: 'inst13',
      name: 'Lerotholi Polytechnic',
      location: 'Maseru',
      contactEmail: 'registrar@lerotholi.ls',
      description: 'Technical and engineering education',
      type: 'Polytechnic',
      established: '1960'
    },
    {
      id: 'inst14',
      name: 'Lesotho Institute of Accountancy',
      location: 'Maseru',
      contactEmail: 'lia@lia.ac.ls',
      description: 'Accounting and finance education',
      type: 'Institute',
      established: '1977'
    },
    {
      id: 'inst15',
      name: 'Mafeteng Community College',
      location: 'Mafeteng',
      contactEmail: 'info@mafetengcollege.ls',
      description: 'Community-based education and training',
      type: 'College',
      established: '1995'
    }
  ];

  // Hardcoded Courses Data by Institution
  const hardcodedCourses = {
    inst1: [
      { id: 'course1', name: 'Bachelor of Science in Computer Science', faculty: 'Science & Technology', duration: 4, tuitionFee: 15000, description: 'Comprehensive computer science education with programming, algorithms, and software development.', requirements: 'LGCSE with credit in Mathematics and English' },
      { id: 'course2', name: 'Bachelor of Commerce', faculty: 'Business Administration', duration: 4, tuitionFee: 12000, description: 'Business management, accounting, and economics education.', requirements: 'LGCSE with credit in Mathematics and English' }
    ],
    inst2: [
      { id: 'course3', name: 'Bachelor of Design in Graphic Design', faculty: 'Creative Technology', duration: 3, tuitionFee: 18000, description: 'Creative design and visual communication.', requirements: 'Portfolio review and LGCSE English' },
      { id: 'course4', name: 'Bachelor of Information Technology', faculty: 'Information Technology', duration: 3, tuitionFee: 16000, description: 'IT systems and software development.', requirements: 'LGCSE with credit in Mathematics' }
    ],
    inst3: [
      { id: 'course5', name: 'Bachelor of Accounting', faculty: 'Business', duration: 4, tuitionFee: 13000, description: 'Professional accounting and finance education.', requirements: 'LGCSE with credit in Mathematics' }
    ],
    inst4: [
      { id: 'course6', name: 'Diploma in Primary Education', faculty: 'Education', duration: 3, tuitionFee: 8000, description: 'Primary school teacher training.', requirements: 'LGCSE with 3 credits including English' }
    ],
    inst5: [
      { id: 'course7', name: 'Diploma in Agriculture', faculty: 'Agriculture', duration: 3, tuitionFee: 7000, description: 'Modern agricultural techniques and farm management.', requirements: 'LGCSE with credit in Science' }
    ]
  };

  useEffect(() => {
    setInstitutions(hardcodedInstitutions);
  }, []);

  const fetchCourses = (institutionId) => {
    const institutionCourses = hardcodedCourses[institutionId] || [];
    setCourses(institutionCourses);
    setSelectedInstitution(institutionId);
  };

  const applyForCourse = async (course) => {
    try {
      // Temporary simulation - remove this when backend is working
      console.log('Applying for course:', course.name);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful application
      setAppliedCourses(prev => new Set([...prev, course.id]));
      
      // Store in localStorage to persist across page refreshes
      const userApplications = JSON.parse(localStorage.getItem('studentApplications') || '{}');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!userApplications[user?.uid]) {
        userApplications[user?.uid] = [];
      }
      
      userApplications[user?.uid].push({
        id: Date.now().toString(),
        courseId: course.id,
        courseName: course.name,
        institutionId: selectedInstitution,
        institutionName: institutions.find(inst => inst.id === selectedInstitution)?.name,
        appliedAt: new Date().toISOString(),
        status: 'pending'
      });
      
      localStorage.setItem('studentApplications', JSON.stringify(userApplications));
      
      alert('Application submitted successfully! (Simulated)');
      
    } catch (error) {
      console.error('Error applying for course:', error);
      alert('Application submitted successfully! (Simulated)');
      
      // Even if there's an error, simulate success for demo
      setAppliedCourses(prev => new Set([...prev, course.id]));
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
              <small style={{ color: '#6b7280' }}>15 institutions with courses available</small>
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
      // Use simulated data from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const userApplications = JSON.parse(localStorage.getItem('studentApplications') || '{}');
      const simulatedApplications = userApplications[user?.uid] || [];
      
      if (simulatedApplications.length > 0) {
        setApplications(simulatedApplications);
        setLoading(false);
        return;
      }
      
      // If no simulated data, try API (but it will likely fail)
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/student/applications/${user?.uid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      
      // Use simulated data as fallback
      const user = JSON.parse(localStorage.getItem('user'));
      const userApplications = JSON.parse(localStorage.getItem('studentApplications') || '{}');
      setApplications(userApplications[user?.uid] || []);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { backgroundColor: '#f59e0b', color: '#000000' },
      admitted: { backgroundColor: '#10b981', color: '#ffffff' },
      rejected: { backgroundColor: '#ef4444', color: '#ffffff' },
      waiting: { backgroundColor: '#3b82f6', color: '#ffffff' }
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
                    <td style={{ padding: '0.75rem', color: '#4b5563' }}>{new Date(application.appliedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem' }}>{getStatusBadge(application.status)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {application.status === 'admitted' && (
                          <button style={buttonStyle}>Accept Offer</button>
                        )}
                        <button style={outlineButtonStyle}>Withdraw</button>
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
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading,setLoading] = useState(false);

  // Hardcoded jobs data
  const hardcodedJobs = [
    {
      id: 'job1',
      title: 'Junior Software Developer',
      companyName: 'Tech Solutions Lesotho',
      location: 'Maseru',
      salary: 'M8,000 - M12,000',
      description: 'Entry-level software development position for recent graduates. Work on web applications and mobile apps.',
      requirements: ['Bachelor in Computer Science', 'Knowledge of JavaScript', 'Basic understanding of databases'],
      deadline: '2024-12-31',
      type: 'Full-time'
    },
    {
      id: 'job2',
      title: 'Marketing Assistant',
      companyName: 'Lesotho Marketing Agency',
      location: 'Maseru',
      salary: 'M6,000 - M8,000',
      description: 'Support marketing team with campaigns, social media, and client communications.',
      requirements: ['Diploma in Marketing', 'Good communication skills', 'Social media knowledge'],
      deadline: '2024-11-30',
      type: 'Full-time'
    }
  ];

  useEffect(() => {
    setJobs(hardcodedJobs);
    setLoading(false);
  }, []);

  const applyForJob = async (jobId) => {
    try {
      // Temporary simulation - remove this when backend is working
      console.log('Applying for job:', jobId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful job application
      setAppliedJobs(prev => new Set([...prev, jobId]));
      
      // Store in localStorage to persist across page refreshes
      const userJobApplications = JSON.parse(localStorage.getItem('studentJobApplications') || '{}');
      const user = JSON.parse(localStorage.getItem('user'));
      const job = jobs.find(j => j.id === jobId);
      
      if (!userJobApplications[user?.uid]) {
        userJobApplications[user?.uid] = [];
      }
      
      userJobApplications[user?.uid].push({
        id: Date.now().toString(),
        jobId: jobId,
        jobTitle: job?.title,
        companyName: job?.companyName,
        appliedAt: new Date().toISOString(),
        status: 'pending'
      });
      
      localStorage.setItem('studentJobApplications', JSON.stringify(userJobApplications));
      
      alert('Job application submitted successfully! (Simulated)');
      
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Job application submitted successfully! (Simulated)');
      
      // Even if there's an error, simulate success for demo
      setAppliedJobs(prev => new Set([...prev, jobId]));
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
                  <small><strong style={{ color: '#000000' }}>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</small>
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
      const user = JSON.parse(localStorage.getItem('user'));
      const formData = new FormData();
      formData.append('transcript', transcript);
      formData.append('studentId', user?.uid);

      await axios.post('http://localhost:5001/api/student/uploadTranscript', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
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
          
          {uploadedFiles.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No documents uploaded yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {uploadedFiles.map((file, index) => (
                <div 
                  key={index}
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
                    <h6 style={{ margin: '0 0 0.25rem 0', color: '#000000' }}>{file.name}</h6>
                    <small style={{ color: '#6b7280' }}>Uploaded: {file.date}</small>
                  </div>
                  <span style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {file.status}
                  </span>
                </div>
              ))}
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
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:5001/api/student/profile/${user?.uid}`, {
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
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.patch(`http://localhost:5001/api/student/profile/${user?.uid}`, profile, {
        headers: { Authorization: `Bearer ${token}` }
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