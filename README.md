# TalentHub

A full‑stack job hiring platform where users can create accounts, log in securely, browse and search jobs, view job details, apply to jobs, bookmark jobs for later, post new job listings, and generate AI‑powered interview preparation plans. Built with a React frontend, Express/Node backend, and MongoDB database.

---

## Demo Link

[Live Demo](https://talent-hub-frontend-mauve.vercel.app/)

---

## Login

> **Guest** <br> 
> Email: `abc@gmail.com`  <br>
> Password: `abc123456` 

---

## Quick Start

```
git clone https://github.com/vickykumar3510/talentHub_frontend.git
cd <talentHub_frontend>
npm install
npm run dev
```

---

## Technologies

**Frontend**
- React JS
- React Router
- Redux Toolkit
- Axios
- Node JS
- Express
- MongoDB
- JWT
- OpenAI

--- 

## Demo Video

Watch a walkthrough (8-10 minutes) of all the major features of this app: [Google Drive Link](https://drive.google.com/file/d/1UZtVd_GoBNy9lthLWFs2UkT7SV6gvYL_/view?usp=sharing)

---

## Features

**Login**
- User login form with email and password fields 
- Error messages shown for incorrect credentials
- Successful login stores JWT token and redirects to landing page
- Protected routes require authentication

**Sign Up**
- User account creation form with full name, email, password, and role
- Role selection: Applicant or Recruiter
- Password confirmation validation
- Success alert shown on account creation
- Navigation link back to Login page

**Landing**
- Welcome page with TalentHub branding
- Applicant view displays the latest 5 jobs by default
- Search by job title, company, or location
- Quick links to view all jobs

**Recruiter Dashboard**
- Summary cards for active jobs, applications, shortlisted, and archived jobs
- Recent applicants table with status, resume, and links to view applicants

**All Jobs / My Jobs**
- Displays list of all jobs with navigation to job details
- Recruiters see their own posted jobs
- Filtering options: search, min salary, max experience, location, employment type, job type
- Sorting by newest, salary (high/low), or experience (high/low)
- Bookmark jobs directly from the jobs list (Applicant)
- Edit, archive, and view applicants from the jobs list (Recruiter)
- Clear filters option available

**Job Detail**
- Displays complete information about the selected job: company, employment type, job type, location, salary, experience, description, responsibilities, required skills, about company, and company review
- Provides Apply button to submit an application
- Applicants can withdraw an application
- Recruiters can edit, archive, or view applicants for their own jobs
- Similar jobs listed on the same page

**Post / Edit a Job**
- Form to create or edit a job listing with title, company, salary, experience, description, skills, location, and more
- Employment type: Full-Time or Part-Time
- Job type: Remote, Onsite, or Offsite
- Application deadline field
- Requires authentication (JWT bearer token)
- Redirects to all jobs after successful post or update

**Saved Jobs**
- Displays all bookmarked jobs
- Options to View Details or Remove from saved list
- Jobs persist via local storage

**Applied Jobs**
- Displays all jobs the user has applied to
- Shows application status
- Option to withdraw an application
- Navigation link back to all jobs

**Applicant Profile**
- Create and edit applicant profile with photo, bio, experience, skills, education, and resume
- View and delete uploaded resume
- Profile data saved to the backend

**Recruiter Profile**
- Create and edit company profile with company name, logo, website, and about company
- Profile data saved to the backend

**Applicants**
- Recruiters can view all applicants for a posted job
- Shows applicant details, skills, experience, resume, and status
- Shortlist or reject an applicant

**AI Interview Preparation**
- Enter a job role to generate an interview preparation plan
- Displays interview questions, topics to revise, and preparation tips
- Powered by AI backend endpoint
- Requires authentication token

**AI Hiring Assistant**
- Recruiters can ask questions about their applicants
- Suggested prompts for top candidates and summaries
- Powered by AI backend endpoint
- Requires authentication token

---

## API Reference

**POST /signup** <br>
Register new user<br>

Sample Response:
```
{ message }
```

**POST /login** <br>
Login user<br>


Sample Response:
```
{ message, token }
```

**GET /jobs**<br>
List all jobs<br>

Sample Response:
```
[{ _id, jobTitle, companyName, employmentType, jobType, location, salary, experience, jobDescription, responsibilities, requiredSkills, aboutCompany, companyReview, createdAt }]
```

**POST /jobs**<br>
Add new job (requires Bearer token)<br>

Sample Response:
```
{ job: { _id, jobTitle, companyName, employmentType, jobType, location, salary, experience, jobDescription, responsibilities, requiredSkills, aboutCompany, companyReview, createdAt } }
```

**POST /api/ai/talenthub-interview**<br>
Generate AI interview preparation plan<br>

Sample Response:
```
{ answer }
```
---

## Contact

For bugs or feature requests, please reach out to vicky.kumar3510@gmail.com
