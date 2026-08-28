import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/Header"
import Footer from "../components/Footer"
import toast from "react-hot-toast"

const API = "https://talent-hub-backend-gray.vercel.app"

const RecruiterProfile = () => {
  const token = localStorage.getItem("token")
  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "")
  const [companyName, setCompanyName] = useState("")
  const [companyLogo, setCompanyLogo] = useState("")
  const [logoFile, setLogoFile] = useState(null)
  const [website, setWebsite] = useState("")
  const [aboutCompany, setAboutCompany] = useState("")
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(false)

  const applyProfile = (profile) => {
    if (!profile) return
    setCompanyName(profile.companyName || "")
    setCompanyLogo(profile.companyLogo || "")
    setWebsite(profile.website || "")
    setAboutCompany(profile.aboutCompany || "")
    setLogoFile(null)
    if (profile.user?.fullName) {
      setFullName(profile.user.fullName)
      localStorage.setItem("fullName", profile.user.fullName)
    }
  }

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get(`${API}/recruiter/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setHasProfile(true)
        applyProfile(response.data)
      } catch {
        setHasProfile(false)
      }
    }
    loadProfile()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("companyName", companyName)
    formData.append("website", website)
    formData.append("aboutCompany", aboutCompany)
    if (logoFile) {
      formData.append("companyLogo", logoFile)
    }

    try {
      setLoading(true)
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = hasProfile
        ? await axios.put(`${API}/recruiter/profile`, formData, config)
        : await axios.post(`${API}/recruiter/profile`, formData, config)

      const wasUpdate = hasProfile
      setHasProfile(true)
      applyProfile(response.data.profile)
      toast.success(wasUpdate ? "Company details saved" : "Profile created successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile")
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
          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <label>Company Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files[0] || null)}
          />
          {companyLogo && (
            <img className="profile-photo" src={companyLogo} alt="Company logo" />
          )}

          <label>Website</label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
          />

          <label>About Company</label>
          <textarea
            value={aboutCompany}
            onChange={(e) => setAboutCompany(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </main>
      <Footer />
    </>
  )
}

export default RecruiterProfile
