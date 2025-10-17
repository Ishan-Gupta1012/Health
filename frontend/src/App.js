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
import MedicalRecords from './pages/MedicalRecords';
import Profile from './pages/Profile';
import MealTracker from './pages/My/MealTracker'; 
import MediSagePage from './pages/MediSagePage';

// Hooks
import { useAuth } from './hooks/useAuth';

// Layout component to handle conditional footer
const AppLayout = () => {
  const location = useLocation();
  const showFooter = location.pathname === '/' || location.pathname === '/about';

  return (
    <>
      <Header />
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} /> {/* Add the new route for About */}
            <Route path="/signin" element={<AuthWrapper><SignIn /></AuthWrapper>} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/doctor-finder" element={<DoctorFinder />} />
            <Route path="/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/my-meals" element={<ProtectedRoute><MealTracker /></ProtectedRoute>} />
            <Route path="/medisage" element={<MediSagePage />} />
          </Routes>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
    </>
  );
};

// Helper components
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
};

const AuthWrapper = ({ children }) => {
    const { user } = useAuth();
    return user ? <Navigate to="/" /> : children;
};

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