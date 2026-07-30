import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchJobs } from "../features/jobs/jobsSlice"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

const Landing = () => {
  const dispatch = useDispatch()
  const { jobs, loading, error } = useSelector((state) => state.jobs)
  const [search, setSearch] = useState("")

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

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

      <main>
        <h1>TalentHub - Find Your Dream Job</h1>

        <p>Welcome to TalentHub hiring platform</p>

        <Link to="/">View All Jobs</Link> |{" "}
        <Link to="/jobform">Post a Job</Link>

        <br /><br />

        <input
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
          <div key={job._id}>
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
