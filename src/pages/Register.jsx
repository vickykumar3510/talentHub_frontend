import { Link, useNavigate } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate()

  return (
    <main className="page">
      <h1>Register</h1>
      <p>Choose how you want to sign up.</p>

      <div className="register-choice">
        <button type="button" onClick={() => navigate("/signup/Applicant")}>
          Register as Applicant
        </button>
        <button type="button" onClick={() => navigate("/signup/Recruiter")}>
          Register as Recruiter
        </button>
      </div>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  )
}

export default Register
