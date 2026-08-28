import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import toast from "react-hot-toast"

const AiInterview = () => {
  const [job, setJob] = useState("")
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const token = localStorage.getItem("token")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setPlan(null)

    if (!job.trim()) {
      toast.error("Please enter a job")
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        "https://talent-hub-backend-gray.vercel.app/api/ai/talenthub-interview",
        { prompt: job.trim() },
        { timeout: 120000, headers: { Authorization: `Bearer ${token}` } }
      )

      let answer = response.data.answer

      const jsonStart = answer.indexOf("{")
      const jsonEnd = answer.lastIndexOf("}")
      const planData = JSON.parse(answer.slice(jsonStart, jsonEnd + 1))

      setPlan(planData)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to generate interview plan. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="page">
        <h1>AI Interview Preparation</h1>
        <p>Type your job and get interview questions, topics to revise, and tips.</p>

        <Link to="/landing">Back to home</Link>

        <form onSubmit={handleSubmit}>
          <label>Job</label>
          <input
            type="text"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            placeholder="e.g. Frontend Developer 2 years of experience"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Plan"}
          </button>
        </form>

        {error && <p>{error}</p>}

        {plan && (
          <>
            <h2>Your Interview Preparation Plan</h2>

            <section className="job-item">
              <h3>Interview Questions</h3>
              {plan.interviewQuestions?.length > 0 ? (
                <ul>
                  {plan.interviewQuestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No items available.</p>
              )}
            </section>

            <section className="job-item">
              <h3>Topics to Revise</h3>
              {plan.topicsToRevise?.length > 0 ? (
                <ul>
                  {plan.topicsToRevise.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No items available.</p>
              )}
            </section>

            <section className="job-item">
              <h3>Preparation Tips</h3>
              {plan.preparationTips?.length > 0 ? (
                <ul>
                  {plan.preparationTips.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No items available.</p>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

export default AiInterview
