import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchJobs } from "../features/jobs/jobsSlice"
import Header from "../components/Header"
import Footer from "../components/Footer"

const getAppliedJobIds = () => {
  try {
    const applied = JSON.parse(localStorage.getItem("appliedJobs"))
    return Array.isArray(applied) ? applied : []
  } catch {
    return []
  }
}

const AppliedJobs = () => {
  const dispatch = useDispatch()
  const { jobs, loading, error } = useSelector((state) => state.jobs)
  const appliedJobIds = getAppliedJobIds()

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const appliedJobs = (jobs || []).filter((job) =>
    appliedJobIds.includes(job._id)
  )

  return (
    <>
      <Header />
      <main className="page">
        <h1>Applied Jobs</h1>
        <Link to="/">Back to all jobs</Link>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {!loading && appliedJobs.length === 0 && (
          <p>No applied jobs yet.</p>
        )}

        {appliedJobs.map((job) => (
          <div className="job-item" key={job._id}>
            <h3>{job.jobTitle}</h3>
            <p>Company: {job.companyName}</p>
            <p>
              {job.location} | {job.employmentType} | {job.jobType}
            </p>
            <p>
              Salary: {job.salary} | Experience: {job.experience} years
            </p>
            <p>
              Posted:{" "}
              {job.createdAt
                ? new Date(job.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <Link to={`/jobdetails/${job._id}`}>View Details</Link>
            <hr />
          </div>
        ))}
      </main>
      <Footer />
    </>
  )
}

export default AppliedJobs
