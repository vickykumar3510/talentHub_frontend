import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postJob } from "../features/jobs/jobsSlice";
import { Link, useNavigate } from "react-router-dom";

const JobForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postLoading, postError } = useSelector((state) => state.jobs);

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

  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi (NCT)",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha",
    "Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
    "Uttarakhand","West Bengal"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !jobTitle || !companyName || !employmentType || !salary || !experience ||
      !jobDescription || !responsibilities || !requiredSkills || !jobType ||
      !location || !aboutCompany
    ) {
      alert("Please fill all the required fields");
      return;
    }

    const newJob = {
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
    };

    try {
      await dispatch(postJob(newJob)).unwrap(); 
      navigate("/");
    } catch (err) {
      console.error("Failed to post job:", err);
    }
  };

  return (
    <main>
      <h1>Job Form</h1>
      <Link to="/">Back to all jobs</Link>

      <form onSubmit={handleSubmit}>
        <label>Job Title</label>
        <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
        <br /><br />

        <label>Company Name</label>
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <br /><br />

        <label>Employment Type</label>
        <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
        </select>
        <br /><br />

        <label>Salary</label>
        <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
        <br /><br />

        <label>Experience (years)</label>
        <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} />
        <br /><br />

        <label>Job Description</label>
        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
        <br /><br />

        <label>Responsibilities</label>
        <textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} />
        <br /><br />

        <label>Required Skills</label>
        <input
          type="text"
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
          placeholder="e.g. React, Node.js, MongoDB"
        />
        <br /><br />

        <label>Job Type</label>
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="Remote">Remote</option>
          <option value="Onsite">Onsite</option>
          <option value="Offsite">Offsite</option>
        </select>
        <br /><br />

        <label>Location</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <br /><br />

        <label>About Company</label>
        <textarea value={aboutCompany} onChange={(e) => setAboutCompany(e.target.value)} />
        <br /><br />

        <label>Company Review</label>
        <textarea value={companyReview} onChange={(e) => setCompanyReview(e.target.value)} />
        <br /><br />

        <button type="submit" disabled={postLoading}>
          {postLoading ? "Posting..." : "Post Job"}
        </button>
      </form>

      {postError && <p>{postError}</p>}
    </main>
  );
};

export default JobForm;
