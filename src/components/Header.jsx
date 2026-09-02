import { Link, NavLink, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const Header = () => {
    const navigate = useNavigate()
    const role = localStorage.getItem("role")
    const fullName = localStorage.getItem("fullName") || "User"
    const initials = fullName.trim().charAt(0).toUpperCase() || "U"

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        localStorage.removeItem("userId")
        localStorage.removeItem("fullName")
        toast.success("Logged out successfully")
        navigate("/login")
    }

    const renderNav = () => (
        <>
            {role === "Recruiter" ? (
                <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to='/landing'>Dashboard</NavLink>
            ) : (
                <NavLink end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to='/'>Jobs</NavLink>
            )}
            {role === "Applicant" && (
                <>
                    <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to='/profile'>Profile</NavLink>
                    <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to='/savedjobs'>Saved Jobs</NavLink>
                    <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to='/appliedjobs'>Applied Jobs</NavLink>
                    <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to='/aiinterview'>AI Interview Preparation</NavLink>
                </>
            )}
            {role === "Recruiter" && (
                <>
                    <NavLink end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to='/'>My Jobs</NavLink>
                    <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to='/recruiter/profile'>Profile</NavLink>
                    <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to='/jobform'>Post a Job</NavLink>
                    <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to='/aihiring'>AI Hiring Assistant</NavLink>
                </>
            )}
        </>
    )

    return(
        <header className="app-header">
            <aside className="sidebar">
                <Link className="sidebar-brand" to='/landing'>
                    <span className="brand-mark">TH</span>
                    TalentHub
                </Link>
                <nav>{renderNav()}</nav>
            </aside>
            <div className="topbar">
                <input type="checkbox" id="nav-toggle" className="nav-toggle" />
                <Link className="topbar-brand" to='/landing'>TalentHub</Link>
                <nav className="topbar-nav">{renderNav()}</nav>
                <div className="topbar-user">
                    <div className="user-chip">
                        <span className="avatar">{initials}</span>
                        <span className="user-name">{fullName}</span>
                    </div>
                    <button type="button" className="btn-outline" onClick={handleLogout}>Logout</button>
                </div>
                <label htmlFor="nav-toggle" className="nav-toggle-btn">
                    <span className="nav-toggle-bar"></span>
                    <span className="nav-toggle-bar"></span>
                    <span className="nav-toggle-bar"></span>
                    <span className="sr-only">Toggle navigation</span>
                </label>
            </div>
        </header>
    )
}

export default Header
