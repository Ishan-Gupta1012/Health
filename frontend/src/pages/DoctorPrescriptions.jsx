import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Eye } from 'lucide-react'; // Removed FileText, Clock, CheckCircle
import DoctorHeader from '../components/doctor/DoctorHeader';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import Modal from '../components/Modal';
import PrescriptionForm from '../components/doctor/PrescriptionForm';
import PrescriptionView from '../components/doctor/PrescriptionView';

// --- Mock Data ---
const mockPrescriptions = [
    { id: 1, patientName: "Sarah Johnson", patientImage: "https://i.pravatar.cc/150?img=1", date: "2024-10-21T10:00:00Z", medications: [{name: "Metformin", dosage:"500mg", frequency:"Twice Daily", duration:"Ongoing"}, {name:"Atorvastatin", dosage:"20mg", frequency:"Once Daily", duration:"Ongoing"}], notes: "Take Metformin with meals. Follow up in 3 months." },
    { id: 2, patientName: "David Miller", patientImage: "https://i.pravatar.cc/150?img=2", date: "2024-10-20T14:30:00Z", medications: [{name:"Lisinopril", dosage:"10mg", frequency:"Once Daily", duration:"Ongoing"}] },
    { id: 3, patientName: "Emily White", patientImage: "https://i.pravatar.cc/150?img=3", date: "2024-10-19T11:15:00Z", medications: [{name:"Amoxicillin", dosage:"500mg", frequency:"Every 8 hours", duration:"7 days"}, {name:"Ibuprofen", dosage:"200mg", frequency:"As needed for pain", duration:"-"}] },
    { id: 4, patientName: "James Wilson", patientImage: "https://i.pravatar.cc/150?img=6", date: "2024-10-18T09:00:00Z", medications: [{name:"Simvastatin", dosage:"40mg", frequency:"Once Daily at bedtime", duration:"Ongoing"}, {name:"Aspirin", dosage:"81mg", frequency:"Once Daily", duration:"Ongoing"}] },
    { id: 5, patientName: "Patricia Martinez", patientImage: "https://i.pravatar.cc/150?img=7", date: "2024-10-17T16:00:00Z", medications: [{name:"Albuterol Inhaler", dosage:"2 puffs", frequency:"Every 4-6 hours as needed for shortness of breath", duration:"-"}] , notes:"Use spacer device if possible."},
    { id: 6, patientName: "Robert Clark", patientImage: "https://i.pravatar.cc/150?img=8", date: "2024-10-16T10:30:00Z", medications: [{name:"Hydrochlorothiazide", dosage:"25mg", frequency:"Once Daily in morning", duration:"Ongoing"}] },
];
// --- End Mock Data ---

const DoctorPrescriptions = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    const filteredPrescriptions = useMemo(() => {
        return mockPrescriptions
            .filter(prescription => {
                if (searchTerm && !prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [searchTerm]);

    const handleViewClick = (prescription) => {
        setSelectedPrescription(prescription);
        setIsViewModalOpen(true);
    };

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
                        {/* Header: Title and Create Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">Prescriptions</h1>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md hover:shadow-indigo-300 hover:scale-105 transition-all"
                            >
                                <PlusCircle className="h-4 w-4" />
                                <span>Create New Prescription</span>
                            </button>
                        </div>

                        {/* --- Search Bar --- */}
                        <div className="mt-6 mb-6">
                            {/* UPDATED: Added Search icon inside the input wrapper */}
                            <div className="relative w-full md:w-1/2 lg:w-1/3">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" /> {/* Added Icon */}
                                <input
                                    type="text"
                                    placeholder="Search by patient name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    // Added pl-12 for icon spacing
                                    className="input w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-full shadow-lg backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black/60"
                                />
                            </div>
                        </div>

                        {/* --- Prescriptions Table --- */}
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="glass-card overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/20">
                                    <thead className="bg-white/10">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">Patient Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">Medications</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {filteredPrescriptions.length > 0 ? (
                                            filteredPrescriptions.map((prescription, index) => (
                                                <PrescriptionRow
                                                    key={prescription.id}
                                                    prescription={prescription}
                                                    index={index}
                                                    onViewClick={handleViewClick}
                                                />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-500">
                                                    No prescriptions found matching your criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                    </div>
                </main>

                {/* --- Prescription Creation Modal --- */}
                <Modal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Create New Prescription"
                >
                    <PrescriptionForm onClose={() => setIsCreateModalOpen(false)} />
                </Modal>

                {/* --- Prescription View Modal --- */}
                <Modal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    title="View Prescription Details"
                >
                    <PrescriptionView prescription={selectedPrescription} />
                </Modal>

            </div>
        </div>
    );
};

// --- Sub-Components ---
const PrescriptionRow = ({ prescription, index, onViewClick }) => {

    return (
        <motion.tr
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="hover:bg-white/10 transition-colors"
        >
            {/* Patient Name */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={prescription.patientImage} alt={prescription.patientName} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{prescription.patientName}</div>
                    </div>
                </div>
            </td>
            {/* Date */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(prescription.date), 'MMM d, yyyy')}
            </td>
            {/* Medications Summary */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {prescription.medications && prescription.medications.length > 0
                    ? `${prescription.medications[0].name || prescription.medications[0]}${prescription.medications.length > 1 ? ` + ${prescription.medications.length - 1} more` : ''}`
                    : 'N/A'}
            </td>
            {/* Action Button */}
            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                <button
                    onClick={() => onViewClick(prescription)}
                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                >
                    <Eye className="h-4 w-4 mr-1" /> View
                </button>
            </td>
        </motion.tr>
    );
};


export default DoctorPrescriptions;