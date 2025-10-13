import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

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
import PrescriptionAssistant from './pages/PrescriptionAssistant'; // New Import
import MealTracker from './pages/MyMeals/MealTracker';

// Hooks
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

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
              <Route path="/prescription-assistant" element={user ? <PrescriptionAssistant /> : <Navigate to="/signin" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/signin" />} />
              <Route path="/meal-tracker" element={<MealTracker />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
