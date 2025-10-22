import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  FileText,
  Video,
  MessageSquare,
  Phone,
  Activity,
  Clipboard,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import DoctorHeader from '../components/doctor/DoctorHeader';

// Mock Data (Patient Load stat removed)
const mockDoctorData = {
  appointments: [
    { id: 1, name: "Sarah Johnson", purpose: "Routine Checkup", time: "9:00 AM", image: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "David Miller", purpose: "Follow-up", time: "10:30 AM", image: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Emily White", purpose: "Consultation", time: "11:15 AM", image: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Michael Brown", purpose: "Test Results", time: "2:00 PM", image: "https://i.pravatar.cc/150?img=4" },
  ],
  patients: [
    { id: 1, name: "Lisa Anderson", lastVisit: "Oct 18, 2024", image: "https://i.pravatar.cc/150?img=5" },
    { id: 2, name: "James Wilson", lastVisit: "Oct 15, 2024", image: "https://i.pravatar.cc/150?img=6" },
    { id: 3, name: "Patricia Martinez", lastVisit: "Oct 12, 2024", image: "https://i.pravatar.cc/150?img=7" },
    { id: 4, name: "Robert Clark", lastVisit: "Oct 10, 2024", image: "https://i.pravatar.cc/150?img=8" },
  ],
  notifications: [
    { id: 1, type: "urgent", text: "Urgent: Lab report for Sarah Johnson is ready.", time: "10m ago", color: "red" },
    { id: 2, type: "message", text: "New message from David Miller.", time: "45m ago", color: "blue" },
    { id: 3, type: "appointment", text: "Appointment request from Emily White for 3:00 PM.", time: "1h ago", color: "green" },
    { id: 4, type: "report", text: "Radiology report for Lisa Anderson is available.", time: "3h ago", color: "purple" },
  ],
  stats: {
    todayAppointments: 8,
    activePatients: 120,
    pendingReports: 4,
    prescriptions: 22,
  }
};


// --- Main Dashboard Component ---
const DoctorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setData(mockDoctorData);
      setLoading(false);
    }, 1000);
  }, []);

  // Use optional chaining for safer access during initial render
  const doctorFirstName = user?.name?.split(' ')[0] || 'Doctor';

  // Show loading spinner if user data OR mock data isn't ready
  if (loading || !user || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Destructure data after confirming it exists
  const { stats, appointments, patients, notifications } = data;

  return (
    <div className="flex min-h-screen text-gray-800">
      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col">

        {/* --- Top Navbar --- */}
        <DoctorHeader />

        {/* --- Main Dashboard Content Area --- */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto">

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-800">Good Morning, Dr. {doctorFirstName}</h1>
              <p className="text-gray-500 mt-1">Here's a summary of your activities today.</p>
            </motion.div>

            {/* Top Row: Stats (now full width) */}
            <div className="grid grid-cols-1 gap-6 lg:gap-8 mt-6">

              {/* Stats Cards (now span full width) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Today's Appointments"
                  value={stats.todayAppointments}
                  icon={Calendar}
                  color="blue"
                />
                <StatCard
                  title="Active Patients"
                  value={stats.activePatients}
                  icon={Users}
                  color="green"
                />
                <StatCard
                  title="Pending Reports"
                  value={stats.pendingReports}
                  icon={FileText}
                  color="yellow"
                />
                <StatCard
                  title="Prescriptions"
                  value={stats.prescriptions}
                  icon={Clipboard}
                  color="purple"
                />
              </div>
            </div>

            {/* Middle Row: Appointments (Full width) */}
            <div className="grid grid-cols-1 gap-6 lg:gap-8 mt-6">

              {/* Today's Appointments (now full width) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                // UPDATED: Applied glass-card
                className="glass-card p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
                <div className="max-h-96 pr-2 space-y-4 overflow-y-auto">
                  {appointments.map(appt => (
                    // Use a slightly less transparent background for list items inside the card
                    <div key={appt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/30 rounded-xl border border-white/40 gap-3">
                      <div className="flex items-center space-x-3">
                        <img src={appt.image} alt={appt.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-semibold text-gray-800">{appt.name}</p>
                          <p className="text-sm text-gray-600">{appt.purpose} · <span className="font-medium text-blue-600">{appt.time}</span></p>
                        </div>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md hover:shadow-indigo-300 hover:scale-105 transition-all">
                          <Video className="h-4 w-4 mr-1.5" />
                          Join Call
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-600 shadow-md hover:shadow-teal-300 hover:scale-105 transition-all">
                          <MessageSquare className="h-4 w-4 mr-1.5" />
                          Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Row: Patients & Notifications (Unchanged layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">

              {/* My Patients */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                // UPDATED: Applied glass-card
                className="lg:col-span-2 glass-card p-6"
              >
                <h2 className="text-xl font-semibold mb-4">My Patients</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 pr-2 overflow-y-auto">
                  {patients.map(patient => (
                    // Use a slightly less transparent background for list items inside the card
                    <div key={patient.id} className="p-4 bg-white/30 rounded-xl border border-white/40 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={patient.image} alt={patient.name} className="w-12 h-12 rounded-full" />
                        <div>
                          <p className="font-semibold text-gray-800">{patient.name}</p>
                          <p className="text-sm text-gray-600">Last visit: {patient.lastVisit}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-black/10 rounded-full transition-colors">
                          <Phone className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-black/10 rounded-full transition-colors">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                // UPDATED: Applied glass-card
                className="lg:col-span-1 glass-card p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                <div className="max-h-80 pr-2 space-y-4 overflow-y-auto">
                  {notifications.map(notif => (
                    // Use slightly different styling for notifications inside the card
                    <div key={notif.id} className={`flex items-start space-x-3 p-3 rounded-lg bg-${notif.color}-100/30 border border-${notif.color}-200/40`}>
                      <div className={`p-2 rounded-full bg-${notif.color}-100 text-${notif.color}-600`}>
                        {notif.type === 'urgent' && <Activity className="h-4 w-4" />}
                        {notif.type === 'message' && <MessageSquare className="h-4 w-4" />}
                        {notif.type === 'appointment' && <Calendar className="h-4 w-4" />}
                        {notif.type === 'report' && <FileText className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium text-${notif.color}-800`}>{notif.text}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "from-blue-100 to-blue-200/80 text-blue-700",
    green: "from-green-100 to-green-200/80 text-green-700",
    yellow: "from-yellow-100 to-yellow-200/80 text-yellow-700",
    purple: "from-purple-100 to-purple-200/80 text-purple-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      // UPDATED: Applied glass-card
      className="glass-card p-5"
    >
      <div className={`p-3 rounded-full inline-block bg-gradient-to-br ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-gray-500 text-sm font-medium mt-3">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </motion.div>
  );
};

export default DoctorDashboard;