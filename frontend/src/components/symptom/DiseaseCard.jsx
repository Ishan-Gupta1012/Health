import React, { useState } from 'react';
import apiService from '../../utils/api';
// Assuming you have a generic LoadingSpinner at this path
import LoadingSpinner from '../LoadingSpinner'; 

const DiseaseCard = ({ condition }) => {
  const [advice, setAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetAdvice = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Calls the backend, which then calls Gemini
      const generatedAdvice = await apiService.symptomChecker.getHealthAdvice(condition.common_name);
      setAdvice(generatedAdvice);
    } catch (err) {
      setError('Could not fetch health advice. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const probability = Math.round(condition.probability * 100);

  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:border-white/50 w-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{condition.common_name}</h3>
          <p className="text-sm text-slate-600">{condition.name}</p>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="3"
                />
                <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${probability}, 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                />
            </svg>
           <span className="absolute text-lg font-semibold text-blue-600">{probability}%</span>
        </div>
      </div>
      
      {!advice && !isLoading && (
        <div className="mt-4">
          <button
            onClick={handleGetAdvice}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-300"
          >
            Get Health Advice
          </button>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
      
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {advice && (
        <div className="mt-4 p-4 bg-blue-50/50 border-l-4 border-blue-400 rounded-r-lg animate-fade-in">
          <h4 className="font-semibold text-slate-700 mb-2">Lifestyle Advice:</h4>
          <p className="text-slate-600 whitespace-pre-wrap">{advice}</p>
        </div>
      )}
    </div>
  );
};

export default DiseaseCard;