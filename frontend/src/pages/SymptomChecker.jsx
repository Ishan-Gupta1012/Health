import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Stethoscope } from 'lucide-react';

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState([]);
    
    const suggestedSymptoms = [
        { name: 'Headache', icon: '🤕' },
        { name: 'Fever', icon: '🤒' },
        { name: 'Cough', icon: '😷' },
        { name: 'Sore Throat', icon: '😩' },
        { name: 'Nausea', icon: '🤢' },
        { name: 'Fatigue', icon: '😴' },
    ];

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
                        <p className="text-black/80">Describe your symptoms to get insights.</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Enter your symptoms</label>
                            <div className="relative">
                                <select className="input appearance-none">
                                    <option>Select or type your symptoms</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-black mb-3">Visual Symptom Suggestions</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                                {suggestedSymptoms.map(symptom => (
                                    <div key={symptom.name} className="flex flex-col items-center p-3 bg-white/20 rounded-lg cursor-pointer hover:bg-white/30 transition">
                                        <div className="text-4xl">{symptom.icon}</div>
                                        <p className="text-xs mt-2 text-black">{symptom.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-100/50 p-4 rounded-lg text-black">
                            <h4 className="font-semibold">Likely Condition Category</h4>
                            <p className="text-sm">Based on your symptoms, the likely condition category is: <span className="font-bold text-blue-800">Respiratory Illness</span></p>
                            <h4 className="font-semibold mt-2">Recommended Action</h4>
                            <p className="text-sm">Self-care measures are recommended. If symptoms persist, consider a <a href="#" className="text-blue-600 underline">GP visit</a>.</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Find a Nearby Doctor (Optional)</label>
                             <div className="flex gap-2">
                                <input type="text" placeholder="Enter your location" className="input" />
                                <button className="btn-primary whitespace-nowrap">Find Doctors</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SymptomChecker;
