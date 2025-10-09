import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SymptomChecker from './pages/SymptomChecker';
import DoctorFinder from './pages/DoctorFinder';
import MedicineReminders from './pages/MedicineReminders';
import MedicalRecords from './pages/MedicalRecords';
import Profile from './pages/Profile';

// Hooks
import useAuthHook from './hooks/useAuth';

// Utils
import { checkBackendHealth } from './utils/api';

function App() {
  const { user, loading: authLoading } = useAuthHook();
  const [backendStatus, setBackendStatus] = useState('checking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await checkBackendHealth();
        setBackendStatus('connected');
      } catch (error) {
        console.error('Backend connection failed:', error);
        setBackendStatus('disconnected');
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (backendStatus === 'disconnected') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 glass-card">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Backend Connection Failed</h1>
          <p className="text-white/80 mb-4">
            Unable to connect to the HealthNest backend server.
          </p>
          <p className="text-sm text-white/70">
            Please ensure the backend server is running on port 8001
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 btn-primary"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={user ? <Navigate to="/" /> : <SignIn />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/doctor-finder" element={<DoctorFinder />} />
              <Route path="/medicine-reminders" element={user ? <MedicineReminders /> : <Navigate to="/signin" />} />
              <Route path="/medical-records" element={user ? <MedicalRecords /> : <Navigate to="/signin" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/signin" />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;