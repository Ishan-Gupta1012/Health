import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
import { getAuthHeaders, getErrorMessage } from '../utils/api'; // Import helpers

const SymptomChecker = () => {
    const { user } = useAuth();
    const [availableSymptoms, setAvailableSymptoms] = useState([]);
    const [selectedSymptom, setSelectedSymptom] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            const fetchSymptoms = async () => {
                try {
                    const response = await api.get('/symptoms/available', {
                        headers: getAuthHeaders()
                    });
                    setAvailableSymptoms(response.data.symptoms);
                } catch (err) {
                    setError(getErrorMessage(err));
                    console.error('Fetch symptoms error:', err);
                }
            };
            fetchSymptoms();
        }
    }, [user]);

    const handleCheckSymptoms = async () => {
        if (!selectedSymptom) {
            setError('Please select a symptom or condition.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResults(null);
        try {
            const response = await api.post('/symptoms/check', 
                { symptoms: [selectedSymptom] },
                { headers: getAuthHeaders() }
            );
            setResults(response.data);
        } catch (err) {
            setError(getErrorMessage(err));
            console.error('Check symptoms error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 text-center"
                >
                    <LogIn className="mx-auto h-12 w-12 text-black" />
                    <h1 className="text-2xl font-bold text-black mt-4">Login Required</h1>
                    <p className="text-black/80 my-4">You must be logged in to use the Symptom Checker.</p>
                    <Link to="/signin" className="btn-primary">
                        Go to Sign In
                    </Link>
                </motion.div>
            </div>
        );
    }

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
                        <Stethoscope className="mx-auto h-12 w-12 text-black" />
                        <h1 className="text-3xl font-bold text-black mt-4">Symptom Checker</h1>
                        <p className="text-black/80">Select a primary symptom or condition to get started.</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Search for a Symptom or Condition</label>
                            <div className="flex gap-2">
                                <select 
                                    className="input appearance-none w-full"
                                    value={selectedSymptom}
                                    onChange={(e) => setSelectedSymptom(e.target.value)}
                                >
                                    <option value="">-- Select from {availableSymptoms.length} options --</option>
                                    {availableSymptoms.map((symptom) => (
                                        <option key={symptom.value} value={symptom.value}>
                                            {symptom.name}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={handleCheckSymptoms} className="btn-primary whitespace-nowrap" disabled={isLoading}>
                                    {isLoading ? 'Checking...' : 'Check'}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-center">{error}</p>}

                        {results && (
                            <div className="bg-blue-100/50 p-4 rounded-lg text-black animate-fade-in">
                                <h4 className="font-semibold text-lg mb-2">Results</h4>
                                {results.results.map((result, index) => (
                                    <div key={index} className="mb-3">
                                        <p className="font-bold">{result.symptom}</p>
                                        <p className="text-sm"><span className="font-semibold">Recommendation:</span> {result.recommendations.join(', ')}</p>
                                    </div>
                                ))}
                                <p className="text-xs mt-4 italic">{results.disclaimer}</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SymptomChecker;
