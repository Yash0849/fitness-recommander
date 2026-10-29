import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './components/NotificationSystem';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import WorkoutPlans from './pages/WorkoutPlans';
import DietTracking from './pages/DietTracking';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Social from './pages/Social';
import VirtualDoctor from './pages/VirtualDoctor';
import ProtectedRoute from './components/ProtectedRoute';
import AIVision from './pages/AIVision';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-transparent">
            <Navigation />
            <main className="px-4 pb-8 pt-4 xl:pl-[308px]">
              <div className="mx-auto max-w-[1680px]">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/workout-plans" element={<WorkoutPlans />} />
                    <Route path="/diet-tracking" element={<DietTracking />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/social" element={<Social />} />
                    <Route path="/virtual-doctor" element={<VirtualDoctor />} />
                    <Route path="/ai-vision" element={<AIVision />} />
                  </Route>
                </Routes>
              </div>
            </main>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
