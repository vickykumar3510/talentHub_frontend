import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import JobDetails from './pages/JobDetails.jsx'
import JobForm from './pages/JobForm.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import RecruiterProfile from './pages/RecruiterProfile.jsx'
import Signup from './pages/Signup.jsx'
import Register from './pages/Register.jsx'
import App from './App.jsx'
import SavedJobs from './pages/SavedJobs.jsx'
import AppliedJobs from './pages/AppliedJobs.jsx'
import AiInterview from './pages/AiInterview.jsx'
import AiHiring from './pages/AiHiring.jsx'
import Applicants from './pages/Applicants.jsx'
import {store} from './store/store.js'
import { Provider } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleRoute from './components/RoleRoute.jsx'
import { Toaster } from 'react-hot-toast'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Register />
  },
  {
    path: '/signup/:role',
    element: <Signup />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/jobdetails/:id',
        element: <JobDetails />
      },
      {
        path: '/landing',
        element: <Landing />
      },
      {
        path: '/',
        element: <App />
      },
      {
        element: <RoleRoute allowedRole="Recruiter" />,
        children: [
          {
            path: '/recruiter/profile',
            element: <RecruiterProfile />
          },
          {
            path: '/jobform',
            element: <JobForm />
          },
          {
            path: '/jobform/:id',
            element: <JobForm />
          },
          {
            path: '/applicants/:jobId',
            element: <Applicants />
          },
          {
            path: '/aihiring',
            element: <AiHiring />
          }
        ]
      },
      {
        element: <RoleRoute allowedRole="Applicant" />,
        children: [
          {
            path: '/profile',
            element: <Profile />
          },
          {
            path: '/savedjobs',
            element: <SavedJobs />
          },
          {
            path: '/appliedjobs',
            element: <AppliedJobs />
          },
          {
            path: "/aiinterview",
            element: <AiInterview />
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
