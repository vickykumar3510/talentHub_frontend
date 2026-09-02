import { Link, useNavigate } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate()

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="auth-card">
          <div className="sidebar-brand" style={{ padding: 0 }}>
            <span className="brand-mark">TH</span>
            TalentHub
          </div>
          <h1>Register</h1>
          <p className="muted">Choose how you want to sign up.</p>

          <div className="register-choice">
            <button type="button" onClick={() => navigate("/signup/Applicant")}>
              Register as Applicant
            </button>
            <button type="button" className="btn-outline" onClick={() => navigate("/signup/Recruiter")}>
              Register as Recruiter
            </button>
          </div>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
      <section className="auth-art" aria-hidden="true">
        <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="70" y="70" width="280" height="180" rx="18" fill="#fff" />
          <rect x="92" y="98" width="150" height="14" rx="7" fill="#dbeafe" />
          <rect x="92" y="126" width="236" height="10" rx="5" fill="#e5e7eb" />
          <rect x="92" y="146" width="200" height="10" rx="5" fill="#e5e7eb" />
          <rect x="92" y="186" width="110" height="32" rx="8" fill="#2563EB" />
          <circle cx="310" cy="210" r="46" fill="#93c5fd" />
          <circle cx="310" cy="196" r="16" fill="#1d4ed8" />
          <rect x="286" y="216" width="48" height="36" rx="16" fill="#1d4ed8" />
        </svg>
      </section>
    </main>
  )
}

export default Register
