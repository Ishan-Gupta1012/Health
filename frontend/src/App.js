import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SymptomChecker from './pages/SymptomChecker';
import DoctorFinder from './pages/DoctorFinder';
import Profile from './pages/Profile';
import MealTracker from './pages/My/MealTracker';
import MediSagePage from './pages/MediSagePage';
import PrescriptionAssistant from './pages/PrescriptionAssistant'; // Import new page

// --- Doctor Pages ---
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorPatients from './pages/DoctorPatients';
import DoctorPatientProfile from './pages/DoctorPatientProfile';
import DoctorPrescriptions from './pages/DoctorPrescriptions';


// Hooks
import { useAuth } from './hooks/useAuth';

// --- Doctor Layout Routes ---
const doctorRoutes = [
  '/doctor-dashboard',
  '/doctor-appointments',
  '/doctor-patients',
  '/doctor-prescriptions',
];

// Layout component to handle conditional footer
const AppLayout = () => {
  const location = useLocation();

  // --- Doctor Route Handling ---
  const isDoctorRoute = doctorRoutes.some(route => location.pathname.startsWith(route));

  if (isDoctorRoute) {
    return (
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/doctor-dashboard" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor-appointments" element={<ProtectedRoute role="doctor"><DoctorAppointments /></ProtectedRoute>} />
            <Route path="/doctor-patients" element={<ProtectedRoute role="doctor"><DoctorPatients /></ProtectedRoute>} />
            <Route path="/doctor-patients/:patientId" element={<ProtectedRoute role="doctor"><DoctorPatientProfile /></ProtectedRoute>} />
            <Route path="/doctor-prescriptions" element={<ProtectedRoute role="doctor"><DoctorPrescriptions /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
    );
  }

  // --- Patient/Public Route Handling ---
  const showFooter = location.pathname === '/' || location.pathname === '/about' || location.pathname === '/patient-dashboard';

  return (
    <>
      <Header />
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<AuthWrapper><SignIn /></AuthWrapper>} />

            {/* Shared Services */}
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/doctor-finder" element={<DoctorFinder />} />
            <Route path="/medisage" element={<MediSagePage />} />

            {/* General Protected Route (No specific role needed) */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Patient Protected Routes */}
            <Route path="/my-meals" element={<ProtectedRoute role="patient"><MealTracker /></ProtectedRoute>} />
            <Route path="/patient-dashboard" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
            {/* ADDED: Route for Prescription Assistant */}
            <Route path="/prescription-assistant" element={<ProtectedRoute role="patient"><PrescriptionAssistant /></ProtectedRoute>} />

            {/* Fallback for any doctor routes accidentally missed (should not be hit) */}
            <Route path="/doctor-dashboard" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
    </>
  );
};

// Helper components (Your existing components)
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} />;
  }

  return children;
};

const AuthWrapper = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      );
    }

    return user ? <Navigate to="/" /> : children;
};

// Placeholder component (Your existing placeholder)
import DoctorHeader from './components/doctor/DoctorHeader';
const DoctorPlaceholderPage = ({ title }) => (
  <div className="flex min-h-screen text-gray-800">
    <div className="flex-1 flex flex-col">
      <DoctorHeader />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="mt-4 text-gray-600">This page is under construction.</p>
      </main>
    </div>
  </div>
);


// App function (Your existing function)
function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <AppLayout />
      </div>
    </Router>
  );
}

export default App;