import { Routes, Route, Navigate } from 'react-router-dom'
import RoleSelectPage from './pages/RoleSelectPage'
import BuyerLoginPage from './pages/BuyerLoginPage'
import RealtorLoginPage from './pages/RealtorLoginPage'
import BuyerRegisterPage from './pages/BuyerRegisterPage'
import AgentRegisterPage from './pages/AgentRegisterPage'
import BuyerHomePage from './pages/BuyerHomePage'
import InboxPage from './pages/InboxPage'
import BuyerDetailPage from './pages/BuyerDetailPage'
import ListingsPage from './pages/ListingsPage'
import OutreachPage from './pages/OutreachPage'
import BuyerRecommendationsPage from './pages/BuyerRecommendationsPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectPage />} />
      <Route path="/login/buyer" element={<BuyerLoginPage />} />
      <Route path="/login/realtor" element={<RealtorLoginPage />} />
      <Route path="/register/buyer" element={<BuyerRegisterPage />} />
      <Route path="/register/agent" element={<AgentRegisterPage />} />

      <Route
        path="/buyer/:id/home"
        element={
          <ProtectedRoute allowedRole="buyer">
            <BuyerHomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buyer/:id/recommendations-preview"
        element={
          <ProtectedRoute allowedRole="buyer">
            <BuyerRecommendationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inbox"
        element={
          <ProtectedRoute allowedRole="agent">
            <InboxPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buyer/:id"
        element={
          <ProtectedRoute allowedRole="agent">
            <BuyerDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buyer/:id/listings"
        element={
          <ProtectedRoute allowedRole="agent">
            <ListingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buyer/:id/outreach"
        element={
          <ProtectedRoute allowedRole="agent">
            <OutreachPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}