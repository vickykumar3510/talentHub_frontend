import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchJobs, fetchRecruiterJobs, archiveJob } from './features/jobs/jobsSlice'
import { Link } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

const FILTERS_KEY = 'jobFilters'

const defaultFilters = {
  search: '',
  salary: '',
  experience: '',
  location: '',
  employmentType: '',
  jobType: '',
  sortBy: 'newest',
}

const loadSavedFilters = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(FILTERS_KEY))
    if (saved && typeof saved === 'object') {
      return { ...defaultFilters, ...saved }
    }
  } catch {
    // ignore invalid stored filters
  }
  return defaultFilters
}

const App = () => {
  const dispatch = useDispatch()
  const role = localStorage.getItem('role')
  const {loading , error, jobs} = useSelector((state) => state.jobs)
  const [savedFilters] = useState(loadSavedFilters)

  const [search, setSearch] = useState(savedFilters.search)
  const [salary, setSalary] = useState(savedFilters.salary)
  const [experience, setExperience] = useState(savedFilters.experience)
  const [location, setLocation] = useState(savedFilters.location)
  const [employmentType, setEmploymentType] = useState(savedFilters.employmentType)
  const [jobType, setJobType] = useState(savedFilters.jobType)
  const [sortBy, setSortBy] = useState(savedFilters.sortBy)
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedJobs'))
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })

  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi (NCT)",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha",
    "Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
    "Uttarakhand","West Bengal"
  ]

  useEffect(() => {
    if (role === "Recruiter") {
      dispatch(fetchRecruiterJobs())
    } else {
      dispatch(fetchJobs())
    }
  }, [dispatch, role])

  useEffect(() => {
    localStorage.setItem(FILTERS_KEY, JSON.stringify({
      search,
      salary,
      experience,
      location,
      employmentType,
      jobType,
      sortBy,
    }))
  }, [search, salary, experience, location, employmentType, jobType, sortBy])

  const toggleBookmark = (jobId) => {
    setSavedJobIds((prev) => {
      const updated = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
      localStorage.setItem('savedJobs', JSON.stringify(updated))
      return updated
    })
  }

  const clearFilters = () => {
    setSearch('')
    setSalary('')
    setExperience('')
    setLocation('')
    setEmploymentType('')
    setJobType('')
    setSortBy('newest')
  }

  const filteredJobs = (jobs || []).filter((job) => {
    if (search.trim()) {
      const query = search.toLowerCase()
      const matchesSearch =
        job.jobTitle?.toLowerCase().includes(query) ||
        job.companyName?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }
    if (salary && job.salary < Number(salary)) return false
    if (experience && job.experience > Number(experience)) return false
    if (location && job.location !== location) return false
    if (employmentType && job.employmentType !== employmentType) return false
    if (jobType && job.jobType !== jobType) return false
    return true
  })

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    if (sortBy === 'salaryHigh') {
      return (b.salary || 0) - (a.salary || 0)
    }
    if (sortBy === 'salaryLow') {
      return (a.salary || 0) - (b.salary || 0)
    }
    if (sortBy === 'experienceLow') {
      return (a.experience || 0) - (b.experience || 0)
    }
    if (sortBy === 'experienceHigh') {
      return (b.experience || 0) - (a.experience || 0)
    }
    return 0
  })

  return(
    <>
    <Header />
    <main className="page">
      <div className="page-heading">
        <h2>{role === "Recruiter" ? "My Jobs" : "All Jobs"}</h2>
        {role === "Recruiter" && <Link className="btn" to='/jobform'>Post a job</Link>}
      </div>

      <div className="jobs-layout">
      <aside className="filters">
        <h3>Filters</h3>
        <p className="muted">Narrow down the roles that match you.</p>

        <label>Min Salary: </label>
        <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />

        <label>Max Experience (years): </label>
        <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} />

        <label>Location: </label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">All</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <label>Employment Type: </label>
        <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
          <option value="">All</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
        </select>

        <label>Job Type: </label>
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="">All</option>
          <option value="Remote">Remote</option>
          <option value="Onsite">Onsite</option>
          <option value="Offsite">Offsite</option>
        </select>

        <label>Sort By: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="salaryHigh">Salary: High to Low</option>
          <option value="salaryLow">Salary: Low to High</option>
          <option value="experienceLow">Experience: Low to High</option>
          <option value="experienceHigh">Experience: High to Low</option>
        </select>

        <button type="button" onClick={clearFilters}>Clear Filters</button>
      </aside>

      <div>
      <input
        className="search-input"
        type="text"
        placeholder="Search by job title, company, or location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      {loading && <p className="status-msg">Loading...</p>}
      {!loading && error && <p className="status-msg error-text">{error}</p>}
      {!loading && !error && sortedJobs.length === 0 && (
        <p className="empty-state">{search.trim() || salary || experience || location || employmentType || jobType
          ? "No jobs found."
          : "No jobs available yet."}</p>
      )}

      <div className="job-list">
      {sortedJobs.map((job) => (
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
          {job.applicationDeadline && (
            <p className="muted">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
          )}
          {job.status && <p><span className="badge">{job.status}</span></p>}
          <div className="actions">
          <Link className="btn" to={`/jobdetails/${job._id}`}>View Details</Link>
          {role === "Applicant" && (
            <button type="button" className="btn-outline" onClick={() => toggleBookmark(job._id)}>
              {savedJobIds.includes(job._id) ? 'Remove' : 'Bookmark'}
            </button>
          )}
          {role === "Recruiter" && (
            <>
              <Link className="btn-outline" to={`/jobform/${job._id}`}>Edit</Link>
              {job.status !== "Archived" && (
                <button type="button" className="btn-outline" onClick={() => dispatch(archiveJob(job._id))}>
                  Archive
                </button>
              )}
              <Link className="btn-outline" to={`/applicants/${job._id}`}>View Applicants</Link>
            </>
          )}
          </div>
        </div>
      ))}
      </div>
      </div>
      </div>

    </main>
    <Footer />
    </>
  )
}

export default App