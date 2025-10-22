import React, { useState } from 'react';
import { PlusCircle, Trash2, Send } from 'lucide-react';

// Mock data for patient dropdown and medication suggestions
const mockPatients = [
  { id: 1, name: "Sarah Johnson" },
  { id: 2, name: "David Miller" },
  { id: 3, name: "Emily White" },
  { id: 6, name: "James Wilson" },
  { id: 7, name: "Patricia Martinez" },
  { id: 8, name: "Robert Clark" },
];

const mockMedications = [
  "Metformin 500mg",
  "Atorvastatin 20mg",
  "Lisinopril 10mg",
  "Amoxicillin 500mg",
  "Ibuprofen 200mg",
  "Simvastatin 40mg",
  "Aspirin 81mg",
  "Albuterol Inhaler",
  "Hydrochlorothiazide 25mg",
  "Paracetamol 500mg",
];

const PrescriptionForm = ({ onClose }) => {
  const [patientId, setPatientId] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
  const [notes, setNotes] = useState('');
  const [medicationSuggestions, setMedicationSuggestions] = useState([]);

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);

    // Basic suggestion logic
    if (field === 'name' && value.length > 1) {
      setMedicationSuggestions(
        mockMedications.filter(med => med.toLowerCase().includes(value.toLowerCase())).slice(0, 5) // Limit suggestions
      );
    } else {
      setMedicationSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (index, suggestion) => {
    handleMedicationChange(index, 'name', suggestion);
    setMedicationSuggestions([]); // Clear suggestions after selection
  }

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedication = (index) => {
    if (medications.length > 1) { // Keep at least one medication row
      const newMedications = medications.filter((_, i) => i !== index);
      setMedications(newMedications);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send the data to the backend API
    console.log({
      patientId,
      medications,
      notes,
    });
    onClose(); // Close modal after submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Selection */}
      <div>
        <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
          Select Patient
        </label>
        <select
          id="patient"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
          className="input w-full bg-white/50 border border-white/50 focus:ring-blue-500" // Added background for better visibility in modal
        >
          <option value="" disabled>-- Select a patient --</option>
          {mockPatients.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Medications Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Medications</h3>
        <div className="space-y-4">
          {medications.map((med, index) => (
            <div key={index} className="p-4 bg-white/30 border border-white/40 rounded-lg relative">
              {/* Medication Name with Suggestions */}
              <div className="relative mb-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Medication Name</label>
                <input
                  type="text"
                  placeholder="e.g., Paracetamol 500mg"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  required
                  className="input text-sm w-full bg-white/70 border border-white/50 focus:ring-blue-500"
                />
                {medicationSuggestions.length > 0 && med.name && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {medicationSuggestions.map((suggestion, sIndex) => (
                       <li 
                         key={sIndex} 
                         onClick={() => handleSuggestionClick(index, suggestion)}
                         className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                       >
                         {suggestion}
                       </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Dosage, Frequency, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g., 1 tablet"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    required
                    className="input text-sm w-full bg-white/70 border border-white/50 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                  <input
                    type="text"
                    placeholder="e.g., Twice daily"
                    value={med.frequency}
                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                    required
                    className="input text-sm w-full bg-white/70 border border-white/50 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 7 days"
                    value={med.duration}
                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                    required
                    className="input text-sm w-full bg-white/70 border border-white/50 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Remove Button */}
              {medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="absolute top-2 right-2 p-1.5 rounded-full text-red-500 hover:bg-red-100/50 transition-colors"
                  title="Remove Medication"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {/* Add Medication Button */}
          <button
            type="button"
            onClick={addMedication}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-blue-600 bg-blue-100/50 hover:bg-blue-200/50 transition-colors border border-blue-200/50"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Another Medication</span>
          </button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes (Optional)
        </label>
        <textarea
          id="notes"
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Take with food. Avoid alcohol."
          className="input w-full bg-white/50 border border-white/50 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-white/20 flex justify-end">
        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-600 shadow-md hover:shadow-teal-300 hover:scale-105 transition-all"
        >
          <Send className="h-4 w-4" />
          <span>Save Prescription</span>
        </button>
      </div>
    </form>
  );
};

export default PrescriptionForm;