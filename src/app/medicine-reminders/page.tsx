
'use client';

import { useState } from 'react';
import { prescriptionUploadAndMedicineDetection, type PrescriptionUploadAndMedicineDetectionOutput } from '@/ai/flows/prescription-upload-and-medicine-detection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileCheck2, AlertTriangle, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { LoadingStethoscope } from '@/components/loading-stethoscope';
import { Header } from '@/components/header';

type State = {
    status: 'idle' | 'loading' | 'success' | 'error';
    result: PrescriptionUploadAndMedicineDetectionOutput | null;
    error: string | null;
};

const initialState: State = {
    status: 'idle',
    result: null,
    error: null,
};

const pharmacies = [
    { name: 'CVS Pharmacy', url: 'https://www.cvs.com/search?searchTerm=' },
    { name: 'Walgreens', url: 'https://www.walgreens.com/search/results.jsp?Ntt=' },
    { name: 'GoodRx', url: 'https://www.goodrx.com/' },
];

export default function MedicineRemindersPage() {
    const [state, setState] = useState<State>(initialState);
    const [file, setFile] = useState<File | null>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setState(initialState);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setState({ ...initialState, status: 'error', error: 'Please select a file to upload.' });
            return;
        }

        setState({ ...initialState, status: 'loading' });

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const prescriptionDataUri = reader.result as string;
            try {
                const result = await prescriptionUploadAndMedicineDetection({ prescriptionDataUri });
                setState({ status: 'success', result, error: null });
            } catch (e) {
                setState({ status: 'error', result: null, error: 'Failed to analyze prescription. Please try again with a clearer image or a different file.' });
            }
        };
        reader.onerror = () => {
            setState({ status: 'error', result: null, error: 'Failed to read the file.' });
        };
    };

    return (
        <div className="relative min-h-screen w-full">
            <Header />
            <div className="flex items-center justify-center min-h-screen px-4 py-24">
                <div className="w-full max-w-4xl glass-card rounded-2xl">
                    <div className="p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
                            Medicine Reminders
                        </h1>
                        <p className="text-muted-foreground text-center mb-6">
                            Upload a prescription (PDF, JPG, PNG) to detect medicines, set reminders, and get buy links.
                        </p>
                        
                        {state.status === 'success' && state.result ? (
                             <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Detected Medicines:</h3>
                                <ScrollArea className="h-[300px] rounded-md border p-4">
                                    <div className="space-y-4">
                                    {state.result.medicines.map((medicine, index) => (
                                        <Card key={index} className="glass-card">
                                            <CardHeader className="p-4">
                                                <CardTitle className="text-base">{medicine}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                <p className="text-sm text-muted-foreground mb-2">Buy online from:</p>
                                                <div className="flex flex-col space-y-2">
                                                    {pharmacies.map(p => (
                                                        <Button asChild variant="link" className="p-0 h-auto justify-start" key={p.name}>
                                                            <Link href={`${p.url}${encodeURIComponent(medicine)}`} target="_blank" rel="noopener noreferrer">
                                                                {p.name} <ExternalLink className="ml-2 h-3 w-3" />
                                                            </Link>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    </div>
                                </ScrollArea>
                                <Button onClick={() => { setState(initialState); setFile(null); }}>Start Over</Button>
                            </div>
                        ) : state.status === 'loading' ? (
                             <div className="flex flex-col items-center justify-center space-y-4 p-8">
                                <LoadingStethoscope />
                                <p className="text-muted-foreground">Analyzing your prescription...</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-w-sm mx-auto">
                                <div className="grid w-full items-center gap-1.5">
                                    <Input id="prescription" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                                    {file && <p className="text-sm text-muted-foreground flex items-center"><FileCheck2 className="w-4 h-4 mr-2 text-primary" />{file.name}</p>}
                                </div>
                                
                                {state.status === 'error' && state.error && (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>{state.error}</AlertDescription>
                                    </Alert>
                                )}
                                
                                <Button onClick={handleSubmit} disabled={!file || state.status === 'loading'} className="w-full">
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Analyze Prescription
                                    </>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
