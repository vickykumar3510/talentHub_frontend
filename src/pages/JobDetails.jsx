import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { archiveJob } from "../features/jobs/jobsSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API = "https://talent-hub-backend-gray.vercel.app";

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [application, setApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Job not found.");
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  useEffect(() => {
    const loadSimilarJobs = async () => {
      try {
        const response = await axios.get(`${API}/jobs/${id}/similar`);
        setSimilarJobs(response.data || []);
      } catch {
        setSimilarJobs([]);
      }
    };
    loadSimilarJobs();
  }, [id]);

  useEffect(() => {
    const loadApplication = async () => {
      if (role !== "Applicant" || !token) return;
      try {
        const response = await axios.get(`${API}/applications/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = (response.data || []).find(
          (item) => item.job && item.job._id === id
        );
        setApplication(found || null);
      } catch {
        setApplication(null);
      }
    };
    loadApplication();
  }, [id, role, token]);

  const handleApply = async () => {
    try {
      const response = await axios.post(
        `${API}/jobs/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplication(response.data.application);
      setMessage("Application submitted successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply.");
    }
  };

  const handleWithdraw = async () => {
    if (!application?._id) return;
    try {
      await axios.put(
        `${API}/applications/${application._id}/withdraw`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplication({ ...application, status: "Withdrawn" });
      setMessage("Application withdrawn.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to withdraw.");
    }
  };

  const handleArchive = async () => {
    try {
      const updated = await dispatch(archiveJob(id)).unwrap();
      setJob(updated);
      setMessage("Job archived.");
    } catch (err) {
      setMessage(err || "Failed to archive job.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!job) return <p>Job not found.</p>;

  const hasApplied = application && application.status !== "Withdrawn";
  const isOwnJob = job.postedBy && String(job.postedBy) === String(userId);
  const deadlinePassed = (() => {
    if (!job.applicationDeadline) return false;
    const deadline = new Date(job.applicationDeadline);
    deadline.setHours(23, 59, 59, 999);
    return new Date() > deadline;
  })();

  return (
    <>
    <Header />
    <main className="page">
        <Link to='/'>Back to all jobs</Link>
                
      <h2>{job.jobTitle}</h2>
      <p><strong>Company:</strong> {job.companyName}</p>
      <p><strong>Employment Type:</strong> {job.employmentType}</p>
      <p><strong>Job Type:</strong> {job.jobType}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> Rs. {job.salary}</p>
      <p><strong>Experience:</strong> {job.experience} years</p>
      {job.status && <p><strong>Status:</strong> {job.status}</p>}

        <h2>Description</h2>
        <p>{job.jobDescription}</p>

      {job.responsibilities && (
        <section>
          <h2>Responsibilities</h2>
          <p>{job.responsibilities}</p>
        </section>
      )}

      {job.requiredSkills?.length > 0 && (
        <section>
          <h2>Required Skills</h2>
          <ul>
            {job.requiredSkills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      {job.aboutCompany && (
        <section>
          <h2>About Company</h2>
          <p>{job.aboutCompany}</p>
        </section>
      )}

      {job.companyReview && (
        <section>
          <h2>Company Review</h2>
          <p>{job.companyReview}</p>
        </section>
      )}

      <p><strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
      {job.applicationDeadline && (
        <p>
          <strong>Application Deadline:</strong>{" "}
          {new Date(job.applicationDeadline).toLocaleDateString()}
        </p>
      )}

      {message && <p>{message}</p>}

      {role === "Applicant" && (
        <>
          {!hasApplied && !deadlinePassed && (
            <button type="button" onClick={handleApply}>
              Apply
            </button>
          )}
          {!hasApplied && deadlinePassed && (
            <p>Application deadline has passed.</p>
          )}
          {hasApplied && (
            <>
              <p>Status: {application.status}</p>
              <button type="button" onClick={handleWithdraw}>
                Withdraw Application
              </button>
            </>
          )}
        </>
      )}

      {role === "Recruiter" && isOwnJob && (
        <>
          <Link to={`/jobform/${job._id}`}>Edit Job</Link>
          {' '}
          {job.status !== "Archived" && (
            <button type="button" onClick={handleArchive}>Archive Job</button>
          )}
          {' '}
          <Link to={`/applicants/${job._id}`}>View Applicants</Link>
        </>
      )}

      <h2>Similar Jobs</h2>
      {similarJobs.length === 0 && <p>No similar jobs.</p>}
      {similarJobs.map((similarJob) => (
        <div className="job-item" key={similarJob._id}>
          <h3>{similarJob.jobTitle}</h3>
          <p>Company: {similarJob.companyName}</p>
          <p>
            {similarJob.location} | {similarJob.employmentType} | {similarJob.jobType}
          </p>
          <Link to={`/jobdetails/${similarJob._id}`}>View Details</Link>
          <hr />
        </div>
      ))}
    </main>
    <Footer />
    </>
  );
};

export default JobDetails;
