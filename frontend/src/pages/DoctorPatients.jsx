import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, User, Clock, HeartPulse, MessageSquare } from 'lucide-react';
import DoctorHeader from '../components/doctor/DoctorHeader';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

// --- Mock Data ---
const mockPatients = [
  { id: 1, name: "Sarah Johnson", age: 28, gender: "Female", image: "https://i.pravatar.cc/150?img=1", lastVisit: "2024-10-20T10:00:00Z", type: "recent" },
  { id: 2, name: "David Miller", age: 45, gender: "Male", image: "https://i.pravatar.cc/150?img=2", lastVisit: "2024-10-18T14:30:00Z", type: "recent" },
  { id: 3, name: "Emily White", age: 34, gender: "Female", image: "https://i.pravatar.cc/150?img=3", lastVisit: "2024-10-15T11:15:00Z", type: "recent" },
  { id: 4, name: "Michael Brown", age: 52, gender: "Male", image: "https://i.pravatar.cc/150?img=4", lastVisit: "2024-09-10T09:00:00Z", type: "chronic" },
  { id: 5, name: "Lisa Anderson", age: 29, gender: "Female", image: "https://i.pravatar.cc/150?img=5", lastVisit: "2024-09-05T16:00:00Z", type: "all" },
  { id: 6, name: "James Wilson", age: 61, gender: "Male", image: "https://i.pravatar.cc/150?img=6", lastVisit: "2024-10-21T08:30:00Z", type: "chronic" },
  { id: 7, name: "Patricia Martinez", age: 40, gender: "Female", image: "https://i.pravatar.cc/150?img=7", lastVisit: "2024-08-15T13:45:00Z", type: "all" },
  { id: 8, name: "Robert Clark", age: 38, gender: "Male", image: "https://i.pravatar.cc/150?img=8", lastVisit: "2024-10-19T10:30:00Z", type: "recent" },
];
// --- End Mock Data ---

const DoctorPatients = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = useMemo(() => {
    return mockPatients
      .filter(patient => {
        // Filter by tab
        if (activeTab === 'recent') {
          // Assuming 'recent' means visited in the last 30 days
          const lastVisit = new Date(patient.lastVisit);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          if (lastVisit < thirtyDaysAgo) return false;
        } else if (activeTab === 'chronic') {
          if (patient.type !== 'chronic') return false;
        }
        // Filter by search term
        if (searchTerm && !patient.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit)); // Sort by most recent visit
  }, [activeTab, searchTerm]);

  if (!user) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="flex min-h-screen text-gray-800">
      <div className="flex-1 flex flex-col">
        <DoctorHeader />

        {/* --- Main Content Area --- */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800">My Patients</h1>

            {/* --- Search and Tabs --- */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:w-1/2 lg:w-1/3">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  // UPDATED: Applied glass-card styles manually
                  className="input w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-full shadow-lg backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black/60"
                />
              </div>
              {/* Tabs */}
              {/* UPDATED: Applied glass-card style to tab container */}
              <div className="flex space-x-2 p-1.5 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full">
                <TabButton name="All Patients" icon={User} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                <TabButton name="Recent" icon={Clock} active={activeTab === 'recent'} onClick={() => setActiveTab('recent')} />
                <TabButton name="Chronic Care" icon={HeartPulse} active={activeTab === 'chronic'} onClick={() => setActiveTab('chronic')} />
              </div>
            </div>

            {/* --- Patient Grid --- */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mt-8"
            >
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient, i) => (
                  <PatientCard key={patient.id} patient={patient} index={i} />
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center py-10">No patients found.</p>
              )}
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const TabButton = ({ name, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all text-sm ${
      active
        ? 'bg-white text-blue-600 shadow-md' // Active tab remains solid white for clarity
        : 'text-black/70 hover:bg-white/40' // Inactive tabs use transparent white
    }`}
  >
    <Icon className="h-4 w-4" />
    <span>{name}</span>
  </button>
);

const PatientCard = ({ patient, index }) => {
  const lastVisit = new Date(patient.lastVisit);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      // UPDATED: Applied glass-card
      className="glass-card p-5 flex flex-col"
    >
      <div className="flex-1">
        <img src={patient.image} alt={patient.name} className="w-24 h-24 rounded-full mx-auto shadow-md border-4 border-white" />
        <h3 className="text-xl font-semibold text-center mt-4 text-gray-800">{patient.name}</h3>
        <p className="text-center text-gray-500 text-sm">{patient.age} Yrs, {patient.gender}</p>
        <p className="text-center text-gray-500 text-sm mt-1">
          Last Visit: {lastVisit.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      <div className="mt-6">
        <Link
          to={`/doctor-patients/${patient.id}`}
          className="w-full block text-center px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md hover:shadow-indigo-300 hover:scale-105 transition-all"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
};

export default DoctorPatients;