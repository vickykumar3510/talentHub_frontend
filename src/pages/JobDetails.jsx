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

  if (loading) return (
    <>
      <Header />
      <main className="page"><p className="status-msg">Loading...</p></main>
      <Footer />
    </>
  );
  if (error) return (
    <>
      <Header />
      <main className="page"><p className="status-msg error-text">{error}</p></main>
      <Footer />
    </>
  );
  if (!job) return (
    <>
      <Header />
      <main className="page"><p className="empty-state">Job not found.</p></main>
      <Footer />
    </>
  );

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
        <Link className="back-link" to='/'>Back to all jobs</Link>

      <div className="details-layout">
      <div>
      <section className="details-hero card">
        <h2>{job.jobTitle}</h2>
        <p className="muted"><strong>Company:</strong> {job.companyName}</p>
        <div className="job-meta">
          <span className="badge">{job.employmentType}</span>
          <span className="badge badge-info">{job.jobType}</span>
          <span>{job.location}</span>
        </div>
        <p><strong>Salary:</strong> Rs. {job.salary}</p>
        <p><strong>Experience:</strong> {job.experience} years</p>
        {job.status && <p><span className="badge">{job.status}</span></p>}
        <p className="muted"><strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
        {job.applicationDeadline && (
          <p className="muted">
            <strong>Application Deadline:</strong>{" "}
            {new Date(job.applicationDeadline).toLocaleDateString()}
          </p>
        )}

        {message && <p>{message}</p>}

        <div className="actions">
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
                <button type="button" className="btn-outline" onClick={handleWithdraw}>
                  Withdraw Application
                </button>
              </>
            )}
          </>
        )}

        {role === "Recruiter" && isOwnJob && (
          <>
            <Link className="btn-outline" to={`/jobform/${job._id}`}>Edit Job</Link>
            {job.status !== "Archived" && (
              <button type="button" className="btn-outline" onClick={handleArchive}>Archive Job</button>
            )}
            <Link className="btn" to={`/applicants/${job._id}`}>View Applicants</Link>
          </>
        )}
        </div>
      </section>

      <section className="section-card card">
        <h2>Description</h2>
        <p>{job.jobDescription}</p>
      </section>

      {job.responsibilities && (
        <section className="section-card card">
          <h2>Responsibilities</h2>
          <p>{job.responsibilities}</p>
        </section>
      )}

      {job.requiredSkills?.length > 0 && (
        <section className="section-card card">
          <h2>Required Skills</h2>
          <ul className="skill-list">
            {job.requiredSkills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      {job.aboutCompany && (
        <section className="section-card card">
          <h2>About Company</h2>
          <p>{job.aboutCompany}</p>
        </section>
      )}

      {job.companyReview && (
        <section className="section-card card">
          <h2>Company Review</h2>
          <p>{job.companyReview}</p>
        </section>
      )}
      </div>

      <aside>
      <section className="section-card card">
      <h2>Similar Jobs</h2>
      {similarJobs.length === 0 && <p className="muted">No similar jobs.</p>}
      <div className="job-list">
      {similarJobs.map((similarJob) => (
        <div className="job-item" key={similarJob._id}>
          <h3>{similarJob.jobTitle}</h3>
          <p className="muted">Company: {similarJob.companyName}</p>
          <p className="muted">
            {similarJob.location} | {similarJob.employmentType} | {similarJob.jobType}
          </p>
          <Link className="btn-outline" to={`/jobdetails/${similarJob._id}`}>View Details</Link>
        </div>
      ))}
      </div>
      </section>
      </aside>
      </div>
    </main>
    <Footer />
    </>
  );
};

export default JobDetails;
