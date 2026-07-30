import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import JobDetails from './pages/JobDetails.jsx'
import JobForm from './pages/JobForm.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import Signup from './pages/Signup.jsx'
import App from './App.jsx'
import SavedJobs from './pages/SavedJobs.jsx'
import AppliedJobs from './pages/AppliedJobs.jsx'
import {store} from './store/store.js'
import { Provider } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
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
        path: '/jobform',
        element: <JobForm />
      },
      {
        path: '/landing',
        element: <Landing />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/',
        element: <App />
      },
      {
        path: '/savedjobs',
        element: <SavedJobs />
      },
      {
        path: '/appliedjobs',
        element: <AppliedJobs />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
