import { Link } from "react-router-dom"

const Header = () => {
    return(
        <>
        <main>
            <h3><Link to='/'>Talent Hub</Link></h3>
            <Link to='/profile'>Profile</Link>
            <Link to='/savedjobs'>Saved Jobs</Link>
            <Link to='/appliedjobs'>Applied Jobs</Link>
        </main>
        </>
    )
}

export default Header