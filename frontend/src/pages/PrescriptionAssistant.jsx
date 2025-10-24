import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Search, FileText, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { analyzePrescription } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Tesseract from 'tesseract.js';

// Placeholder pharmacy data
const pharmacies = [
    { name: '1mg', discount: 'Up to 20% Off', logo: 'https://via.placeholder.com/100x40?text=1mg', searchUrl: 'https://www.1mg.com/search/all?name=' },
    { name: 'Netmeds', discount: 'Up to 18% Off', logo: 'https://via.placeholder.com/100x40?text=Netmeds', searchUrl: 'https://www.netmeds.com/catalogsearch/result?q=' },
    { name: 'Apollo 24|7', discount: 'Up to 25% Off', logo: 'https://via.placeholder.com/100x40?text=Apollo', searchUrl: 'https://www.apollo247.com/search-medicines/' },
    { name: 'PharmEasy', discount: 'Up to 30% Off', logo: 'https://via.placeholder.com/100x40?text=PharmEasy', searchUrl: 'https://pharmeasy.in/search/all?name=' }
];

const PrescriptionAssistant = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [extractedMedicines, setExtractedMedicines] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [ocrText, setOcrText] = useState('');
    const [ocrProgress, setOcrProgress] = useState(0);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setUploadedFile(acceptedFiles[0]);
            setError('');
            setExtractedMedicines([]);
            setOcrText('');
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

    const handleFindMedicines = async () => {
        if (!uploadedFile) {
            setError('Please upload a prescription first');
            return;
        }

        try {
            setIsProcessing(true);
            setIsAnalyzing(true);
            setError('');
            setOcrProgress(0);

            // Step 1: Perform OCR on the uploaded file
            console.log('Step 1: Starting OCR...');
            const imageUrl = URL.createObjectURL(uploadedFile);
            
            const { data: { text } } = await Tesseract.recognize(
                imageUrl,
                'eng',
                {
                    logger: (m) => {
                        if (m.status === 'recognizing text') {
                            setOcrProgress(Math.round(m.progress * 100));
                        }
                    }
                }
            );

            console.log('OCR completed. Extracted text:', text);
            setOcrText(text);

            if (!text || text.trim() === '') {
                setError('Could not extract text from the image. Please try a clearer image.');
                setIsProcessing(false);
                setIsAnalyzing(false);
                return;
            }

            // Step 2: Send extracted text to backend for AI analysis
            console.log('Step 2: Sending to AI for analysis...');
            const result = await analyzePrescription(text);

            console.log('Analysis result:', result);
            setExtractedMedicines(result.medicines || []);
            setIsProcessing(false);
            setIsAnalyzing(false);

        } catch (err) {
            console.error('Prescription analysis error:', err);
            setError(err.message || 'Failed to analyze prescription');
            setIsProcessing(false);
            setIsAnalyzing(false);
        }
    };

    const getPharmacySearchUrl = (baseUrl, medicines) => {
        if (medicines.length === 0) return '#';
        // Simple search for the first medicine for demo purposes
        return `${baseUrl}${encodeURIComponent(medicines[0].name)}`;
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            {/* Background Waves */}
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-6 sm:p-8"
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
                                    <Search className="inline -mt-1 mr-2" size={20} /> Get Information About Medicines
                                </>
                            )}
                        </button>
                    </div>

                    {/* OCR Progress */}
                    {isProcessing && ocrProgress > 0 && (
                        <div className="mb-6">
                            <div className="flex justify-between text-sm text-black/70 mb-2">
                                <span>Extracting text from image...</span>
                                <span>{ocrProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${ocrProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Extracted Medicines */}
                    <div className="mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-black mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-indigo-600"/> Extracted Medicines
                        </h2>
                        {isProcessing ? (
                            <div className="text-center">
                                <LoadingSpinner />
                                <p className="text-black/60">Analyzing your prescription...</p>
                            </div>
                        ) : extractedMedicines.length > 0 ? (
                            <div className="space-y-4">
                                {extractedMedicines.map((med, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="bg-white/30 p-4 rounded-lg border border-white/40"
                                    >
                                        <h3 className="font-bold text-lg text-black">{med.name}</h3>
                                        <p className="text-sm text-black/80 capitalize"><span className="font-semibold">Dosage:</span> {med.dosage}</p>
                                        <p className="text-sm text-black/80 capitalize"><span className="font-semibold">Frequency:</span> {med.frequency}</p>
                                        <p className="text-sm text-black/80 capitalize"><span className="font-semibold">Role:</span> {med.role}</p>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-6 bg-white/20 rounded-lg">
                                <p className="text-black/60">Medicines extracted from your prescription will appear here.</p>
                            </div>
                        )}
                    </div>

                    {/* Pharmacy Options */}
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Your Pharmacy Options</h2>
                        {extractedMedicines.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pharmacies.map(pharmacy => (
                                    <motion.div
                                        key={pharmacy.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white/30 p-4 rounded-lg flex items-center justify-between border border-white/40"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <h3 className="font-bold text-black">{pharmacy.name}</h3>
                                                <p className="text-sm text-green-800 font-semibold">{pharmacy.discount}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={getPharmacySearchUrl(pharmacy.searchUrl, extractedMedicines)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-secondary text-xs sm:text-sm whitespace-nowrap"
                                            onClick={(e) => extractedMedicines.length === 0 && e.preventDefault()}
                                            aria-disabled={extractedMedicines.length === 0}
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