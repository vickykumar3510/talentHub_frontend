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
        <h1>Applicants</h1>
        <Link to="/">Back to jobs</Link>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {!loading && applicants.length === 0 && (
          <p>No applicants yet.</p>
        )}

        {applicants.map((item) => (
          <div className="job-item" key={item._id}>
            <h3>{item.applicant?.fullName}</h3>
            <p>Email: {item.applicant?.email}</p>
            <p>Skills: {(item.skills || []).length ? item.skills.join(", ") : "Not added"}</p>
            <p>Experience: {item.experience || "Not added"}</p>
            <p>
              Applied:{" "}
              {item.appliedAt || item.createdAt
                ? new Date(item.appliedAt || item.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            {item.resume ? (
              <p>
                <ViewResumeButton resume={item.resume} />
              </p>
            ) : (
              <p>No resume uploaded</p>
            )}
            <p>Status: {item.status}</p>
            <button type="button" onClick={() => updateStatus(item._id, "Shortlisted")}>
              Shortlist
            </button>
            {' '}
            <button type="button" onClick={() => updateStatus(item._id, "Rejected")}>
              Reject
            </button>
            <hr />
          </div>
        ))}
      </main>
      <Footer />
    </>
  )
}

export default Applicants
