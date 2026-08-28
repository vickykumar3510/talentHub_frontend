import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import toast from "react-hot-toast"

const API = "https://talent-hub-backend-gray.vercel.app"

const SUGGESTED_QUESTIONS = [
  "Suggest the top 3 candidates",
  "Summarize all applicants",
  "Who should I interview first?",
  "Which applicant has the strongest frontend profile?",
]

const AiHiring = () => {
  const [question, setQuestion] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const token = localStorage.getItem("token")

  const askQuestion = async (text) => {
    const prompt = (text || question).trim()
    setError("")
    setResult(null)

    if (!prompt) {
      toast.error("Please enter a question")
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        `${API}/api/ai/talenthub-hiring`,
        { question: prompt },
        {
          timeout: 120000,
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const answer = response.data.answer
      const jsonStart = answer.indexOf("{")
      const jsonEnd = answer.lastIndexOf("}")
      const parsed = JSON.parse(answer.slice(jsonStart, jsonEnd + 1))
      setResult(parsed)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to get hiring help. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await askQuestion(question)
  }

  return (
    <>
      <Header />
      <main className="page">
        <h1>AI Hiring Assistant</h1>
        <p>Ask questions about your applicants. Answers use people who applied to your jobs.</p>

        <Link to="/landing">Back to home</Link>

        <form onSubmit={handleSubmit}>
          <label>Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Suggest the top 3 candidates"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </form>

        <p>Try:</p>
        {SUGGESTED_QUESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            disabled={loading}
            onClick={() => {
              setQuestion(item)
              askQuestion(item)
            }}
          >
            {item}
          </button>
        ))}

        {error && <p>{error}</p>}

        {result && (
          <>
            <h2>AI Answer</h2>
            <p>{result.answer}</p>

            {result.topCandidates?.length > 0 && (
              <section className="job-item">
                <h3>Top Candidates</h3>
                <ul>
                  {result.topCandidates.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

export default AiHiring
