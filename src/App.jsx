import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchJobs, fetchRecruiterJobs, archiveJob } from './features/jobs/jobsSlice'
import { Link } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'


const App = () => {
  const dispatch = useDispatch()
  const role = localStorage.getItem('role')
  const {loading , error, jobs} = useSelector((state) => state.jobs)

  const [search, setSearch] = useState('')
  const [salary, setSalary] = useState('')
  const [experience, setExperience] = useState('')
  const [location, setLocation] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [jobType, setJobType] = useState('')
  const [sortBy, setSortBy] = useState('newest')
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
      <h2>{role === "Recruiter" ? "My Jobs" : "All Jobs"}</h2>

      {role === "Recruiter" && <Link to='/jobform'>Post a job</Link>}

      <input
        className="search-input"
        type="text"
        placeholder="Search by job title, company, or location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">
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
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {sortedJobs.map((job) => (
        <div className="job-item" key={job._id}>
          <h3>{job.jobTitle}</h3>
          <p>Company: {job.companyName}</p>
          <p>{job.location} | {job.employmentType} | {job.jobType}</p>
          <p>Salary: {job.salary} | Experience: {job.experience} years</p>
          <p>Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</p>
          {job.status && <p>Status: {job.status}</p>}
          <Link to={`/jobdetails/${job._id}`}>View Details</Link>
          {' '}
          {role === "Applicant" && (
            <button type="button" onClick={() => toggleBookmark(job._id)}>
              {savedJobIds.includes(job._id) ? 'Remove' : 'Bookmark'}
            </button>
          )}
          {role === "Recruiter" && (
            <>
              <Link to={`/jobform/${job._id}`}>Edit</Link>
              {' '}
              {job.status !== "Archived" && (
                <button type="button" onClick={() => dispatch(archiveJob(job._id))}>
                  Archive
                </button>
              )}
              {' '}
              <Link to={`/applicants/${job._id}`}>View Applicants</Link>
            </>
          )}
          <hr />
        </div>
      ))}

    </main>
    <Footer />
    </>
  )
}

export default App