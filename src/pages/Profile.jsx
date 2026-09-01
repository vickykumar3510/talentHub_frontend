import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ViewResumeButton from "../components/ViewResumeButton"

const API = "https://talent-hub-backend-gray.vercel.app"

const Profile = () => {
  const token = localStorage.getItem("token")
  const [profilePhoto, setProfilePhoto] = useState("")
  const [resume, setResume] = useState("")
  const [photoFile, setPhotoFile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [removeResume, setRemoveResume] = useState(false)
  const [resumeInputKey, setResumeInputKey] = useState(0)
  const [bio, setBio] = useState("")
  const [experience, setExperience] = useState("")
  const [skills, setSkills] = useState("")
  const [education, setEducation] = useState("Undergraduate")
  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "")
  const [hasProfile, setHasProfile] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const applyProfile = (profile) => {
    setProfilePhoto(profile.profilePhoto || "")
    setResume(profile.resume || "")
    setBio(profile.bio || "")
    setExperience(profile.experience || "")
    setSkills((profile.skills || []).join(", "))
    setEducation(profile.education || "Undergraduate")
    setPhotoFile(null)
    setResumeFile(null)
    setRemoveResume(false)
    setResumeInputKey((key) => key + 1)
    if (profile.user?.fullName) {
      setFullName(profile.user.fullName)
      localStorage.setItem("fullName", profile.user.fullName)
    }
  }

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get(`${API}/applicant/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setHasProfile(true)
        setIsEditing(false)
        applyProfile(response.data)
      } catch {
        setHasProfile(false)
        setIsEditing(true)
      } finally {
        setLoadingProfile(false)
      }
    }
    loadProfile()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("bio", bio)
    formData.append("experience", experience)
    formData.append("skills", skills)
    formData.append("education", education)
    if (photoFile) {
      formData.append("profilePhoto", photoFile)
    }
    if (resumeFile) {
      formData.append("resume", resumeFile)
    } else if (removeResume) {
      formData.append("removeResume", "true")
    }

    try {
      setLoading(true)
      const config = { headers: { Authorization: `Bearer ${token}` } }
      if (hasProfile) {
        const response = await axios.put(`${API}/applicant/profile`, formData, config)
        applyProfile(response.data.profile || {
          profilePhoto,
          resume: resumeFile ? resume : (removeResume ? "" : resume),
          bio,
          experience,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          education,
        })
        toast.success("Profile updated successfully")
      } else {
        const response = await axios.post(`${API}/applicant/profile`, formData, config)
        setHasProfile(true)
        applyProfile(response.data.profile || {})
        toast.success("Profile created successfully")
      }
      setIsEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    try {
      const response = await axios.get(`${API}/applicant/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      applyProfile(response.data)
    } catch {
      setPhotoFile(null)
      setResumeFile(null)
      setRemoveResume(false)
    }
    setIsEditing(false)
  }

  const handleDeleteResume = async () => {
    if (!resume || !window.confirm("Delete your resume?")) {
      return
    }

    const formData = new FormData()
    formData.append("removeResume", "true")

    try {
      setLoading(true)
      const response = await axios.put(`${API}/applicant/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      applyProfile(response.data.profile || {
        profilePhoto,
        resume: "",
        bio,
        experience,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        education,
      })
      toast.success("Resume deleted successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete resume")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveResumeInForm = () => {
    setResumeFile(null)
    setResume("")
    setRemoveResume(true)
    setResumeInputKey((key) => key + 1)
  }

  const showForm = !hasProfile || isEditing

  if (loadingProfile) {
    return (
      <>
        <Header />
        <main className="page">
          <h1>Profile</h1>
          <p>Loading...</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="page">
        <h1>Profile</h1>
        {fullName && <p>Hello! {fullName}</p>}

        {hasProfile && !isEditing && (
          <>
            {profilePhoto && (
              <img className="profile-photo" src={profilePhoto} alt="Profile" />
            )}
            <p><strong>Bio:</strong> {bio || "Not added"}</p>
            <p><strong>Experience:</strong> {experience || "Not added"}</p>
            <p><strong>Skills:</strong> {skills || "Not added"}</p>
            <p><strong>Education:</strong> {education || "Not added"}</p>
            {resume ? (
              <p>
                <ViewResumeButton resume={resume} />
                {" "}
                <button type="button" onClick={handleDeleteResume} disabled={loading}>
                  Delete resume
                </button>
              </p>
            ) : (
              <p>No resume uploaded</p>
            )}
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </>
        )}

        {showForm && (
          <form onSubmit={handleSubmit}>
            <label>Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0] || null)}
            />
            {profilePhoto && (
              <img className="profile-photo" src={profilePhoto} alt="Profile" />
            )}

            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell recruiters about yourself"
            />

            <label>Experience</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 2 years as a frontend developer at XYZ"
            />

            <label>Resume (PDF)</label>
            <input
              key={resumeInputKey}
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                setResumeFile(e.target.files[0] || null)
                setRemoveResume(false)
              }}
            />
            {resumeFile && <p>New file selected: {resumeFile.name}</p>}
            {resume && (
              <p>
                <ViewResumeButton resume={resume} label="View current resume" />
                {" "}
                <button type="button" onClick={handleRemoveResumeInForm} disabled={loading}>
                  Remove resume
                </button>
              </p>
            )}
            {removeResume && !resumeFile && <p>Resume will be deleted when you save.</p>}

            <label>Skills</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, MongoDB"
            />

            <label>Education</label>
            <select value={education} onChange={(e) => setEducation(e.target.value)}>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : hasProfile ? "Save" : "Create Profile"}
            </button>
            {hasProfile && (
              <button type="button" onClick={handleCancel} disabled={loading}>
                Cancel
              </button>
            )}
          </form>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Profile
