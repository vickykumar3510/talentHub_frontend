import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const Header = () => {
    const navigate = useNavigate()
    const role = localStorage.getItem("role")

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        localStorage.removeItem("userId")
        localStorage.removeItem("fullName")
        toast.success("Logged out successfully")
        navigate("/login")
    }

    return(
        <header className="header">
            <h3><Link to='/landing'>Talent Hub</Link></h3>
            {role === "Recruiter" ? (
                <Link to='/landing'>Dashboard</Link>
            ) : (
                <Link to='/'>Jobs</Link>
            )}
            {role === "Applicant" && (
                <>
                    <Link to='/profile'>Profile</Link>
                    <Link to='/savedjobs'>Saved Jobs</Link>
                    <Link to='/appliedjobs'>Applied Jobs</Link>
                    <Link to='/aiinterview'>AI Interview Preparation</Link>
                </>
            )}
            {role === "Recruiter" && (
                <>
                    <Link to='/'>My Jobs</Link>
                    <Link to='/recruiter/profile'>Profile</Link>
                    <Link to='/jobform'>Post a Job</Link>
                    <Link to='/aihiring'>AI Hiring Assistant</Link>
                </>
            )}
            <button type="button" onClick={handleLogout}>Logout</button>
        </header>
    )
}

export default Header
