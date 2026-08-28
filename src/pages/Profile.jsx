import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/Header"
import Footer from "../components/Footer"

const API = "https://talent-hub-backend-gray.vercel.app"

const Profile = () => {
  const token = localStorage.getItem("token")
  const [profilePhoto, setProfilePhoto] = useState("")
  const [resume, setResume] = useState("")
  const [photoFile, setPhotoFile] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [skills, setSkills] = useState("")
  const [education, setEducation] = useState("Undergraduate")
  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "")
  const [hasProfile, setHasProfile] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get(`${API}/applicant/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const profile = response.data
        setHasProfile(true)
        setProfilePhoto(profile.profilePhoto || "")
        setResume(profile.resume || "")
        setSkills((profile.skills || []).join(", "))
        setEducation(profile.education || "Undergraduate")
        if (profile.user?.fullName) {
          setFullName(profile.user.fullName)
          localStorage.setItem("fullName", profile.user.fullName)
        }
      } catch {
        setHasProfile(false)
      }
    }
    loadProfile()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    const formData = new FormData()
    formData.append("skills", skills)
    formData.append("education", education)
    if (photoFile) {
      formData.append("profilePhoto", photoFile)
    }
    if (resumeFile) {
      formData.append("resume", resumeFile)
    }

    try {
      setLoading(true)
      const config = { headers: { Authorization: `Bearer ${token}` } }
      if (hasProfile) {
        const response = await axios.put(`${API}/applicant/profile`, formData, config)
        const profile = response.data.profile
        setProfilePhoto(profile?.profilePhoto || profilePhoto)
        setResume(profile?.resume || resume)
        setPhotoFile(null)
        setResumeFile(null)
        setMessage("Profile updated successfully")
      } else {
        const response = await axios.post(`${API}/applicant/profile`, formData, config)
        const profile = response.data.profile
        setHasProfile(true)
        setProfilePhoto(profile?.profilePhoto || "")
        setResume(profile?.resume || "")
        setPhotoFile(null)
        setResumeFile(null)
        setMessage("Profile created successfully")
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="page">
        <h1>Profile</h1>
        {fullName && <p>{fullName}</p>}

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

          <label>Resume</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files[0] || null)}
          />
          {resume && (
            <p>
              <a href={resume} target="_blank" rel="noreferrer">
                View current resume
              </a>
            </p>
          )}

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
            {loading ? "Saving..." : hasProfile ? "Update Profile" : "Create Profile"}
          </button>
        </form>

        {message && <p>{message}</p>}
      </main>
      <Footer />
    </>
  )
}

export default Profile
