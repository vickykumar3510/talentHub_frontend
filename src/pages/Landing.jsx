import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchJobs } from "../features/jobs/jobsSlice"
import { Link } from "react-router-dom"
import axios from "axios"
import Header from "../components/Header"
import Footer from "../components/Footer"

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
          <h1>Recruiter Dashboard</h1>
          <p>
            <Link to="/">My Jobs</Link>
            {" "}| <Link to="/jobform">Post a Job</Link>
            {" "}| <Link to="/recruiter/profile">Profile</Link>
          </p>

          {statsLoading && <p>Loading...</p>}
          {statsError && <p>{statsError}</p>}

          {!statsLoading && !statsError && (
            <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>{stats.activeJobs}</h3>
                <p>Active Jobs</p>
              </div>
              <div className="stat-card">
                <h3>{stats.archivedJobs}</h3>
                <p>Archived Jobs</p>
              </div>
              <div className="stat-card">
                <h3>{stats.totalApplications}</h3>
                <p>Total Applications</p>
              </div>
              <div className="stat-card">
                <h3>{stats.totalShortlisted}</h3>
                <p>Total Shortlisted</p>
              </div>
            </div>

            <h2>Recent Applicants</h2>
            {(stats.recentApplicants || []).length === 0 && (
              <p>No recent applicants.</p>
            )}
            {(stats.recentApplicants || []).map((item) => (
              <div className="job-item" key={item._id}>
                <h3>{item.applicant?.fullName || "Applicant"}</h3>
                <p>Email: {item.applicant?.email}</p>
                <p>Job: {item.job?.jobTitle}</p>
                <p>Status: {item.status}</p>
                {item.job?._id && (
                  <Link to={`/applicants/${item.job._id}`}>View Applicants</Link>
                )}
                <hr />
              </div>
            ))}
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
        <h1>TalentHub - Find Your Dream Job</h1>

        <p>Welcome to TalentHub hiring platform</p>

        <Link to="/">View All Jobs</Link>

        <input
          className="search-input"
          type="text"
          placeholder="Search by job title, company, or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h2>{search.trim() ? "Search Results" : "Latest 5 Jobs"}</h2>

        {loading && <p>Loading...</p>}

        {error && <p>{error}</p>}

        {!loading && displayedJobs.length === 0 && (
          <p>{search.trim() ? "No jobs found." : "No jobs available yet."}</p>
        )}

        {displayedJobs.map((job) => (
          <div className="job-item" key={job._id}>
            <h3>{job.jobTitle}</h3>

            <p>Company: {job.companyName}</p>

            <p>
              {job.location} | {job.employmentType} | {job.jobType}
            </p>

            <p>
              Salary: {job.salary} | Experience: {job.experience} years
            </p>

            <Link to={`/jobdetails/${job._id}`}>
              View Details
            </Link>

            <hr />
          </div>
        ))}
      </main>

      <Footer />
    </>
  )
}

export default Landing
