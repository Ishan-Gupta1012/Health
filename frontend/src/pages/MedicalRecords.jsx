import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Plus } from 'lucide-react';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Medical Records</h1>
          <p className="text-xl text-gray-600">Securely store and share your health documents</p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Medical Records</h2>
            <button className="btn-primary" data-testid="upload-record-btn">
              <Upload className="h-4 w-4 mr-2" />
              Upload Record
            </button>
          </div>

          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No medical records uploaded yet</p>
            <p className="text-sm">Upload your first medical document to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;