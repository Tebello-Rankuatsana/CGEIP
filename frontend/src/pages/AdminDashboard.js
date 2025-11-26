import { useState, useEffect } from 'react';
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

// Admin Layout Component
function AdminLayout({ children }) {
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
  backgroundColor: 'transparent', // Changed from 'background: none'
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
            <h5 style={{ color: '#40e0d0', margin: '0 0 0.25rem 0' }}>Admin Dashboard</h5>
            <small style={{ color: '#9ca3af' }}>System Administrator</small>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { 
                path: '/admin', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />
                  </svg>
                ), 
                label: 'Dashboard' 
              },
              { 
                path: '/admin/institutions', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18C5,17.18 8,16 12,16C16,16 19,17.18 19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                ), 
                label: 'Manage Institutions' 
              },
              { 
                path: '/admin/students', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                ), 
                label: 'Manage Students' 
              },
              { 
                path: '/admin/companies', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
                  </svg>
                ), 
                label: 'Manage Companies' 
              },
              { 
                path: '/admin/applications', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                ), 
                label: 'All Applications' 
              },
              { 
                path: '/admin/courses', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18C5,17.18 8,16 12,16C16,16 19,17.18 19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                ), 
                label: 'All Courses' 
              },
              { 
                path: '/admin/reports', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M7,20H9V14H7V20M11,20H13V12H11V20M15,20H17V16H15V20Z" />
                  </svg>
                ), 
                label: 'Reports & Analytics' 
              }
            ].map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/admin' && location.pathname.includes(item.path.replace('/admin/', '')));
              
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

// Admin Dashboard Home
function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0,
    pendingCompanies: 0,
    activeCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get institutions count
      const institutionsSnapshot = await getDocs(collection(db, 'institutions'));
      
      // Get students count
      const studentsSnapshot = await getDocs(collection(db, 'students'));
      
      // Get companies count
      const companiesSnapshot = await getDocs(collection(db, 'companies'));
      
      // Get applications count
      const applicationsSnapshot = await getDocs(collection(db, 'applications'));
      
      // Get courses count
      const coursesSnapshot = await getDocs(collection(db, 'courses'));

      // Count pending companies
      const pendingCompaniesQuery = query(collection(db, 'companies'), where('status', '==', 'pending'));
      const pendingCompaniesSnapshot = await getDocs(pendingCompaniesQuery);

      setStats({
        totalInstitutions: institutionsSnapshot.size,
        totalStudents: studentsSnapshot.size,
        totalCompanies: companiesSnapshot.size,
        totalApplications: applicationsSnapshot.size,
        pendingCompanies: pendingCompaniesSnapshot.size,
        activeCourses: coursesSnapshot.size
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
    { label: 'Total Institutions', value: stats.totalInstitutions, color: '#40e0d0' },
    { label: 'Total Students', value: stats.totalStudents, color: '#10b981' },
    { label: 'Total Companies', value: stats.totalCompanies, color: '#3b82f6' },
    { label: 'Total Applications', value: stats.totalApplications, color: '#f59e0b' },
    { label: 'Pending Companies', value: stats.pendingCompanies, color: '#ef4444' },
    { label: 'Active Courses', value: stats.activeCourses, color: '#8b5cf6' }
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Admin Dashboard</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>System overview and management</p>
      
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
            { path: '/admin/institutions', label: 'Manage Institutions', color: '#40e0d0' },
            { path: '/admin/students', label: 'Manage Students', color: '#10b981' },
            { path: '/admin/companies', label: 'Approve Companies', color: '#3b82f6' },
            { path: '/admin/courses', label: 'View All Courses', color: '#f59e0b' },
            { path: '/admin/reports', label: 'View Reports', outline: true }
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

// Manage Institutions Component
function ManageInstitutions() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    location: '',
    contactPerson: '',
    phone: '',
    status: 'active'
  });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const institutionsRef = collection(db, 'institutions');
      const snapshot = await getDocs(institutionsRef);
      const institutionsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setInstitutions(institutionsData);
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
      // In a real app, you would create both Auth user and Firestore document
      // For demo, we'll just add to Firestore
      const institutionData = {
        ...formData,
        createdAt: new Date(),
        role: 'institution'
      };

      await addDoc(collection(db, 'institutions'), institutionData);
      
      alert('Institution added successfully!');
      setShowAddForm(false);
      setFormData({ name: '', email: '', type: '', location: '', contactPerson: '', phone: '', status: 'active' });
      fetchInstitutions();
    } catch (error) {
      alert('Error adding institution');
      console.error('Error:', error);
    }
  };

  const handleStatusChange = async (institutionId, newStatus) => {
    try {
      await updateDoc(doc(db, 'institutions', institutionId), {
        status: newStatus,
        updatedAt: new Date()
      });
      alert(`Institution ${newStatus} successfully!`);
      fetchInstitutions();
    } catch (error) {
      alert('Error updating institution status');
      console.error('Error:', error);
    }
  };

  const handleDeleteInstitution = async (id) => {
    if (window.confirm('Are you sure you want to delete this institution? This will remove all associated data.')) {
      try {
        // Check if institution has courses
        const coursesQuery = query(collection(db, 'courses'), where('institutionId', '==', id));
        const coursesSnapshot = await getDocs(coursesQuery);
        
        if (!coursesSnapshot.empty) {
          alert('Cannot delete institution. There are courses associated with this institution.');
          return;
        }

        await deleteDoc(doc(db, 'institutions', id));
        alert('Institution deleted successfully!');
        fetchInstitutions();
      } catch (error) {
        alert('Error deleting institution');
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
    cursor: 'pointer'
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
          <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Manage Institutions</h2>
          <p style={{ color: '#6b7280' }}>Add, edit, or remove higher learning institutions</p>
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
          Add Institution
        </button>
      </div>

      {showAddForm && (
        <div style={{ ...cardStyle, marginBottom: '2rem' }}>
          <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Add New Institution</h5>
          <form onSubmit={handleAddInstitution}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Institution Name</label>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Type</label>
                <select
                  style={inputStyle}
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
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
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
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
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={buttonStyle}>Add Institution</button>
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
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Institution Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Type</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Location</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map(institution => (
                <tr key={institution.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{institution.name}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{institution.email}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{institution.type}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{institution.location}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      backgroundColor: institution.status === 'active' ? '#10b981' : '#ef4444',
                      color: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {institution.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        style={statusButtonStyle(institution.status === 'active' ? 'suspended' : 'active')}
                        onClick={() => handleStatusChange(institution.id, institution.status === 'active' ? 'suspended' : 'active')}
                      >
                        {institution.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button 
                        style={deleteButtonStyle}
                        onClick={() => handleDeleteInstitution(institution.id)}
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

// Manage Students Component
function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, [filter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const studentsRef = collection(db, 'students');
      let studentsQuery;

      if (filter === 'with-transcript') {
        studentsQuery = query(studentsRef, where('transcriptUrl', '!=', ''));
      } else if (filter === 'without-transcript') {
        studentsQuery = query(studentsRef, where('transcriptUrl', '==', ''));
      } else {
        studentsQuery = studentsRef;
      }

      const snapshot = await getDocs(studentsQuery);
      const studentsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setStudents(studentsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      await updateDoc(doc(db, 'students', studentId), {
        status: newStatus,
        updatedAt: new Date()
      });
      alert(`Student ${newStatus} successfully!`);
      fetchStudents();
    } catch (error) {
      alert('Error updating student status');
      console.error('Error:', error);
    }
  };

  const getApplicationStats = async (studentId) => {
    try {
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('studentId', '==', studentId)
      );
      const snapshot = await getDocs(applicationsQuery);
      const applications = snapshot.docs.map(doc => doc.data());
      
      return {
        total: applications.length,
        admitted: applications.filter(app => app.status === 'admitted' || app.status === 'confirmed').length,
        pending: applications.filter(app => app.status === 'pending').length
      };
    } catch (error) {
      return { total: 0, admitted: 0, pending: 0 };
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #40e0d0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
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
          <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Manage Students</h2>
          <p style={{ color: '#6b7280' }}>View and manage student accounts</p>
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
            <option value="all">All Students</option>
            <option value="with-transcript">With Transcript</option>
            <option value="without-transcript">Without Transcript</option>
          </select>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Student Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>High School</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Graduation Year</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Transcript</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{student.name}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{student.email}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{student.highSchool || 'Not specified'}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{student.graduationYear || 'Not specified'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      backgroundColor: student.transcriptUrl ? '#10b981' : '#6b7280',
                      color: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {student.transcriptUrl ? 'Uploaded' : 'Not Uploaded'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      backgroundColor: student.status === 'active' ? '#10b981' : '#ef4444',
                      color: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {student.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      style={statusButtonStyle(student.status === 'active' ? 'suspended' : 'active')}
                      onClick={() => handleStatusChange(student.id, student.status === 'active' ? 'suspended' : 'active')}
                    >
                      {student.status === 'active' ? 'Suspend' : 'Activate'}
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

// Manage Companies Component
function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCompanies();
  }, [filter]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const companiesRef = collection(db, 'companies');
      let companiesQuery;

      if (filter !== 'all') {
        companiesQuery = query(companiesRef, where('status', '==', filter));
      } else {
        companiesQuery = companiesRef;
      }

      const snapshot = await getDocs(companiesQuery);
      const companiesData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setCompanies(companiesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (companyId, newStatus) => {
    try {
      await updateDoc(doc(db, 'companies', companyId), {
        status: newStatus,
        updatedAt: new Date()
      });
      alert(`Company ${newStatus} successfully!`);
      fetchCompanies();
    } catch (error) {
      alert('Error updating company status');
      console.error('Error:', error);
    }
  };

  const handleDeleteCompany = async (id) => {
    if (window.confirm('Are you sure you want to delete this company? This will remove all associated data.')) {
      try {
        // Check if company has job postings
        const jobsQuery = query(collection(db, 'jobs'), where('companyId', '==', id));
        const jobsSnapshot = await getDocs(jobsQuery);
        
        if (!jobsSnapshot.empty) {
          alert('Cannot delete company. There are job postings associated with this company.');
          return;
        }

        await deleteDoc(doc(db, 'companies', id));
        alert('Company deleted successfully!');
        fetchCompanies();
      } catch (error) {
        alert('Error deleting company');
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

  const approveButtonStyle = {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginRight: '0.5rem'
  };

  const rejectButtonStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginRight: '0.5rem'
  };

  const deleteButtonStyle = {
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Manage Companies</h2>
          <p style={{ color: '#6b7280' }}>Approve, suspend, or remove company accounts</p>
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
            <option value="all">All Companies</option>
            <option value="pending">Pending Approval</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Company Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Industry</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Location</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Contact Person</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                <tr key={company.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{company.name}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{company.email}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{company.industry}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{company.location}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{company.contactPerson}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      backgroundColor: 
                        company.status === 'active' ? '#10b981' : 
                        company.status === 'pending' ? '#f59e0b' : '#ef4444',
                      color: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {company.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {company.status === 'pending' && (
                        <>
                          <button 
                            style={approveButtonStyle}
                            onClick={() => handleStatusChange(company.id, 'active')}
                          >
                            Approve
                          </button>
                          <button 
                            style={rejectButtonStyle}
                            onClick={() => handleStatusChange(company.id, 'suspended')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {company.status === 'active' && (
                        <button 
                          style={rejectButtonStyle}
                          onClick={() => handleStatusChange(company.id, 'suspended')}
                        >
                          Suspend
                        </button>
                      )}
                      {company.status === 'suspended' && (
                        <button 
                          style={approveButtonStyle}
                          onClick={() => handleStatusChange(company.id, 'active')}
                        >
                          Activate
                        </button>
                      )}
                      <button 
                        style={deleteButtonStyle}
                        onClick={() => handleDeleteCompany(company.id)}
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

// All Applications Component
function AllApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const applicationsRef = collection(db, 'applications');
      let applicationsQuery;

      if (filter !== 'all') {
        applicationsQuery = query(applicationsRef, where('status', '==', filter));
      } else {
        applicationsQuery = query(applicationsRef, orderBy('appliedAt', 'desc'));
      }

      const snapshot = await getDocs(applicationsQuery);
      const applicationsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        appliedAt: doc.data().appliedAt?.toDate(),
        admittedAt: doc.data().admittedAt?.toDate()
      }));
      setApplications(applicationsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
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
          <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>All Applications</h2>
          <p style={{ color: '#6b7280' }}>Monitor all course applications across institutions</p>
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
            <option value="admitted">Admitted</option>
            <option value="confirmed">Confirmed</option>
            <option value="waiting">Waiting List</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Student</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Course</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Institution</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Application Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(application => (
                <tr key={application.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{application.studentName}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{application.studentEmail}</div>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{application.courseName}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{application.institutionName}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{application.appliedAt?.toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem' }}>{getStatusBadge(application.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// All Courses Component
function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const coursesRef = collection(db, 'courses');
      const snapshot = await getDocs(coursesRef);
      const coursesData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setCourses(coursesData);

      // Get institution names
      const institutionIds = [...new Set(coursesData.map(course => course.institutionId))];
      const institutionPromises = institutionIds.map(id => getDoc(doc(db, 'institutions', id)));
      const institutionSnapshots = await Promise.all(institutionPromises);
      
      const institutionsMap = {};
      institutionSnapshots.forEach((snap, index) => {
        if (snap.exists()) {
          institutionsMap[institutionIds[index]] = snap.data().name;
        }
      });
      
      setInstitutions(institutionsMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #40e0d0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>All Courses</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>View all courses offered across institutions</p>

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Course Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Faculty</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Institution</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Duration</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Tuition Fee</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{course.name}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{course.faculty}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{institutions[course.institutionId] || 'Unknown'}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{course.duration} years</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>M{course.tuitionFee}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{course.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reports & Analytics Component
function ReportsAnalytics() {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Get total counts
      const institutionsSnapshot = await getDocs(collection(db, 'institutions'));
      const studentsSnapshot = await getDocs(collection(db, 'students'));
      const companiesSnapshot = await getDocs(collection(db, 'companies'));
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const applicationsSnapshot = await getDocs(collection(db, 'applications'));
      const jobsSnapshot = await getDocs(collection(db, 'jobs'));

      // Get application status breakdown
      const applications = applicationsSnapshot.docs.map(doc => doc.data());
      const applicationStatus = {
        pending: applications.filter(app => app.status === 'pending').length,
        admitted: applications.filter(app => app.status === 'admitted').length,
        confirmed: applications.filter(app => app.status === 'confirmed').length,
        waiting: applications.filter(app => app.status === 'waiting').length,
        rejected: applications.filter(app => app.status === 'rejected').length
      };

      // Get students with transcripts
      const studentsWithTranscriptsQuery = query(
        collection(db, 'students'),
        where('transcriptUrl', '!=', '')
      );
      const studentsWithTranscriptsSnapshot = await getDocs(studentsWithTranscriptsQuery);

      setReports({
        totalInstitutions: institutionsSnapshot.size,
        totalStudents: studentsSnapshot.size,
        totalCompanies: companiesSnapshot.size,
        totalCourses: coursesSnapshot.size,
        totalApplications: applicationsSnapshot.size,
        totalJobs: jobsSnapshot.size,
        studentsWithTranscripts: studentsWithTranscriptsSnapshot.size,
        applicationStatus
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #40e0d0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const statCardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    textAlign: 'center'
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Reports & Analytics</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>System-wide statistics and analytics</p>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={statCardStyle}>
          <h3 style={{ color: '#40e0d0', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{reports.totalInstitutions}</h3>
          <p style={{ color: '#6b7280', margin: 0 }}>Institutions</p>
        </div>
        <div style={statCardStyle}>
          <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{reports.totalStudents}</h3>
          <p style={{ color: '#6b7280', margin: 0 }}>Students</p>
        </div>
        <div style={statCardStyle}>
          <h3 style={{ color: '#3b82f6', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{reports.totalCompanies}</h3>
          <p style={{ color: '#6b7280', margin: 0 }}>Companies</p>
        </div>
        <div style={statCardStyle}>
          <h3 style={{ color: '#f59e0b', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{reports.totalCourses}</h3>
          <p style={{ color: '#6b7280', margin: 0 }}>Courses</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Application Statistics */}
        <div style={cardStyle}>
          <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Application Statistics</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4b5563' }}>Total Applications</span>
              <strong style={{ color: '#000000' }}>{reports.totalApplications}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4b5563' }}>Pending</span>
              <strong style={{ color: '#f59e0b' }}>{reports.applicationStatus.pending}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4b5563' }}>Admitted</span>
              <strong style={{ color: '#10b981' }}>{reports.applicationStatus.admitted}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4b5563' }}>Confirmed</span>
              <strong style={{ color: '#059669' }}>{reports.applicationStatus.confirmed}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4b5563' }}>Waitlisted</span>
              <strong style={{ color: '#3b82f6' }}>{reports.applicationStatus.waiting}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4b5563' }}>Rejected</span>
              <strong style={{ color: '#ef4444' }}>{reports.applicationStatus.rejected}</strong>
            </div>
          </div>
        </div>

        {/* Student Statistics */}
        <div style={cardStyle}>
          <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Student Statistics</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4b5563' }}>Total Students</span>
              <strong style={{ color: '#000000' }}>{reports.totalStudents}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4b5563' }}>With Transcripts</span>
              <strong style={{ color: '#10b981' }}>{reports.studentsWithTranscripts}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4b5563' }}>Without Transcripts</span>
              <strong style={{ color: '#ef4444' }}>{reports.totalStudents - reports.studentsWithTranscripts}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4b5563' }}>Transcript Upload Rate</span>
              <strong style={{ color: '#3b82f6' }}>
                {reports.totalStudents > 0 ? 
                  ((reports.studentsWithTranscripts / reports.totalStudents) * 100).toFixed(1) + '%' : '0%'
                }
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Job Statistics */}
      <div style={{ ...cardStyle, marginTop: '1.5rem' }}>
        <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Job & Career Statistics</h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={statCardStyle}>
            <h3 style={{ color: '#8b5cf6', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{reports.totalJobs}</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>Active Job Postings</p>
          </div>
          <div style={statCardStyle}>
            <h3 style={{ color: '#06b6d4', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
              {reports.totalCompanies}
            </h3>
            <p style={{ color: '#6b7280', margin: 0 }}>Partner Companies</p>
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
        <Route path="/students" element={<ManageStudents />} />
        <Route path="/companies" element={<ManageCompanies />} />
        <Route path="/applications" element={<AllApplications />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/reports" element={<ReportsAnalytics />} />
      </Routes>
    </AdminLayout>
  );
}

export default AdminDashboard;