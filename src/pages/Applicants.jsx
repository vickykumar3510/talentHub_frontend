import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ViewResumeButton from "../components/ViewResumeButton"
import toast from "react-hot-toast"

const API = "https://talent-hub-backend-gray.vercel.app"

const Applicants = () => {
  const { jobId } = useParams()
  const token = localStorage.getItem("token")
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadApplicants = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API}/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setApplicants(response.data || [])
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applicants")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplicants()
  }, [jobId])

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `${API}/applications/${applicationId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      loadApplicants()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status")
    }
  }

  return (
    <>
      <Header />
      <main className="page">
        <div className="page-heading">
          <h1>Applicants</h1>
          <Link className="btn-outline" to="/">Back to jobs</Link>
        </div>

        {loading && <p className="status-msg">Loading...</p>}
        {error && <p className="status-msg error-text">{error}</p>}

        {!loading && applicants.length === 0 && (
          <p className="empty-state">No applicants yet.</p>
        )}

        {!loading && applicants.length > 0 && (
        <div className="table-wrap card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Experience</th>
                <th>Date applied</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
        {applicants.map((item) => (
          <tr key={item._id}>
            <td>
              <strong>{item.applicant?.fullName}</strong>
              <div className="muted">{item.applicant?.email}</div>
              <div className="muted">Skills: {(item.skills || []).length ? item.skills.join(", ") : "Not added"}</div>
            </td>
            <td>{item.experience || "Not added"}</td>
            <td>
              {item.appliedAt || item.createdAt
                ? new Date(item.appliedAt || item.createdAt).toLocaleDateString()
                : "N/A"}
            </td>
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
                <button type="button" onClick={() => updateStatus(item._id, "Shortlisted")}>
                  Shortlist
                </button>
                <button type="button" className="btn-danger" onClick={() => updateStatus(item._id, "Rejected")}>
                  Reject
                </button>
              </div>
            </td>
          </tr>
        ))}
            </tbody>
          </table>
        </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Applicants
