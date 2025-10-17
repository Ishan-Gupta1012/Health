import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiXCircle } from 'react-icons/fi'; // Using react-icons for some nice icons

const MediSageUpload = ({ onAnalyze, isLoading }) => {
  const [analysisType, setAnalysisType] = useState('image'); // 'image' or 'report'
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onAnalyze(selectedFile, analysisType);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">MediSage AI Analyzer</h2>
      <p className="text-center text-gray-500 mb-6">Upload a medical image or report to get AI-powered insights.</p>

      {/* Analysis Type Toggle */}
      <div className="flex justify-center bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setAnalysisType('image')}
          className={`w-1/2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
            analysisType === 'image' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          Radiology Image Analysis
        </button>
        <button
          onClick={() => setAnalysisType('report')}
          className={`w-1/2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
            analysisType === 'report' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          Medical Report Analysis
        </button>
      </div>

      {/* File Drop Zone */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
        />
        {!preview ? (
          <>
            <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, or JPEG</p>
          </>
        ) : (
          <div className="relative">
            <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded-md" />
            <button
              onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
              className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1 text-red-500 hover:text-red-700 shadow"
            >
              <FiXCircle size={20} />
            </button>
            <p className="mt-2 text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
          </div>
        )}
      </div>
      
      {/* Analyze Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading}
        className="w-full mt-6 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Analyze Now'
        )}
      </button>
    </div>
  );
};

export default MediSageUpload;