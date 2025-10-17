import React, { useState } from 'react';
import axios from 'axios';
import MediSageUpload from '../components/medisage/MediSageUpload';
import MediSageResults from '../components/medisage/MediSageResults';

const MediSagePage = () => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisType, setAnalysisType] = useState(''); // To pass to results component

  const handleAnalyze = async (file, type) => {
    setIsLoading(true);
    setError('');
    setResults(null);
    setAnalysisType(type);

    const formData = new FormData();
    // The key ('image' or 'report') must match what Multer expects on the backend
    const fieldName = type === 'image' ? 'image' : 'report';
    formData.append(fieldName, file);

    const endpoint = type === 'image' ? '/api/medisage/analyze-image' : '/api/medisage/analyze-report';
    
    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError('');
    setAnalysisType('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full">
        {error && (
          <div className="max-w-2xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {!results ? (
          <MediSageUpload onAnalyze={handleAnalyze} isLoading={isLoading} />
        ) : (
          <MediSageResults results={results} analysisType={analysisType} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default MediSagePage;