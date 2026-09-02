import { useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const selectedRole = role === "Recruiter" || role === "Applicant" ? role : null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!selectedRole) {
    return <Navigate to="/signup" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill all the required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post("https://talent-hub-backend-gray.vercel.app/signup", {
        fullName,
        email,
        password,
        role: selectedRole,
      });

      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to signup. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="auth-card">
          <div className="sidebar-brand" style={{ padding: 0 }}>
            <span className="brand-mark">TH</span>
            TalentHub
          </div>
          <h1>Signup as {selectedRole}</h1>
          <p>
            <Link to="/signup">Change role</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="btn-outline" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <label>Confirm Password</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button" className="btn-outline" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}

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
  );
};

export default Signup;
