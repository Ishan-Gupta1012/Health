import React from 'react';
import { format } from 'date-fns';
import { User, Calendar, Pill } from 'lucide-react';

const PrescriptionView = ({ prescription }) => {
  if (!prescription) {
    return <p className="text-gray-500">No prescription selected.</p>;
  }

  const prescriptionDate = new Date(prescription.date);

  return (
    <div className="space-y-6">
      {/* Patient Info */}
      <div className="flex items-center space-x-4 pb-4 border-b border-white/20">
        <img
          src={prescription.patientImage}
          alt={prescription.patientName}
          className="w-16 h-16 rounded-full border-2 border-white/50 shadow-md"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <User className="h-5 w-5 mr-2 text-gray-500" />
            {prescription.patientName}
          </h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            Prescribed on: {format(prescriptionDate, 'MMMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Medications List */}
      <div>
        <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
          <Pill className="h-5 w-5 mr-2 text-indigo-500" />
          Medications Prescribed
        </h4>
        <ul className="space-y-3 list-inside">
          {prescription.medications && prescription.medications.length > 0 ? (
            prescription.medications.map((med, index) => (
              <li key={index} className="p-3 bg-white/30 rounded-lg border border-white/40">
                <p className="font-medium text-gray-800">{med.name || med}</p> {/* Handle simple string array */}
                {typeof med === 'object' && ( // Display details if object format is used
                  <p className="text-sm text-gray-600">
                    {med.dosage && `${med.dosage}`}
                    {med.frequency && `, ${med.frequency}`}
                    {med.duration && ` for ${med.duration}`}
                  </p>
                )}
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No specific medications listed.</p>
          )}
        </ul>
      </div>

       {/* Notes (if available) */}
       {prescription.notes && (
        <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">Notes</h4>
            <p className="text-sm text-gray-600 p-3 bg-white/30 rounded-lg border border-white/40 whitespace-pre-wrap">{prescription.notes}</p>
        </div>
       )}

    </div>
  );
};

export default PrescriptionView;