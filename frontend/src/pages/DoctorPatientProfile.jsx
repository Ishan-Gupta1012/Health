import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Calendar, FileText, ChevronRight, Droplet, Activity, Zap, CheckCircle, Clock } from 'lucide-react';
import DoctorHeader from '../components/doctor/DoctorHeader';
import LoadingSpinner from '../components/LoadingSpinner';

// --- Mock Data ---
// In a real app, you'd fetch this by ID
const mockPatientDetails = {
  id: 1,
  name: "Sarah Johnson",
  age: 28,
  gender: "Female",
  image: "https://i.pravatar.cc/150?img=1",
  email: "sarah.johnson@example.com",
  phone: "+1 234-567-890",
  address: "123 Health St, Wellness City",
  vitals: {
    weight: "65 kg",
    height: "170 cm",
    bmi: "22.5",
    bloodPressure: "120/80 mmHg"
  },
  upcomingAppointments: [
    { id: 1, date: "2024-11-05T10:00:00Z", purpose: "Follow-up Consultation" },
    { id: 2, date: "2024-11-20T14:00:00Z", purpose: "Annual Checkup" }
  ],
  medicalHistory: [
    { id: 1, date: "2024-05-10", title: "Diagnosed with Type 2 Diabetes", description: "Fasting blood sugar 130 mg/dL. Prescribed Metformin." },
    { id: 2, date: "2024-01-15", title: "Annual Checkup", description: "All vitals normal. Routine blood work ordered." },
    { id: 3, date: "2023-08-22", title: "Treated for Seasonal Allergies", description: "Prescribed antihistamines." }
  ],
  labReports: [
    { id: 1, name: "Full Blood Count (FBC)", date: "2024-10-20", status: "Ready" },
    { id: 2, name: "Lipid Profile", date: "2024-10-20", status: "Ready" },
    { id: 3, name: "HbA1c", date: "2024-10-15", status: "Pending" }
  ],
  medications: [
    { id: 1, name: "Metformin", dosage: "500mg, Twice Daily" },
    { id: 2, name: "Atorvastatin", dosage: "20mg, Once Daily" },
    { id: 3, name: "Loratadine", dosage: "10mg, As Needed" }
  ]
};
// --- End Mock Data ---

const DoctorPatientProfile = () => {
  let { patientId } = useParams();
  // In a real app, you would fetch this data using patientId
  // For now, we use mock data.
  const patient = mockPatientDetails;

  if (!patient) {
    return (
      <div className="flex min-h-screen text-gray-800">
        <div className="flex-1 flex flex-col">
          <DoctorHeader />
          <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <p className="text-gray-600 text-lg">Patient not found.</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen text-gray-800">
      <div className="flex-1 flex flex-col">
        <DoctorHeader />

        {/* --- Main Content Area --- */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto">

            {/* --- Top Row: Profile, Vitals, Appointments --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                // UPDATED: Applied glass-card
                className="lg:col-span-1 glass-card p-6"
              >
                <img src={patient.image} alt={patient.name} className="w-32 h-32 rounded-full mx-auto shadow-lg border-4 border-white -mt-16" />
                <h2 className="text-2xl font-bold text-center mt-4 text-gray-800">{patient.name}</h2>
                <p className="text-center text-gray-500">{patient.age} Yrs, {patient.gender}</p>

                <div className="mt-6 space-y-3">
                  <InfoRow icon={Phone} text={patient.phone} />
                  <InfoRow icon={Mail} text={patient.email} />
                  <InfoRow icon={MapPin} text={patient.address} />
                </div>

                <button className="w-full mt-6 px-4 py-3 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md hover:shadow-indigo-300 hover:scale-105 transition-all">
                  View Full Medical History
                </button>
              </motion.div>

              {/* Vitals & Appointments */}
              <div className="lg:col-span-2 space-y-6">

                {/* Vitals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  // UPDATED: Applied glass-card
                  className="glass-card p-6"
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Vitals</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <VitalCard icon={Activity} label="Weight" value={patient.vitals.weight} color="blue" />
                    <VitalCard icon={Zap} label="Height" value={patient.vitals.height} color="green" />
                    <VitalCard icon={Zap} label="BMI" value={patient.vitals.bmi} color="yellow" />
                    <VitalCard icon={Droplet} label="Blood Pressure" value={patient.vitals.bloodPressure} color="red" />
                  </div>
                </motion.div>

                {/* Upcoming Appointments */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  // UPDATED: Applied glass-card
                  className="glass-card p-6"
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Appointments</h3>
                  <div className="space-y-3">
                    {patient.upcomingAppointments.map(appt => (
                      <AppointmentRow key={appt.id} appt={appt} />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* --- Bottom Row: History, Reports, Meds --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">

              {/* Medical History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                // UPDATED: Applied glass-card
                className="lg:col-span-1 glass-card p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Medical History</h3>
                <div className="relative space-y-6 before:absolute before:left-3 before:top-3 before:h-[calc(100%-1.5rem)] before:w-0.5 before:bg-gray-200/50">
                  {patient.medicalHistory.map(item => (
                    <HistoryItem key={item.id} item={item} />
                  ))}
                </div>
              </motion.div>

              {/* Lab Reports & Meds */}
              <div className="lg:col-span-2 space-y-6">

                {/* Lab Reports */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  // UPDATED: Applied glass-card
                  className="glass-card p-6"
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Lab Reports</h3>
                  <div className="space-y-3">
                    {patient.labReports.map(report => (
                      <LabReportRow key={report.id} report={report} />
                    ))}
                  </div>
                </motion.div>

                {/* Medications */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  // UPDATED: Applied glass-card
                  className="glass-card p-6"
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Medications</h3>
                  <div className="space-y-3">
                    {patient.medications.map(med => (
                      <div key={med.id} className="p-3 bg-white/30 rounded-lg border border-white/40">
                        <p className="font-semibold text-gray-700">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.dosage}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// --- Sub-Components for Profile Page ---

const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center text-sm">
    <Icon className="h-4 w-4 text-gray-500 mr-3 flex-shrink-0" />
    <span className="text-gray-700">{text}</span>
  </div>
);

const VitalCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-100/50 text-blue-600",
    green: "bg-green-100/50 text-green-600",
    yellow: "bg-yellow-100/50 text-yellow-600",
    red: "bg-red-100/50 text-red-600",
  };
  return (
    <div className={`p-4 rounded-lg flex items-center space-x-3 ${colors[color]}`}>
      <Icon className="h-6 w-6" />
      <div>
        <p className="text-xs font-medium uppercase opacity-80">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
};

const AppointmentRow = ({ appt }) => {
  const date = new Date(appt.date);
  return (
    // Use slightly less transparent background for list items
    <div className="flex items-center justify-between p-4 bg-white/30 rounded-lg border border-white/40">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-blue-100/50 rounded-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-700">{appt.purpose}</p>
          <p className="text-sm text-gray-600">
            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </div>
  );
};

const HistoryItem = ({ item }) => (
  <div className="relative pl-8">
    <div className="absolute left-0 top-1.5 h-5 w-5 bg-blue-500 rounded-full border-4 border-white"></div>
    <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
    <p className="font-semibold text-gray-700">{item.title}</p>
    <p className="text-sm text-gray-600">{item.description}</p>
  </div>
);

const LabReportRow = ({ report }) => (
  // Use slightly less transparent background for list items
  <div className="flex items-center justify-between p-4 bg-white/30 rounded-lg border border-white/40">
    <div className="flex items-center space-x-3">
      <div className="p-3 bg-indigo-100/50 rounded-lg">
        <FileText className="h-5 w-5 text-indigo-600" />
      </div>
      <div>
        <p className="font-semibold text-gray-700">{report.name}</p>
        <p className="text-sm text-gray-500">
          {report.status === 'Ready' ? (
            <span className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1.5" />
              Ready - {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          ) : (
            <span className="flex items-center text-yellow-600">
              <Clock className="h-4 w-4 mr-1.5" />
              Pending - {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </p>
      </div>
    </div>
    {report.status === 'Ready' && (
      // Use slightly different button style for glass background
      <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-white/40 text-gray-700 hover:bg-white/60 border border-white/30 transition-colors">
        View Report
      </button>
    )}
  </div>
);


export default DoctorPatientProfile;