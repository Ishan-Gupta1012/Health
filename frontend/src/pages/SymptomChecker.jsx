import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Plus, 
  X, 
  AlertTriangle, 
  Info, 
  Clock,
  Search
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../utils/api';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('mild');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);

  // Mock available symptoms
  const mockSymptoms = [
    'headache', 'fever', 'cough', 'chest pain', 'stomach pain', 'fatigue',
    'nausea', 'dizziness', 'sore throat', 'runny nose', 'muscle aches'
  ];

  const addSymptom = () => {
    if (symptomInput.trim() && !symptoms.includes(symptomInput.trim().toLowerCase())) {
      setSymptoms([...symptoms, symptomInput.trim().toLowerCase()]);
      setSymptomInput('');
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const checkSymptoms = async () => {
    if (symptoms.length === 0) {
      alert('Please add at least one symptom');
      return;
    }

    setLoading(true);
    try {
      // Mock symptom checking - replace with actual API when backend is connected with MongoDB
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = {
        timestamp: new Date().toISOString(),
        inputSymptoms: symptoms,
        duration: duration,
        results: symptoms.map(symptom => ({
          symptom: symptom,
          found: true,
          possibleCauses: [
            'Common condition related to ' + symptom,
            'Stress-related manifestation',
            'Minor health concern'
          ],
          recommendations: [
            'Rest and stay hydrated',
            'Monitor your condition',
            'Consider over-the-counter medication if needed'
          ],
          severity: 'mild-moderate',
          whenToSeeDoctor: 'If symptoms persist for more than a week or worsen'
        })),
        overallAssessment: {
          severity: 'moderate',
          urgency: 'medium',
          generalRecommendations: [
            'Rest and stay hydrated',
            'Monitor your symptoms closely',
            'Consider seeing a healthcare provider if symptoms persist'
          ],
          whenToSeeDoctor: [
            'If symptoms persist for more than a week',
            'If you develop a high fever',
            'If breathing becomes difficult'
          ]
        },
        disclaimer: 'This symptom checker is for informational purposes only and is not a substitute for professional medical advice.'
      };

      setResults(mockResults);
    } catch (error) {
      alert('Error checking symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'serious': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Symptom Checker</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get insights about your symptoms and receive personalized health recommendations
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8"
        >
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <strong>Important:</strong> This tool provides general information only and should not replace professional medical advice. 
              If you have serious symptoms or health concerns, please consult a healthcare provider immediately.
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Symptom Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Describe Your Symptoms</h2>

            {/* Add Symptoms */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Symptoms
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
                    className="input pl-10"
                    placeholder="e.g., headache, fever, cough"
                    data-testid="symptom-input"
                  />
                </div>
                <button
                  onClick={addSymptom}
                  className="btn-primary px-4 py-2"
                  data-testid="add-symptom-btn"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              {/* Suggested Symptoms */}
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-2">Common symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {mockSymptoms.slice(0, 6).map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => {
                        if (!symptoms.includes(symptom)) {
                          setSymptoms([...symptoms, symptom]);
                        }
                      }}
                      className="text-xs px-3 py-1 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 rounded-full transition-colors"
                      data-testid={`suggested-symptom-${symptom}`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Symptoms */}
            {symptoms.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Symptoms
                </label>
                <div className="flex flex-wrap gap-2" data-testid="symptoms-list">
                  {symptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {symptom}
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="ml-2 hover:bg-primary-200 rounded-full p-1"
                        data-testid={`remove-symptom-${symptom}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Duration */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How long have you had these symptoms?
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input"
                data-testid="duration-select"
              >
                <option value="">Select duration</option>
                <option value="1">Less than 1 day</option>
                <option value="2">1-2 days</option>
                <option value="3">3-7 days</option>
                <option value="14">1-2 weeks</option>
                <option value="30">More than 2 weeks</option>
              </select>
            </div>

            {/* Severity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How severe are your symptoms?
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="input"
                data-testid="severity-select"
              >
                <option value="mild">Mild - Minor discomfort</option>
                <option value="moderate">Moderate - Noticeable discomfort</option>
                <option value="severe">Severe - Significant discomfort</option>
              </select>
            </div>

            {/* Check Symptoms Button */}
            <button
              onClick={checkSymptoms}
              disabled={loading || symptoms.length === 0}
              className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="check-symptoms-btn"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="small" color="white" />
                  <span className="ml-2">Analyzing Symptoms...</span>
                </div>
              ) : (
                'Check Symptoms'
              )}
            </button>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Assessment Results</h2>

            {!results ? (
              <div className="text-center py-12 text-gray-500">
                <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Add your symptoms and click "Check Symptoms" to get your health assessment</p>
              </div>
            ) : (
              <div className="space-y-6" data-testid="results-section">
                {/* Overall Assessment */}
                <div className={`p-4 rounded-lg border ${getSeverityColor(results.overallAssessment.severity)}`}>
                  <h3 className="font-semibold mb-2">Overall Assessment</h3>
                  <p className="text-sm mb-2">
                    <strong>Severity:</strong> {results.overallAssessment.severity} | 
                    <strong> Urgency:</strong> {results.overallAssessment.urgency}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <strong className="text-sm">General Recommendations:</strong>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {results.overallAssessment.generalRecommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* When to See a Doctor */}
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    When to See a Doctor
                  </h3>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {results.overallAssessment.whenToSeeDoctor.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>

                {/* Individual Symptom Results */}
                <div>
                  <h3 className="font-semibold mb-3">Symptom Analysis</h3>
                  <div className="space-y-4">
                    {results.results.map((result, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-primary-700 capitalize mb-2">
                          {result.symptom}
                        </h4>
                        {result.found ? (
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Possible causes:</strong>
                              <ul className="list-disc list-inside ml-2 text-gray-600">
                                {result.possibleCauses.slice(0, 3).map((cause, idx) => (
                                  <li key={idx}>{cause}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <strong>Recommendations:</strong>
                              <ul className="list-disc list-inside ml-2 text-gray-600">
                                {result.recommendations.slice(0, 3).map((rec, idx) => (
                                  <li key={idx}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">{result.message}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-600">
                    <strong>Medical Disclaimer:</strong> {results.disclaimer}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;