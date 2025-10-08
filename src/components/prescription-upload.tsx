"use client";

import { useState } from 'react';
import { prescriptionUploadAndMedicineDetection, type PrescriptionUploadAndMedicineDetectionOutput } from '@/ai/flows/prescription-upload-and-medicine-detection';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, FileCheck2, AlertTriangle, ExternalLink } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { LoadingStethoscope } from './loading-stethoscope';

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

export function PrescriptionUpload() {
    const [state, setState] = useState<State>(initialState);
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    
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
    
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setState(initialState);
            setFile(null);
        }
        setOpen(isOpen);
    };
    
    const pharmacies = [
        { name: 'CVS Pharmacy', url: 'https://www.cvs.com/search?searchTerm=' },
        { name: 'Walgreens', url: 'https://www.walgreens.com/search/results.jsp?Ntt=' },
        { name: 'GoodRx', url: 'https://www.goodrx.com/' },
    ];

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-auto bg-white/30 hover:bg-white/50">
                    Upload Prescription
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg glass-card">
                <DialogHeader>
                    <DialogTitle>Upload Prescription</DialogTitle>
                    <DialogDescription>
                        Upload a prescription (PDF, JPG, PNG) to detect medicines and get buy links.
                    </DialogDescription>
                </DialogHeader>
                
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
                        <DialogFooter>
                            <Button onClick={() => handleOpenChange(false)}>Close</Button>
                        </DialogFooter>
                    </div>
                ) : state.status === 'loading' ? (
                     <div className="flex flex-col items-center justify-center space-y-4 p-8">
                        <LoadingStethoscope />
                        <p className="text-muted-foreground">Analyzing your prescription...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Input id="prescription" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                            {file && <p className="text-sm text-muted-foreground flex items-center"><FileCheck2 className="w-4 h-4 mr-2 text-primary" />{file.name}</p>}
                        </div>
                        
                        {state.status === 'error' && state.error && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{state.error}</AlertDescription>
                            </Alert>
                        )}
                        
                        <DialogFooter>
                            <Button onClick={handleSubmit} disabled={!file || state.status === 'loading'} className="w-full">
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Analyze Prescription
                                </>
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
