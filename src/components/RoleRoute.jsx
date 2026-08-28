import { Navigate, Outlet, useLocation } from 'react-router-dom'

const RoleRoute = ({ allowedRole }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RoleRoute
