function Footer() {
  return (
    <footer style={{
      backgroundColor: '#000000',
      borderTop: '4px solid #40e0d0',
      padding: '2rem 0',
      color: '#ffffff'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <h5 style={{
              color: '#40e0d0',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              Career Guidance Platform
            </h5>
            <p style={{
              color: '#d1d5db',
              maxWidth: '400px'
            }}>
              Connecting students with educational and career opportunities in Lesotho.
            </p>
          </div>
          <div style={{
            textAlign: 'center'
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.875rem'
            }}>
              &copy; 2024 Career Guidance Platform. All rights reserved.
            </p>
          </div>
        </div>
        
        {/* Decorative accent */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid #374151'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#40e0d0',
              opacity: '0.8'
            }}></div>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#40e0d0',
              opacity: '0.6'
            }}></div>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#40e0d0',
              opacity: '0.4'
            }}></div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;