import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Search } from 'lucide-react';

const PrescriptionAssistant = () => {
    const pharmacies = [
        { name: '1mg', discount: 'Up to 20% Off', logo: 'https://i.imgur.com/example1.png' },
        { name: 'Netmeds', discount: 'Up to 18% Off', logo: 'https://i.imgur.com/example2.png' },
        { name: 'Apollo 24|7', discount: 'Up to 25% Off', logo: 'https://i.imgur.com/example3.png' },
        { name: 'PharmEasy', discount: 'Up to 30% Off', logo: 'https://i.imgur.com/example4.png' }
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
                        <h1 className="text-3xl font-bold text-black">Prescription Upload + Smart Buy Assistant</h1>
                        <p className="text-black/80">Upload your prescription and let our AI find the best deals on your medicines online.</p>
                    </div>

                    <div className="border-2 border-dashed border-black/30 rounded-lg p-10 text-center mb-8 bg-white/10">
                        <UploadCloud className="mx-auto h-12 w-12 text-black/50" />
                        <p className="mt-4 font-semibold text-black">Upload Your Prescription</p>
                        <p className="text-sm text-black/60">Drag & drop or click to upload (Image or PDF)</p>
                        <button className="btn-primary mt-4">Browse Files</button>
                    </div>

                    <div className="text-center mb-8">
                        <button className="btn-primary py-3 px-8 text-lg"><Search className="inline -mt-1 mr-2" size={20}/> Find My Medicines Online</button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-black mb-4">Extracted Medicines</h2>
                        <textarea 
                            className="input w-full bg-white/20 text-black placeholder-black/50"
                            rows="4"
                            placeholder="e.g.&#10;Paracetamol 500mg&#10;Aspirin 75mg&#10;Atorvastatin 20mg"
                        ></textarea>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-black mb-4">Your Pharmacy Options</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pharmacies.map(pharmacy => (
                                <div key={pharmacy.name} className="bg-white/20 p-4 rounded-lg flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-black">{pharmacy.name}</h3>
                                        <p className="text-sm text-green-800 font-semibold">{pharmacy.discount}</p>
                                    </div>
                                    <a href="#" className="btn-secondary text-sm">Search on {pharmacy.name}</a>
                                </div>
                            ))}
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default PrescriptionAssistant;
