import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Video,
  FileText,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';
import { format, addDays, isToday, isSameDay, startOfToday } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import DoctorHeader from '../components/doctor/DoctorHeader';
import LoadingSpinner from '../components/LoadingSpinner';

// --- Mock Data ---
const today = startOfToday();
const mockAppointments = [
  // Today's Appointments
  { id: 1, date: today, time: "9:00 AM - 9:30 AM", status: "upcoming", patient: { name: "Sarah Johnson", age: 28, image: "https://i.pravatar.cc/150?img=1" }, purpose: "Routine Checkup" },
  { id: 2, date: today, time: "10:30 AM - 11:00 AM", status: "upcoming", patient: { name: "David Miller", age: 45, image: "https://i.pravatar.cc/150?img=2" }, purpose: "Follow-up" },
  { id: 3, date: today, time: "1:00 PM - 1:30 PM", status: "upcoming", patient: { name: "Emily White", age: 34, image: "https://i.pravatar.cc/150?img=3" }, purpose: "Consultation" },
  // Yesterday's (Completed)
  { id: 4, date: addDays(today, -1), time: "11:00 AM - 11:30 AM", status: "completed", patient: { name: "Michael Brown", age: 52, image: "https://i.pravatar.cc/150?img=4" }, purpose: "Test Results" },
  // Tomorrow's
  { id: 5, date: addDays(today, 1), time: "9:30 AM - 10:00 AM", status: "upcoming", patient: { name: "Lisa Anderson", age: 29, image: "https://i.pravatar.cc/150?img=5" }, purpose: "Initial Consultation" },
  { id: 6, date: addDays(today, 1), time: "11:00 AM - 11:30 AM", status: "upcoming", patient: { name: "James Wilson", age: 61, image: "https://i.pravatar.cc/150?img=6" }, purpose: "Medication Review" },
  // Cancelled
  { id: 7, date: today, time: "4:00 PM - 4:30 PM", status: "cancelled", patient: { name: "Patricia Martinez", age: 40, image: "https://i.pravatar.cc/150?img=7" }, purpose: "Headache" },
  { id: 8, date: addDays(today, -1), time: "2:00 PM - 2:30 PM", status: "completed", patient: { name: "Robert Clark", age: 38, image: "https://i.pravatar.cc/150?img=8" }, purpose: "Injury Follow-up" },
];
// --- End Mock Data ---

// --- Date Scroller Component ---
const DateScroller = ({ selectedDate, setSelectedDate }) => {
  const [startDate, setStartDate] = useState(startOfToday());

  const dates = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  }, [startDate]);

  const shiftDates = (amount) => {
    setStartDate(prev => addDays(prev, amount));
  };

  const getDayLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isSameDay(date, addDays(today, 1))) return 'Tomorrow';
    return format(date, 'E'); // Mon, Tue
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => shiftDates(-1)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>
      <div className="flex-1 flex items-center justify-between space-x-2 overflow-x-auto">
        {dates.map(date => (
          <button
            key={date.toString()}
            onClick={() => setSelectedDate(date)}
            // Use glass-card style for non-selected dates
            className={`flex-1 min-w-[100px] p-3 rounded-lg text-center transition-all ${
              isSameDay(date, selectedDate)
                ? 'bg-blue-600 text-white shadow-lg'
                : 'glass-card hover:bg-white/30' // Applied glass-card here
            }`}
          >
            <p className="text-sm font-medium">{getDayLabel(date)}</p>
            <p className={`font-bold ${isSameDay(date, selectedDate) ? 'text-white' : 'text-gray-800'}`}>
              {format(date, 'MMM d')}
            </p>
          </button>
        ))}
      </div>
      <button onClick={() => shiftDates(1)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
};

// --- Main Appointments Page Component ---
const DoctorAppointments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState(startOfToday());

  // Filter appointments based on tab and date
  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter(appt => {
      const isSameDate = isSameDay(appt.date, selectedDate);
      if (activeTab === 'upcoming') {
        return appt.status === 'upcoming' && isSameDate;
      }
      return appt.status === activeTab;
    }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort them
  }, [activeTab, selectedDate]);

  // Calculate stats
  const stats = useMemo(() => ({
    total: mockAppointments.filter(a => isSameDay(a.date, today)).length,
    completed: mockAppointments.filter(a => a.status === 'completed' && isSameDay(a.date, today)).length,
    cancelled: mockAppointments.filter(a => a.status === 'cancelled' && isSameDay(a.date, today)).length,
  }), []);

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
            <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>

            {/* --- Tabs --- */}
            <div className="mt-4 border-b border-gray-300/50">
              <nav className="flex space-x-6">
                <TabButton name="Upcoming" icon={Calendar} active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')} />
                <TabButton name="Completed" icon={CheckCircle} active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} />
                <TabButton name="Cancelled" icon={XCircle} active={activeTab === 'cancelled'} onClick={() => setActiveTab('cancelled')} />
              </nav>
            </div>

            {/* --- Content Grid (Main + Sidebar) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">

              {/* Main Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Date Scroller (Only for 'Upcoming' tab) */}
                {activeTab === 'upcoming' && (
                  <DateScroller selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                )}

                {/* Appointment List */}
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold text-gray-700">
                    {activeTab === 'upcoming'
                      ? `Appointments for ${format(selectedDate, 'MMMM d, yyyy')}`
                      : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Appointments`
                    }
                  </h2>

                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appt => (
                      <AppointmentCard key={appt.id} appt={appt} />
                    ))
                  ) : (
                    // UPDATED: Applied glass-card
                    <div className="text-center py-10 glass-card p-6">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="mt-4 font-medium text-gray-600">No {activeTab} appointments found{activeTab === 'upcoming' && ` for this day`}.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Sidebar Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-1 space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-700">Today's Summary</h2>
                <AppointmentStatCard title="Total Appointments" value={stats.total} icon={Calendar} color="blue" />
                <AppointmentStatCard title="Completed" value={stats.completed} icon={CheckCircle} color="green" />
                <AppointmentStatCard title="Cancelled" value={stats.cancelled} icon={XCircle} color="red" />
              </motion.div>
            </div>
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
    className={`flex items-center space-x-2 px-1 py-3 border-b-2 font-medium transition-colors ${
      active
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-blue-600'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{name}</span>
  </button>
);

const AppointmentCard = ({ appt }) => (
  <div className="flex items-center space-x-4">
    <div className="w-24 text-center">
      <p className="text-sm font-semibold text-blue-600">{appt.time.split(' - ')[0]}</p>
      <p className="text-xs text-gray-500">to {appt.time.split(' - ')[1]}</p>
      {appt.status !== 'upcoming' && (
        <p className="text-xs text-gray-500 mt-1">{format(appt.date, 'MMM d')}</p>
      )}
    </div>
    {/* Applied .glass-card */}
    <div className="flex-1 glass-card p-4 rounded-xl">
      <div className="flex justify-between items-center">
        {/* Patient Info */}
        <div className="flex items-center space-x-3">
          <img src={appt.patient.image} alt={appt.patient.name} className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-semibold text-gray-800">{appt.patient.name}</p>
            <p className="text-sm text-gray-600">{appt.patient.age} Yrs · {appt.purpose}</p>
          </div>
        </div>

        {/* Actions */}
        {appt.status === 'upcoming' && (
          <div className="flex space-x-3">
            <button className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md hover:shadow-indigo-300 hover:scale-105 transition-all">
              <Video className="h-4 w-4 inline mr-1.5" />
              Join Call
            </button>
            {/* Slightly updated button style */}
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white/40 text-gray-700 border border-white/50 hover:bg-white/60 transition-colors">
              <FileText className="h-4 w-4 inline mr-1.5" />
              View Details
            </button>
          </div>
        )}
        {/* Use slightly transparent badges */}
        {appt.status === 'completed' && (
          <span className="text-sm font-medium text-green-700 bg-green-100/40 px-3 py-1 rounded-full border border-green-200/50">Completed</span>
        )}
        {appt.status === 'cancelled' && (
          <span className="text-sm font-medium text-red-700 bg-red-100/40 px-3 py-1 rounded-full border border-red-200/50">Cancelled</span>
        )}
      </div>
    </div>
  </div>
);

const AppointmentStatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-100/80 text-blue-700",
    green: "bg-green-100/80 text-green-700",
    red: "bg-red-100/80 text-red-700",
  };
  return (
    // UPDATED: Applied glass-card
    <div className="glass-card p-5 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default DoctorAppointments;