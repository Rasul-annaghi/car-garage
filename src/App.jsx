import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import AddCar from './pages/AddCar'
import CarDetail from './pages/CarDetail'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-car" element={<ProtectedRoute><AddCar /></ProtectedRoute>} />
        <Route path="/car/:id" element={<ProtectedRoute><CarDetail /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
