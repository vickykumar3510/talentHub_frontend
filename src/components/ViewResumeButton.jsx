import { openResumePdf } from "../utils/openResumePdf"

const ViewResumeButton = ({ resume, label = "View resume" }) => {
  if (!resume) return null

  return (
    <button type="button" className="btn-outline" onClick={() => openResumePdf(resume)}>
      {label}
    </button>
  )
}

export default ViewResumeButton
