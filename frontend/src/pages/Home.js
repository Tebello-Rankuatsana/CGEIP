import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold">Career Guidance & Employment Platform</h1>
              <p className="lead">
                Discover higher learning institutions in Lesotho, apply for courses, 
                and kickstart your career with employment opportunities.
              </p>
              <div className="mt-4">
                <Link to="/register" className="btn btn-light btn-lg me-3">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Login
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <i className="bi bi-mortarboard-fill display-1"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <i className="bi bi-building display-6 text-primary"></i>
                  <h5 className="card-title mt-3">Institutions</h5>
                  <p className="card-text">Discover higher learning institutions in Lesotho and their courses.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <i className="bi bi-file-earmark-text display-6 text-primary"></i>
                  <h5 className="card-title mt-3">Applications</h5>
                  <p className="card-text">Apply for courses online with easy application process.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <i className="bi bi-briefcase display-6 text-primary"></i>
                  <h5 className="card-title mt-3">Career Opportunities</h5>
                  <p className="card-text">Connect with partner companies for employment opportunities.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <i className="bi bi-graph-up display-6 text-primary"></i>
                  <h5 className="card-title mt-3">Career Guidance</h5>
                  <p className="card-text">Get guidance based on your qualifications and interests.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Who Can Use This Platform?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-person display-4 text-primary"></i>
                  <h4 className="card-title mt-3">Students</h4>
                  <p className="card-text">Apply to institutions and find job opportunities after graduation.</p>
                  <Link to="/register?role=student" className="btn btn-primary">Register as Student</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-building display-4 text-primary"></i>
                  <h4 className="card-title mt-3">Institutions</h4>
                  <p className="card-text">Manage courses and admissions for your institution.</p>
                  <Link to="/register?role=institute" className="btn btn-primary">Register as Institution</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-briefcase display-4 text-primary"></i>
                  <h4 className="card-title mt-3">Companies</h4>
                  <p className="card-text">Find qualified graduates and post job opportunities.</p>
                  <Link to="/register?role=company" className="btn btn-primary">Register as Company</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;