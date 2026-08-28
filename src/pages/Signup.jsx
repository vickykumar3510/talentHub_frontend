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
    <main className="page">
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
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
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
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  );
};

export default Signup;
