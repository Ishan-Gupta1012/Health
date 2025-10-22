import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Search, FileText, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { apiService } from '../utils/api'; // Import apiService
import LoadingSpinner from '../components/LoadingSpinner';

// Placeholder pharmacy data (replace logos if needed)
const pharmacies = [
    { name: '1mg', discount: 'Up to 20% Off', logo: 'https://via.placeholder.com/100x40?text=1mg', searchUrl: 'https://www.1mg.com/search/all?name=' },
    { name: 'Netmeds', discount: 'Up to 18% Off', logo: 'https://via.placeholder.com/100x40?text=Netmeds', searchUrl: 'https://www.netmeds.com/catalogsearch/result?q=' },
    { name: 'Apollo 24|7', discount: 'Up to 25% Off', logo: 'https://via.placeholder.com/100x40?text=Apollo', searchUrl: 'https://www.apollo247.com/search-medicines/' },
    { name: 'PharmEasy', discount: 'Up to 30% Off', logo: 'https://via.placeholder.com/100x40?text=PharmEasy', searchUrl: 'https://pharmeasy.in/search/all?name=' }
];

const PrescriptionAssistant = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [extractedMedicines, setExtractedMedicines] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null); // To store full API response if needed

    // --- File Dropzone Handler ---
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        if (acceptedFiles && acceptedFiles.length > 0) {
            setUploadedFile(acceptedFiles[0]);
            setError(''); // Clear previous errors
            setExtractedMedicines(''); // Clear previous results
            setAnalysisResult(null);
        }
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.gif'],
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    // --- API Call Handler ---
    const handleFindMedicines = async () => {
        if (!uploadedFile) {
            setError('Please upload a prescription file first.');
            return;
        }

        setIsProcessing(true);
        setError('');
        setExtractedMedicines('');
        setAnalysisResult(null);

        const formData = new FormData();
        formData.append('prescription', uploadedFile);

        try {
            const response = await apiService.prescription.analyzePrescription(formData);
            // Assuming the backend sends back { success: true, medicines: ['Med1', 'Med2', ...] }
            if (response.data && response.data.medicines) {
                setExtractedMedicines(response.data.medicines.join('\n'));
                setAnalysisResult(response.data); // Store full result if needed later
            } else {
                 setError('Could not extract medicines from the prescription.');
                 setExtractedMedicines('No medicines found or error during extraction.');
            }
        } catch (err) {
            console.error("Prescription analysis error:", err);
            setError(err.response?.data?.message || 'Failed to analyze prescription. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Pharmacy Search URL Generator ---
    const getPharmacySearchUrl = (baseUrl, medicinesText) => {
        const meds = medicinesText.split('\n').filter(Boolean).map(med => med.split(' ')[0]); // Get first word (likely name)
        if (meds.length === 0) return '#'; // Return '#' if no medicines extracted
        // Simple search for the first medicine for demo purposes
        return `${baseUrl}${encodeURIComponent(meds[0])}`;
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            {/* Background Waves (Ensure these styles exist in your index.css) */}
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-6 sm:p-8" // Use glass-card
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-black">Prescription Upload + Smart Buy Assistant</h1>
                        <p className="text-black/80 mt-2 text-sm sm:text-base">Upload your prescription and let our AI find the best deals on your medicines online.</p>
                    </div>

                    {/* File Upload Dropzone */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 sm:p-10 text-center mb-8 cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50/20' : 'border-black/30 bg-white/10 hover:border-black/50'}`}
                    >
                        <input {...getInputProps()} />
                        <UploadCloud className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-black/50" />
                        {uploadedFile ? (
                            <div>
                                <p className="mt-4 font-semibold text-black">{uploadedFile.name}</p>
                                <p className="text-sm text-black/60">{Math.round(uploadedFile.size / 1024)} KB</p>
                            </div>
                        ) : isDragActive ? (
                            <p className="mt-4 font-semibold text-blue-600">Drop the file here ...</p>
                        ) : (
                            <div>
                                <p className="mt-4 font-semibold text-black">Upload Your Prescription</p>
                                <p className="text-sm text-black/60">Drag & drop or click to upload (Image or PDF)</p>
                            </div>
                        )}
                         <button type="button" className="btn-secondary text-sm mt-4">Browse Files</button>
                    </div>

                    {/* Error Message */}
                    {error && (
                         <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-100/50 border border-red-300/50 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center"
                         >
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {error}
                        </motion.div>
                    )}

                    {/* Analyze Button */}
                    <div className="text-center mb-8">
                        <button
                            onClick={handleFindMedicines}
                            disabled={!uploadedFile || isProcessing}
                            className="btn-primary py-3 px-6 sm:px-8 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                        >
                            {isProcessing ? (
                                <LoadingSpinner size="small" color="white" />
                            ) : (
                                <>
                                    <Search className="inline -mt-1 mr-2" size={20} /> Find My Medicines Online
                                </>
                            )}
                        </button>
                    </div>

                    {/* Extracted Medicines */}
                    <div className="mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-black mb-4 flex items-center">
                           <FileText className="h-5 w-5 mr-2 text-indigo-600"/> Extracted Medicines
                        </h2>
                        <textarea
                            className="input w-full bg-white/30 text-black placeholder-black/50 border border-white/40" // Adjusted background and border
                            rows="4"
                            placeholder="Medicines extracted from your prescription will appear here... e.g.&#10;Paracetamol 500mg&#10;Aspirin 75mg&#10;Atorvastatin 20mg"
                            value={extractedMedicines}
                            readOnly={isProcessing} // Make read-only while processing
                            onChange={(e) => setExtractedMedicines(e.target.value)} // Allow editing if needed
                        ></textarea>
                         <p className="text-xs text-black/60 mt-1">You can edit the list above before searching pharmacies.</p>
                    </div>

                    {/* Pharmacy Options */}
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Your Pharmacy Options</h2>
                        {extractedMedicines ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pharmacies.map(pharmacy => (
                                    <motion.div
                                        key={pharmacy.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white/30 p-4 rounded-lg flex items-center justify-between border border-white/40" // Adjusted background and border
                                    >
                                        <div className="flex items-center space-x-3">
                                            {/* <img src={pharmacy.logo} alt={pharmacy.name} className="h-8 object-contain"/> */}
                                            <div>
                                                <h3 className="font-bold text-black">{pharmacy.name}</h3>
                                                <p className="text-sm text-green-800 font-semibold">{pharmacy.discount}</p>
                                            </div>
                                        </div>
                                        <a
                                           href={getPharmacySearchUrl(pharmacy.searchUrl, extractedMedicines)}
                                           target="_blank" // Open in new tab
                                           rel="noopener noreferrer" // Security best practice
                                           className="btn-secondary text-xs sm:text-sm whitespace-nowrap"
                                           // Disable link if no medicines
                                           onClick={(e) => !extractedMedicines && e.preventDefault()}
                                           aria-disabled={!extractedMedicines}
                                        >
                                            Search on {pharmacy.name}
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                           <p className="text-black/60 text-sm">Upload a prescription and click "Find My Medicines Online" to see pharmacy options.</p>
                        )}
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default PrescriptionAssistant;