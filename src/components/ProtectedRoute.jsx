import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, bootstrapping } = useAuth()

  if (bootstrapping) {
    return <div className="p-10 text-center text-lg">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}