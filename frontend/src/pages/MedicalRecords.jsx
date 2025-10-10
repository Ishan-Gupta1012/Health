import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Share2, QrCode } from 'lucide-react';

const MedicalRecords = () => {
  const [records, setRecords] = useState([
    { name: 'Blood Test Results', date: '2024-07-26' },
    { name: 'MRI Scan Report', date: '2024-07-20' },
    { name: 'ECG Analysis', date: '2024-07-15' },
  ]);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-8"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-black">Upload Reports</h1>
                    <p className="text-black/80">Upload your health reports in PDF or image format for analysis and insights.</p>
                </div>

                <div className="border-2 border-dashed border-black/30 rounded-lg p-10 text-center mb-8 bg-white/10">
                    <UploadCloud className="mx-auto h-12 w-12 text-black/50" />
                    <p className="mt-4 text-black">Drag and drop or browse files</p>
                    <p className="text-sm text-black/60">Supported formats: PDF, JPG, PNG</p>
                    <button className="btn-primary mt-4">Browse Files</button>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold text-black mb-4">Uploaded Reports</h2>
                    <div className="space-y-3">
                        {records.map((record, index) => (
                            <div key={index} className="bg-white/20 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-black">{record.name}</p>
                                    <p className="text-sm text-black/60">Uploaded Date: {record.date}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline"><Share2 size={16} /> Share</button>
                                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline"><QrCode size={16} /> QR Code</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
  );
};

export default MedicalRecords;
