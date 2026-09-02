import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchJobs } from '../features/jobs/jobsSlice'
import Header from '../components/Header'
import Footer from '../components/Footer'

const SavedJobs = () => {
  const dispatch = useDispatch()
  const { jobs, loading, error } = useSelector((state) => state.jobs)
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedJobs'))
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const removeBookmark = (jobId) => {
    setSavedJobIds((prev) => {
      const updated = prev.filter((id) => id !== jobId)
      localStorage.setItem('savedJobs', JSON.stringify(updated))
      return updated
    })
  }

  const savedJobs = (jobs || []).filter((job) => savedJobIds.includes(job._id))

  return (
    <>
      <Header />
      <main className="page">
        <div className="page-heading">
          <h1>Saved Jobs</h1>
          <Link className="btn-outline" to="/">Back to all jobs</Link>
        </div>

        {loading && <p className="status-msg">Loading...</p>}
        {error && <p className="status-msg error-text">{error}</p>}

        {!loading && savedJobs.length === 0 && (
          <p className="empty-state">No saved jobs yet.</p>
        )}

        <div className="job-list">
        {savedJobs.map((job) => (
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
            <p>Salary: {job.salary} | Experience: {job.experience} years</p>
            <p className="muted">Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</p>
            <div className="actions">
              <Link className="btn" to={`/jobdetails/${job._id}`}>View Details</Link>
              <button type="button" className="btn-outline" onClick={() => removeBookmark(job._id)}>
                Remove
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

export default SavedJobs
