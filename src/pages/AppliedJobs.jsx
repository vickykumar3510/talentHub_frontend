import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Header from "../components/Header"
import Footer from "../components/Footer"
import toast from "react-hot-toast"

const API = "https://talent-hub-backend-gray.vercel.app"

const AppliedJobs = () => {
  const token = localStorage.getItem("token")
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadApplications = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API}/applications/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setApplications(response.data || [])
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const handleWithdraw = async (applicationId) => {
    try {
      await axios.put(
        `${API}/applications/${applicationId}/withdraw`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      loadApplications()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to withdraw")
    }
  }

  const activeApplications = applications.filter(
    (item) => item.status !== "Withdrawn" && item.job
  )

  return (
    <>
      <Header />
      <main className="page">
        <div className="page-heading">
          <h1>Applied Jobs</h1>
          <Link className="btn-outline" to="/">Back to all jobs</Link>
        </div>

        {loading && <p className="status-msg">Loading...</p>}
        {error && <p className="status-msg error-text">{error}</p>}

        {!loading && activeApplications.length === 0 && (
          <p className="empty-state">No applied jobs yet.</p>
        )}

        <div className="job-list">
        {activeApplications.map((item) => (
          <div className="job-item" key={item._id}>
            <h3>{item.job.jobTitle}</h3>
            <p className="muted">Company: {item.job.companyName}</p>
            <div className="job-meta">
              <span>{item.job.location}</span>
              <span className="badge">{item.job.employmentType}</span>
              <span className="badge badge-info">{item.job.jobType}</span>
            </div>
            <p>
              Application status:{" "}
              <span className={`badge ${item.status === "Shortlisted" ? "badge-success" : item.status === "Rejected" ? "badge-danger" : "badge-info"}`}>
                {item.status}
              </span>
            </p>
            <div className="actions">
              <Link className="btn" to={`/jobdetails/${item.job._id}`}>View Details</Link>
              <button type="button" className="btn-outline" onClick={() => handleWithdraw(item._id)}>
                Withdraw
              </button>
            </div>
          </div>
        ))}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default AppliedJobs
