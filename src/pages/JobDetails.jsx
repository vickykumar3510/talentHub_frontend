import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const getAppliedJobIds = () => {
  try {
    const applied = JSON.parse(localStorage.getItem("appliedJobs"));
    return Array.isArray(applied) ? applied : [];
  } catch {
    return [];
  }
};

const JobDetails = () => {
  const { id } = useParams();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const [appliedJobIds, setAppliedJobIds] = useState(getAppliedJobIds);

  const job = jobs?.find((item) => item._id === id);
  const hasApplied = appliedJobIds.includes(id);

  const handleApply = () => {
    if (hasApplied) return;

    const updated = [...appliedJobIds, id];
    localStorage.setItem("appliedJobs", JSON.stringify(updated));
    setAppliedJobIds(updated);
    alert("Application submitted successfully!");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!job) return <p>Job not found.</p>;

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

      <button type="button" onClick={handleApply} disabled={hasApplied}>
        {hasApplied ? "Applied" : "Apply"}
      </button>
    </main>
    <Footer />
    </>
  );
};

export default JobDetails;
