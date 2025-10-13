import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Share2, Link as LinkIcon, X, Trash2 } from 'lucide-react'; // <-- Import Trash2 icon
import { apiService } from '../utils/api';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [recordType, setRecordType] = useState('');
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');
  const [doctor, setDoctor] = useState('');
  const [file, setFile] = useState(null);
  const [shareableLink, setShareableLink] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRecords = async () => {
    try {
      const response = await apiService.records.getRecords();
      setRecords(response.data.records);
    } catch (error) {
      console.error('Failed to fetch records', error);
      setError('Could not fetch your records. Please try refreshing the page.');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!recordType || !date) {
      setError('Record Type and Date are required.');
      return;
    }

    const formData = new FormData();
    formData.append('recordType', recordType);
    formData.append('date', date);
    formData.append('details', details);
    formData.append('doctor', doctor);
    if (file) {
      formData.append('report', file);
    }

    try {
      await apiService.records.createRecord(formData);
      setRecordType('');
      setDate('');
      setDetails('');
      setDoctor('');
      setFile(null);
      setError('');
      document.getElementById('file-upload').value = null;
      fetchRecords();
    } catch (error) {
      console.error('Failed to add record', error);
      setError('Failed to add the record. Please try again.');
    }
  };

  // --- NEW DELETE HANDLER ---
  const handleDelete = async (recordId) => {
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this medical record? This action cannot be undone.')) {
      try {
        await apiService.records.deleteRecord(recordId);
        // Remove the deleted record from the local state to update the UI instantly
        setRecords(records.filter(record => record.recordId !== recordId));
      } catch (error) {
        console.error('Failed to delete record:', error);
        setError('Failed to delete the record. Please try again.');
      }
    }
  };

  const handleShare = (record) => {
    const link = `${window.location.origin}/view-record/${record.shareableLink}`;
    setShareableLink(link);
    setIsModalOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    alert('Link copied to clipboard!');
  };

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* ... Add New Record Form ... */}
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-bold text-black mb-4">Add New Record</h2>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Record Type (e.g., Blood Test)" className="input" value={recordType} onChange={e => setRecordType(e.target.value)} />
                <input required type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <input type="text" placeholder="Doctor or Clinic" className="input" value={doctor} onChange={e => setDoctor(e.target.value)} />
              <textarea placeholder="Details or Notes" className="input" rows="3" value={details} onChange={e => setDetails(e.target.value)}></textarea>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-black/60 mb-2" />
                <label htmlFor="file-upload" className="cursor-pointer text-blue-500 font-semibold">
                  {file ? file.name : 'Upload Report (PDF, JPG, etc.)'}
                </label>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" className="btn-primary w-full">Add Record</button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-4">Your Records</h2>
            <div className="space-y-4">
              {records.length > 0 ? records.map(record => (
                <div key={record.recordId} className="bg-white/20 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-black">{record.recordType}</p>
                      <p className="text-sm text-black/80">Date: {new Date(record.date).toLocaleDateString()}</p>
                      {record.doctor && <p className="text-sm text-black/80">Doctor: {record.doctor}</p>}
                      {record.details && <p className="text-sm mt-2 text-black/90">{record.details}</p>}
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {record.fileUrl && (
                        <a href={`${backendUrl}${record.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn-secondary p-2">
                          View Report
                        </a>
                      )}
                      <button onClick={() => handleShare(record)} className="p-2 hover:bg-black/10 rounded-full">
                        <Share2 size={20} />
                      </button>
                      {/* --- NEW DELETE BUTTON --- */}
                      <button onClick={() => handleDelete(record.recordId)} className="p-2 text-red-500/70 hover:bg-red-500/10 hover:text-red-600 rounded-full">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )) : <p className="text-center text-black/70">No records found. Add one above to get started.</p>}
            </div>
            {/* ... Modal for sharing link ... */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MedicalRecords;