import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Automations from './pages/Automations';
import ConnectedApps from './pages/ConnectedApps';
import ActivityLogs from './pages/ActivityLogs';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import MessageHistory from './pages/MessageHistory';
import BotCustomization from './pages/BotCustomization';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="automations" element={<Automations />} />
          <Route path="apps" element={<ConnectedApps />} />
          <Route path="activity" element={<ActivityLogs />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<MessageHistory />} />
          <Route path="bot-settings" element={<BotCustomization />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
