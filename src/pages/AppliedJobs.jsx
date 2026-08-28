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
        <h1>Applied Jobs</h1>
        <Link to="/">Back to all jobs</Link>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {!loading && activeApplications.length === 0 && (
          <p>No applied jobs yet.</p>
        )}

        {activeApplications.map((item) => (
          <div className="job-item" key={item._id}>
            <h3>{item.job.jobTitle}</h3>
            <p>Company: {item.job.companyName}</p>
            <p>
              {item.job.location} | {item.job.employmentType} | {item.job.jobType}
            </p>
            <p>Application status: {item.status}</p>
            <Link to={`/jobdetails/${item.job._id}`}>View Details</Link>
            {' '}
            <button type="button" onClick={() => handleWithdraw(item._id)}>
              Withdraw
            </button>
            <hr />
          </div>
        ))}
      </main>
      <Footer />
    </>
  )
}

export default AppliedJobs
