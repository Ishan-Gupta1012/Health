import React from 'react';
import { FiBarChart2, FiHelpCircle, FiFileText, FiRefreshCw } from 'react-icons/fi';

const MediSageResults = ({ results, analysisType, onReset }) => {
  if (!results) return null;

  // Component for displaying Report Analysis results
  const ReportResults = () => (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-2">
          <FiFileText className="mr-2 text-blue-500" /> AI-Generated Summary
        </h3>
        <p className="text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
          {results.analysis.summary}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-2">
          <FiHelpCircle className="mr-2 text-green-500" /> Questions to Ask Your Doctor
        </h3>
        <ul className="list-disc list-inside space-y-2 bg-green-50 p-4 rounded-lg border border-green-200">
          {results.analysis.questions.map((q, index) => (
            <li key={index} className="text-gray-700">{q}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-2">
          <FiFileText className="mr-2 text-gray-500" /> Extracted Text
        </h3>
        <p className="text-sm text-gray-500 bg-gray-100 p-4 rounded-lg border h-40 overflow-y-auto">
          {results.originalText}
        </p>
      </div>
    </>
  );

  // Component for displaying Image Analysis results
  const ImageResults = () => (
    <>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Analysis Complete</h3>
      </div>
      <div className="bg-gray-50 p-6 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500 mb-2">AI Prediction</p>
          <p className={`text-2xl font-bold px-4 py-2 rounded-full ${results.prediction === 'Anomaly Detected' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {results.prediction}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500 mb-2">Confidence Score</p>
          <div className="flex items-center space-x-2">
             <FiBarChart2 className="text-blue-500" size={24} />
             <p className="text-2xl font-bold text-blue-800">
               {(results.confidence * 100).toFixed(2)}%
             </p>
          </div>
        </div>
      </div>
       <p className="text-xs text-center text-gray-500 mt-4">
        {results.heatmap}
      </p>
    </>
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
       {analysisType === 'report' ? <ReportResults /> : <ImageResults />}

      <button
        onClick={onReset}
        className="w-full mt-8 bg-gray-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
      >
        <FiRefreshCw className="mr-2" />
        Analyze Another
      </button>
      <p className="text-center text-xs text-gray-400 mt-4">Disclaimer: MediSage AI analysis is for informational purposes only and is not a substitute for professional medical advice.</p>
    </div>
  );
};

export default MediSageResults;