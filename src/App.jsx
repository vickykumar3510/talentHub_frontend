import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchJobs } from './features/jobs/jobsSlice'
import { Link } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'


const App = () => {
  const dispatch = useDispatch()
  const {loading , error, jobs} = useSelector((state) => state.jobs)
  console.log(jobs)

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])


  return(
    <>
    <Header />
    <main>
      <h2>All Jobs</h2>

      <Link to='/jobform'>Post a job</Link>
      
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {jobs && jobs.map((job) => (
        <div key={job._id}>
          <h3>{job.jobTitle}</h3>
          <p>Company: {job.companyName}</p>
          <p>{job.location} | {job.employmentType} | {job.jobType}</p>
          <p>Salary: {job.salary} | Experience: {job.experience} years</p>
          <Link to={`/jobdetails/${job._id}`}>View Details</Link>
          <hr />
        </div>
      ))}

    </main>
    <Footer />
    </>
  )
}

export default App