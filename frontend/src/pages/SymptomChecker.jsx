import React, { useState, useCallback } from 'react';
import SymptomForm from '../components/symptom/SymptomForm';
import ResultsDisplay from '../components/symptom/ResultsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService from '../utils/api';
// Assuming a simple ErrorMessage component or using a simple div
const ErrorMessage = ({ message }) => (
    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mt-4" role="alert">
        <p className="font-bold">Error</p>
        <p className="text-sm">{message}</p>
    </div>
);

const WaveBackground = () => (
  <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-200 to-transparent"></div>
    <div 
      className="absolute top-0 -left-1/4 w-[150%] h-[150%] opacity-50"
      style={{
        background: 'radial-gradient(circle at 20% 20%, rgba(147, 197, 253, 0.4) 0%, rgba(147, 197, 253, 0) 40%)'
      }}
    ></div>
    <div 
      className="absolute bottom-0 -right-1/4 w-[150%] h-[150%] opacity-50"
      style={{
        background: 'radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 40%)'
      }}
    ></div>
  </div>
);


const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState(''); // Use empty string for initial state for the input field
  const [sex, setSex] = useState('male');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conditions, setConditions] = useState(null);

  const handleCheckSymptoms = useCallback(async (e) => {
    e.preventDefault();
    const numericAge = parseInt(age);
    if (!symptoms || age === '' || isNaN(numericAge) || numericAge < 1 || numericAge > 120) return;

    setIsLoading(true);
    setError(null);
    setConditions(null);

    try {
      // Step 1: Parse symptoms from text (calls backend /api/symptoms/parse)
      const parsedData = await apiService.symptomChecker.parseSymptoms(symptoms, numericAge, sex);
      
      if (parsedData.mentions.length === 0) {
        throw new Error("We couldn't understand the symptoms. Please try rephrasing them.");
      }

      // Step 2: Format evidence for diagnosis
      const evidence = parsedData.mentions.map((mention) => ({
        id: mention.id,
        choice_id: 'present',
        source: 'initial',
      }));

      // Step 3: Get diagnosis (calls backend /api/symptoms/diagnose)
      const diagnosisData = await apiService.symptomChecker.getDiagnosis({
        sex,
        age: { value: numericAge },
        evidence,
      });

      // Show top 3 conditions
      setConditions(diagnosisData.conditions.slice(0, 3));
    } catch (err) {
      // Use the error message from the API service
      setError(err.message || 'An unknown error occurred. Please try again.');
      setConditions([]); 
    } finally {
      setIsLoading(false);
    }
  }, [symptoms, age, sex]);

  return (
    <>
      {/* Injecting style for animation from source App.tsx, which is needed by DiseaseCard.jsx */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
      <WaveBackground />
      <div className="flex justify-center items-center py-12 md:py-20 px-4 w-full min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-2xl bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 md:p-10 transition-all duration-500">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Symptom Checker</h1>
            <p className="mt-2 text-slate-600">Enter your symptoms to get insights into possible conditions.</p>
            <p className="mt-1 text-xs text-slate-500">Disclaimer: This tool is for informational purposes only and not a substitute for professional medical advice.</p>
          </div>
          
          <SymptomForm
            symptoms={symptoms}
            setSymptoms={setSymptoms}
            age={age}
            setAge={setAge}
            sex={sex}
            setSex={setSex}
            onSubmit={handleCheckSymptoms}
            isLoading={isLoading}
          />

          {isLoading && <LoadingSpinner />}
          {error && !isLoading && <ErrorMessage message={error} />}
          
          {conditions && !isLoading && <ResultsDisplay conditions={conditions} />}
        </div>
      </div>
    </>
  );
};

export default SymptomChecker;