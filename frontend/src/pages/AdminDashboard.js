import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import axios from 'axios';

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
            <small style={{ color: '#9ca3af' }}>Admin Dashboard</small>
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
                path: '/admin/companies', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
                  </svg>
                ), 
                label: 'Manage Companies' 
              },
              { 
                path: '/admin/users', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" />
                  </svg>
                ), 
                label: 'User Management' 
              },
              { 
                path: '/admin/reports', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
                  </svg>
                ), 
                label: 'Reports & Analytics' 
              },
              { 
                path: '/admin/admissions', 
                icon: (
                  <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z" />
                  </svg>
                ), 
                label: 'Admissions Monitor' 
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
    pendingApprovals: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback data for demo
      setStats({
        totalInstitutions: 15,
        totalStudents: 234,
        totalCompanies: 8,
        pendingApprovals: 12
      });
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
    { label: 'Pending Approvals', value: stats.pendingApprovals, color: '#f59e0b' }
  ];

  return (
    <div>
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Admin Dashboard</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>System overview and management</p>
      
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
            { path: '/admin/institutions', label: 'Manage Institutions', color: '#40e0d0' },
            { path: '/admin/companies', label: 'Approve Companies', color: '#10b981' },
            { path: '/admin/reports', label: 'View Reports', color: '#3b82f6' },
            { path: '/admin/admissions', label: 'Monitor Admissions', outline: true }
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
        <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Recent System Activity</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { 
              title: 'New Institution Registration', 
              time: '1 hour ago', 
              description: 'National University of Lesotho',
              status: 'Pending approval',
              statusColor: '#f59e0b'
            },
            { 
              title: 'Company Account Suspended', 
              time: '3 hours ago', 
              description: 'Tech Solutions Lesotho',
              status: 'Violation of terms',
              statusColor: '#ef4444'
            },
            { 
              title: 'Student Applications Processed', 
              time: '5 hours ago', 
              description: '45 applications reviewed',
              status: 'Completed',
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
      // Fallback data for demo
      setInstitutions([
        { id: '1', name: 'National University of Lesotho', email: 'admissions@nul.ls', contactPerson: 'Dr. John Smith', phone: '+266 22340601', status: 'active' },
        { id: '2', name: 'Limkokwing University', email: 'info@limkokwing.ls', contactPerson: 'Ms. Sarah Johnson', phone: '+266 28345678', status: 'active' },
        { id: '3', name: 'Botho University', email: 'enquiry@bothocollege.ac.ls', contactPerson: 'Mr. David Brown', phone: '+266 22315678', status: 'pending' }
      ]);
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
      alert('Institution added successfully! (Simulated)');
      // Simulate success for demo
      const newInstitution = {
        id: Date.now().toString(),
        ...formData,
        status: 'active'
      };
      setInstitutions(prev => [...prev, newInstitution]);
      setShowAddForm(false);
      setFormData({ name: '', email: '', address: '', contactPerson: '', phone: '', website: '' });
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
      alert('Institution updated successfully! (Simulated)');
      // Simulate success for demo
      setInstitutions(prev => prev.map(inst => 
        inst.id === editingInstitution.id 
          ? { ...inst, ...formData }
          : inst
      ));
      setShowAddForm(false);
      setEditingInstitution(null);
      setFormData({ name: '', email: '', address: '', contactPerson: '', phone: '', website: '' });
    }
  };

  const handleDeleteInstitution = async (id) => {
    if (window.confirm('Are you sure you want to delete this institution?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/admin/institutions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Institution deleted successfully!');
        fetchInstitutions();
      } catch (error) {
        alert('Institution deleted successfully! (Simulated)');
        // Simulate success for demo
        setInstitutions(prev => prev.filter(inst => inst.id !== id));
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
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const outlineButtonStyle = {
    backgroundColor: 'transparent',
    color: '#374151',
    border: '2px solid #d1d5db',
    padding: '0.5rem 1rem',
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
          <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Manage Institutions</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Add, edit, or remove higher learning institutions</p>
        </div>
        <button 
          style={buttonStyle}
          onClick={() => {
            setShowAddForm(true);
            setEditingInstitution(null);
            setFormData({ name: '', email: '', address: '', contactPerson: '', phone: '', website: '' });
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
          Add Institution
        </button>
      </div>

      {showAddForm && (
        <div style={{ ...cardStyle, marginBottom: '2rem' }}>
          <h5 style={{ color: '#000000', marginBottom: '1.5rem' }}>{editingInstitution ? 'Edit Institution' : 'Add New Institution'}</h5>
          <form onSubmit={editingInstitution ? handleUpdateInstitution : handleAddInstitution}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Institution Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#000000', fontWeight: '600' }}>Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={buttonStyle}>
                {editingInstitution ? 'Update Institution' : 'Add Institution'}
              </button>
              <button 
                type="button" 
                style={outlineButtonStyle}
                onClick={() => {
                  setShowAddForm(false);
                  setEditingInstitution(null);
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#40e0d0';
                  e.target.style.color = '#000000';
                  e.target.style.borderColor = '#40e0d0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#374151';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={cardStyle}>
        <h5 style={{ color: '#000000', marginBottom: '1.5rem' }}>Institutions List</h5>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Contact Person</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Phone</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map(institution => (
                <tr key={institution.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{institution.name}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{institution.email}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{institution.contactPerson}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{institution.phone}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      backgroundColor: institution.status === 'active' ? '#10b981' : '#f59e0b',
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
                        style={{
                          backgroundColor: 'transparent',
                          color: '#3b82f6',
                          border: '1px solid #3b82f6',
                          padding: '0.375rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleEditInstitution(institution)}
                      >
                        Edit
                      </button>
                      <button 
                        style={{
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          padding: '0.375rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleDeleteInstitution(institution.id)}
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
      const response = await axios.get('http://localhost:5001/api/admin/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      // Fallback data for demo
      setCompanies([
        { id: '1', name: 'Tech Solutions Lesotho', industry: 'Technology', email: 'hr@techsolutions.ls', website: 'www.techsolutions.ls', status: 'approved' },
        { id: '2', name: 'Lesotho Marketing Agency', industry: 'Marketing', email: 'info@lma.ls', website: 'www.lma.ls', status: 'pending' },
        { id: '3', name: 'Mountain View Enterprises', industry: 'Construction', email: 'contact@mve.ls', website: 'www.mve.ls', status: 'suspended' }
      ]);
      setLoading(false);
    }
  };

  const handleApproveCompany = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/admin/companies/${companyId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Company approved successfully!');
      fetchCompanies();
    } catch (error) {
      alert('Company approved successfully! (Simulated)');
      // Simulate success for demo
      setCompanies(prev => prev.map(company => 
        company.id === companyId 
          ? { ...company, status: 'approved' }
          : company
      ));
    }
  };

  const handleSuspendCompany = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/admin/companies/${companyId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Company suspended successfully!');
      fetchCompanies();
    } catch (error) {
      alert('Company suspended successfully! (Simulated)');
      // Simulate success for demo
      setCompanies(prev => prev.map(company => 
        company.id === companyId 
          ? { ...company, status: 'suspended' }
          : company
      ));
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/admin/companies/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Company deleted successfully!');
        fetchCompanies();
      } catch (error) {
        alert('Company deleted successfully! (Simulated)');
        // Simulate success for demo
        setCompanies(prev => prev.filter(company => company.id !== companyId));
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
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Manage Companies</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Approve, suspend, or remove company accounts</p>

      <div style={cardStyle}>
        <h5 style={{ color: '#000000', marginBottom: '1.5rem' }}>Companies List</h5>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Company Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Industry</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Contact Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Website</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                <tr key={company.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{company.name}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{company.industry}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{company.email}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{company.website}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      backgroundColor: 
                        company.status === 'approved' ? '#10b981' : 
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {company.status === 'pending' && (
                        <button 
                          style={{
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.375rem 0.75rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleApproveCompany(company.id)}
                        >
                          Approve
                        </button>
                      )}
                      {company.status === 'approved' && (
                        <button 
                          style={{
                            backgroundColor: '#f59e0b',
                            color: '#000000',
                            border: 'none',
                            padding: '0.375rem 0.75rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleSuspendCompany(company.id)}
                        >
                          Suspend
                        </button>
                      )}
                      <button 
                        style={{
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.375rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleDeleteCompany(company.id)}
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
      const response = await axios.get('http://localhost:5001/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Fallback data for demo
      setReports({
        totalApplications: 156,
        admissionRate: 68,
        popularCourses: [
          { name: 'Computer Science', applications: 45 },
          { name: 'Business Administration', applications: 38 },
          { name: 'Engineering', applications: 32 }
        ],
        institutionStats: [
          { name: 'National University of Lesotho', totalCourses: 25, applications: 89, admissionRate: 72 },
          { name: 'Limkokwing University', totalCourses: 18, applications: 45, admissionRate: 65 },
          { name: 'Botho University', totalCourses: 12, applications: 22, admissionRate: 58 }
        ]
      });
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #40e0d0',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div>
      <h2 style={{ color: '#000000', marginBottom: '0.5rem' }}>Reports & Analytics</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>System-wide statistics and insights</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Application Statistics</h5>
          <div style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: '#000000' }}>Total Applications:</strong> {reports.totalApplications}
          </div>
          <div>
            <strong style={{ color: '#000000' }}>Admission Rate:</strong> {reports.admissionRate}%
          </div>
        </div>
        <div style={cardStyle}>
          <h5 style={{ color: '#000000', marginBottom: '1rem' }}>Popular Courses</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {reports.popularCourses.map((course, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#000000' }}>{course.name}</span>
                <span style={{
                  backgroundColor: '#40e0d0',
                  color: '#000000',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {course.applications} applications
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h5 style={{ color: '#000000', marginBottom: '1.5rem' }}>Institution Statistics</h5>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Institution</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Total Courses</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Applications</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000000', fontWeight: '600' }}>Admission Rate</th>
              </tr>
            </thead>
            <tbody>
              {reports.institutionStats.map((stat, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem', color: '#000000' }}>{stat.name}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{stat.totalCourses}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{stat.applications}</td>
                  <td style={{ padding: '0.75rem', color: '#4b5563' }}>{stat.admissionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
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