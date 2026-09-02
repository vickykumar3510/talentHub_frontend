import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecruiterJobs, postJob, updateJob } from "../features/jobs/jobsSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

const JobForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { jobs, postLoading, postError } = useSelector((state) => state.jobs);
  const isEdit = Boolean(id);

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [jobType, setJobType] = useState("Remote");
  const [location, setLocation] = useState("Delhi (NCT)");
  const [aboutCompany, setAboutCompany] = useState("");
  const [companyReview, setCompanyReview] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const toDateInput = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi (NCT)",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha",
    "Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
    "Uttarakhand","West Bengal"
  ];

  useEffect(() => {
    dispatch(fetchRecruiterJobs());
  }, [dispatch]);

  useEffect(() => {
    if (!isEdit) return;
    const job = (jobs || []).find((item) => item._id === id);
    if (!job) return;

    setJobTitle(job.jobTitle || "");
    setCompanyName(job.companyName || "");
    setEmploymentType(job.employmentType || "Full-Time");
    setSalary(job.salary || "");
    setExperience(job.experience || "");
    setJobDescription(job.jobDescription || "");
    setResponsibilities(job.responsibilities || "");
    setRequiredSkills((job.requiredSkills || []).join(", "));
    setJobType(job.jobType || "Remote");
    setLocation(job.location || "Delhi (NCT)");
    setAboutCompany(job.aboutCompany || "");
    setCompanyReview(job.companyReview || "");
    setApplicationDeadline(toDateInput(job.applicationDeadline));
  }, [isEdit, id, jobs]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !jobTitle || !companyName || !employmentType || !salary || !experience ||
      !jobDescription || !responsibilities || !requiredSkills || !jobType ||
      !location || !aboutCompany || !applicationDeadline
    ) {
      toast.error("Please fill all the required fields");
      return;
    }

    if (applicationDeadline < today) {
      toast.error("Application deadline cannot be in the past");
      return;
    }

    const jobData = {
      jobTitle,
      companyName,
      employmentType,
      salary: Number(salary),
      experience: Number(experience),
      jobDescription,
      responsibilities,
      requiredSkills: requiredSkills.split(",").map(skill => skill.trim()),
      jobType,
      location,
      aboutCompany,
      companyReview,
      applicationDeadline,
    };

    try {
      if (isEdit) {
        await dispatch(updateJob({ id, data: jobData })).unwrap();
      } else {
        await dispatch(postJob(jobData)).unwrap();
      }
      navigate("/");
    } catch (err) {
      console.error("Failed to save job:", err);
    }
  };

  return (
    <>
    <Header />
    <main className="page">
      <div className="page-heading">
        <h1>{isEdit ? "Edit Job" : "Job Form"}</h1>
        <Link className="btn-outline" to="/">Back to all jobs</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <section className="form-card">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div>
              <label>Job Title</label>
              <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>
            <div>
              <label>Company Name</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div>
              <label>Employment Type</label>
              <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>
          </div>
        </section>

        <section className="form-card">
          <h2>Compensation</h2>
          <div className="form-grid">
            <div>
              <label>Salary</label>
              <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </div>
            <div>
              <label>Experience (years)</label>
              <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="form-card">
          <h2>Details</h2>
          <label>Job Description</label>
          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />

          <label>Responsibilities</label>
          <textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} />
        </section>

        <section className="form-card">
          <h2>Skills</h2>
          <label>Required Skills</label>
          <input
            type="text"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            placeholder="e.g. React, Node.js, MongoDB"
          />
        </section>

        <section className="form-card">
          <h2>Additional Info</h2>
          <div className="form-grid">
            <div>
              <label>Job Type</label>
              <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Offsite">Offsite</option>
              </select>
            </div>
            <div>
              <label>Location</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Application Deadline</label>
              <input
                type="date"
                min={today}
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
              />
            </div>
            <div className="full">
              <label>About Company</label>
              <textarea value={aboutCompany} onChange={(e) => setAboutCompany(e.target.value)} />
            </div>
            <div className="full">
              <label>Company Review</label>
              <textarea value={companyReview} onChange={(e) => setCompanyReview(e.target.value)} />
            </div>
          </div>
        </section>

        <button type="submit" disabled={postLoading}>
          {postLoading ? "Saving..." : isEdit ? "Update Job" : "Post Job"}
        </button>
      </form>

      {postError && <p className="error-text">{postError}</p>}
    </main>
    <Footer />
    </>
  );
};

export default JobForm;
