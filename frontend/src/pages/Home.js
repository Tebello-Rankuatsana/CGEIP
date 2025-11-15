import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '3rem 0',
        borderBottom: '4px solid #40e0d0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center', maxWidth: '600px' }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#40e0d0'
              }}>
                K&T Pathways Career Guidance & Employment Platform
              </h1>
              <p style={{
                fontSize: '1.25rem',
                marginBottom: '2rem',
                color: '#d1d5db',
                lineHeight: '1.6'
              }}>
                Reach your full potential with K&T Pathways.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link 
                  to="/register" 
                  style={{
                    backgroundColor: '#40e0d0',
                    color: '#000000',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1.125rem',
                    border: '2px solid #40e0d0',
                    transition: 'all 0.3s ease'
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
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  style={{
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1.125rem',
                    border: '2px solid #40e0d0',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#40e0d0';
                    e.target.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#ffffff';
                  }}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '3rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            {[
              { 
                icon: (
                  <svg style={{ width: '3rem', height: '3rem', fill: '#40e0d0' }} viewBox="0 0 24 24">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18C5,17.18 8,16 12,16C16,16 19,17.18 19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                ), 
                title: 'Institutions', 
                text: 'Discover higher learning institutions in Lesotho and their courses.' 
              },
              { 
                icon: (
                  <svg style={{ width: '3rem', height: '3rem', fill: '#40e0d0' }} viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                ), 
                title: 'Applications', 
                text: 'Apply for courses online with easy application process.' 
              },
              { 
                icon: (
                  <svg style={{ width: '3rem', height: '3rem', fill: '#40e0d0' }} viewBox="0 0 24 24">
                    <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
                  </svg>
                ), 
                title: 'Career Opportunities', 
                text: 'Connect with partner companies for employment opportunities.' 
              },
              { 
                icon: (
                  <svg style={{ width: '3rem', height: '3rem', fill: '#40e0d0' }} viewBox="0 0 24 24">
                    <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
                  </svg>
                ), 
                title: 'Career Guidance', 
                text: 'Get guidance based on your qualifications and interests.' 
              }
            ].map((feature, index) => (
              <div key={index} style={{
                backgroundColor: '#ffffff',
                border: '2px solid #40e0d0',
                borderRadius: '0.5rem',
                padding: '2rem 1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease',
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
                <div style={{ marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{
                  color: '#000000',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>{feature.title}</h3>
                <p style={{
                  color: '#4b5563',
                  lineHeight: '1.5'
                }}>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section style={{
        backgroundColor: '#f3f4f6',
        padding: '3rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '3rem',
            color: '#000000'
          }}>
            Who Can Use This Platform?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { 
                icon: (
                  <svg style={{ width: '3rem', height: '3rem', fill: '#40e0d0' }} viewBox="0 0 24 24">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                ), 
                title: 'Students', 
                text: 'Apply to institutions and find job opportunities after graduation.', 
                link: '/register?role=student' 
              },
              { 
                icon: (
                  <svg style={{ width: '3rem', height: '3rem', fill: '#40e0d0' }} viewBox="0 0 24 24">
                    <path d="M18,15A4,4 0 0,1 22,19A4,4 0 0,1 18,23A4,4 0 0,1 14,19A4,4 0 0,1 18,15M18,17A2,2 0 0,0 16,19A2,2 0 0,0 18,21A2,2 0 0,0 20,19A2,2 0 0,0 18,17M6.05,14.54C6.05,14.54 7.46,13.12 7.47,10.3C7.11,8.11 7.97,5.54 9.94,3.58C12.87,0.65 17.14,0.17 19.5,2.5C21.83,4.86 21.35,9.13 18.42,12.06C16.46,14.03 13.89,14.89 11.7,14.53C8.88,14.54 7.46,15.95 7.46,15.95L3.22,20.19L1.81,18.78L6.05,14.54M18.07,3.93C16.5,2.37 13.5,2.84 11.35,5C9.21,7.14 8.73,10.15 10.29,11.71C11.86,13.27 14.86,12.79 17,10.65C19.16,8.5 19.63,5.5 18.07,3.93Z" />
                  </svg>
                ), 
                title: 'Institutions', 
                text: 'Manage courses and admissions for your institution.', 
                link: '/register?role=institute' 
              },
              { 
                icon: (
                  <svg style={{ width: '3rem', height: '3rem', fill: '#40e0d0' }} viewBox="0 0 24 24">
                    <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
                  </svg>
                ), 
                title: 'Companies', 
                text: 'Find qualified graduates and post job opportunities.', 
                link: '/register?role=company' 
              }
            ].map((userType, index) => (
              <div key={index} style={{
                backgroundColor: '#ffffff',
                border: '2px solid #40e0d0',
                borderRadius: '0.5rem',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
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
                <div style={{ marginBottom: '1rem' }}>{userType.icon}</div>
                <h3 style={{
                  color: '#000000',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>{userType.title}</h3>
                <p style={{
                  color: '#4b5563',
                  marginBottom: '1.5rem',
                  lineHeight: '1.5'
                }}>{userType.text}</p>
                <Link 
                  to={userType.link}
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
                  Register as {userType.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;