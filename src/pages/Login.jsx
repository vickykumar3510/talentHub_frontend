import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      toast.error("Please fill all the required fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("https://talent-hub-backend-gray.vercel.app/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      if (response.data.user) {
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("userId", response.data.user.id);
        if (response.data.user.fullName) {
          localStorage.setItem("fullName", response.data.user.fullName);
        }
      }
      toast.success("Login successful!");
      navigate("/landing", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to login. Please try again."
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
          <h1>Welcome back!</h1>
          <p className="muted">Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit}>
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

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}

          <p>
            Don't have an account? <Link to="/signup">Signup</Link>
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

export default Login;
