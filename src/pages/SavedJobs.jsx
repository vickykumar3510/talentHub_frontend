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
        <h1>Saved Jobs</h1>
        <Link to="/">Back to all jobs</Link>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {!loading && savedJobs.length === 0 && (
          <p>No saved jobs yet.</p>
        )}

        {savedJobs.map((job) => (
          <div className="job-item" key={job._id}>
            <h3>{job.jobTitle}</h3>
            <p>Company: {job.companyName}</p>
            <p>{job.location} | {job.employmentType} | {job.jobType}</p>
            <p>Salary: {job.salary} | Experience: {job.experience} years</p>
            <p>Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</p>
            <Link to={`/jobdetails/${job._id}`}>View Details</Link>
            {' '}
            <button type="button" onClick={() => removeBookmark(job._id)}>
              Remove
            </button>
            <hr />
          </div>
        ))}
      </main>
      <Footer />
    </>
  )
}

export default SavedJobs
