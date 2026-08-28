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
    <main className="page">
      <h1>Login</h1>

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
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </main>
  );
};

export default Login;
