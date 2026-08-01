import { Link, useNavigate } from "react-router-dom"

const Header = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return(
        <header className="header">
            <h3><Link to='/landing'>Talent Hub</Link></h3>
            <Link to='/profile'>Profile</Link>
            <Link to='/savedjobs'>Saved Jobs</Link>
            <Link to='/appliedjobs'>Applied Jobs</Link>
            <Link to='/aiinterview'>AI Interview Preparation</Link>
            <button type="button" onClick={handleLogout}>Logout</button>
        </header>
    )
}

export default Header
