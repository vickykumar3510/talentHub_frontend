import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchJobs } from "../features/jobs/jobsSlice"
import { Link } from "react-router-dom"
import axios from "axios"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ViewResumeButton from "../components/ViewResumeButton"

const API = "https://talent-hub-backend-gray.vercel.app"

const Landing = () => {
  const dispatch = useDispatch()
  const role = localStorage.getItem("role")
  const token = localStorage.getItem("token")
  const { jobs, loading, error } = useSelector((state) => state.jobs)
  const [search, setSearch] = useState("")
  const [stats, setStats] = useState({
    activeJobs: 0,
    archivedJobs: 0,
    totalApplications: 0,
    totalShortlisted: 0,
    recentApplicants: [],
  })
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState("")

  useEffect(() => {
    if (role !== "Recruiter") {
      dispatch(fetchJobs())
    }
  }, [dispatch, role])

  useEffect(() => {
    if (role !== "Recruiter") return

    const loadStats = async () => {
      try {
        setStatsLoading(true)
        setStatsError("")
        const response = await axios.get(`${API}/recruiter/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(response.data)
      } catch (err) {
        setStatsError(err.response?.data?.message || "Failed to load dashboard")
      } finally {
        setStatsLoading(false)
      }
    }

    loadStats()
  }, [role, token])

  if (role === "Recruiter") {
    return (
      <>
        <Header />
        <main className="page">
          <div className="page-heading">
            <div>
              <h1>Recruiter Dashboard</h1>
              <p className="muted">Track jobs, applications, and recent candidates.</p>
            </div>
            <div className="actions">
              <Link className="btn-outline" to="/">My Jobs</Link>
              <Link className="btn" to="/jobform">Post a Job</Link>
              <Link className="btn-outline" to="/recruiter/profile">Profile</Link>
            </div>
          </div>

          {statsLoading && <p className="status-msg">Loading...</p>}
          {statsError && <p className="status-msg error-text">{statsError}</p>}

          {!statsLoading && !statsError && (
            <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>{stats.activeJobs}</h3>
                <p>Active Jobs</p>
              </div>
              <div className="stat-card">
                <h3>{stats.totalApplications}</h3>
                <p>Applications</p>
              </div>
              <div className="stat-card">
                <h3>{stats.totalShortlisted}</h3>
                <p>Shortlisted</p>
              </div>
              <div className="stat-card">
                <h3>{stats.archivedJobs}</h3>
                <p>Archived Jobs</p>
              </div>
            </div>

            <h2>Recent Applicants</h2>
            {(stats.recentApplicants || []).length === 0 && (
              <p className="empty-state">No recent applicants.</p>
            )}
            {(stats.recentApplicants || []).length > 0 && (
            <div className="table-wrap card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Job</th>
                    <th>Date applied</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
            {(stats.recentApplicants || []).map((item) => (
              <tr key={item._id}>
                <td>
                  <strong>{item.applicant?.fullName || "Applicant"}</strong>
                  <div className="muted">{item.applicant?.email}</div>
                  <div className="muted">Skills: {(item.skills || []).length ? item.skills.join(", ") : "Not added"}</div>
                </td>
                <td>{item.job?.jobTitle}</td>
                <td>
                  {item.appliedAt || item.createdAt
                    ? new Date(item.appliedAt || item.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{item.experience || "Not added"}</td>
                <td>
                  <span className={`badge ${item.status === "Shortlisted" ? "badge-success" : item.status === "Rejected" ? "badge-danger" : "badge-info"}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    {item.resume ? (
                      <ViewResumeButton resume={item.resume} />
                    ) : (
                      <span className="muted">No resume uploaded</span>
                    )}
                    {item.job?._id && (
                      <Link className="btn-outline" to={`/applicants/${item.job._id}`}>View Applicants</Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
                </tbody>
              </table>
            </div>
            )}
            </>
          )}
        </main>
        <Footer />
      </>
    )
  }

  const filteredJobs = (jobs || []).filter((job) => {
    if (!search.trim()) return true
    const query = search.toLowerCase()
    return (
      job.jobTitle?.toLowerCase().includes(query) ||
      job.companyName?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query)
    )
  })

  const displayedJobs = search.trim()
    ? filteredJobs
    : [...(jobs || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

  return (
    <>
      <Header />

      <main className="page">
        <section className="hero-banner">
          <h1>TalentHub - Find Your Dream Job</h1>
          <p>Welcome to TalentHub hiring platform</p>
          <Link className="btn" to="/">View All Jobs</Link>
        </section>

        <input
          className="search-input"
          type="text"
          placeholder="Search by job title, company, or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h2>{search.trim() ? "Search Results" : "Latest 5 Jobs"}</h2>

        {loading && <p className="status-msg">Loading...</p>}

        {!loading && error && <p className="status-msg error-text">{error}</p>}

        {!loading && !error && displayedJobs.length === 0 && (
          <p className="empty-state">{search.trim() ? "No jobs found." : "No jobs available yet."}</p>
        )}

        <div className="job-list">
        {displayedJobs.map((job) => (
          <div className="job-item" key={job._id}>
            <div className="job-item-top">
              <div className="job-logo">{(job.companyName || "J").charAt(0)}</div>
              <div>
                <h3>{job.jobTitle}</h3>
                <p className="muted">Company: {job.companyName}</p>
              </div>
            </div>
            <div className="job-meta">
              <span>{job.location}</span>
              <span className="badge">{job.employmentType}</span>
              <span className="badge badge-info">{job.jobType}</span>
            </div>
            <p>
              Salary: {job.salary} | Experience: {job.experience} years
            </p>
            <Link className="btn" to={`/jobdetails/${job._id}`}>
              View Details
            </Link>
          </div>
        ))}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default Landing
