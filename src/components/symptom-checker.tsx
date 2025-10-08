"use client";

import { useState } from 'react';
import { symptomChecker, type SymptomCheckerOutput } from '@/ai/flows/symptom-checker';
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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { LoadingStethoscope } from './loading-stethoscope';

const initialState: {
    result: SymptomCheckerOutput | null;
    error: string | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    symptoms: string;
} = {
    result: null,
    error: null,
    status: 'idle',
    symptoms: '',
};

async function symptomCheckerAction(symptoms: string): Promise<Omit<typeof initialState, 'symptoms'>> {
    if (!symptoms || symptoms.trim().length < 10) {
        return { result: null, error: 'Please describe your symptoms in more detail (at least 10 characters).', status: 'error' };
    }

    try {
        const result = await symptomChecker({ symptoms });
        return { result, error: null, status: 'success' };
    } catch (e) {
        return { result: null, error: 'An unexpected error occurred. Please try again.', status: 'error' };
    }
}

export function SymptomChecker() {
    const [state, setState] = useState(initialState);
    const [open, setOpen] = useState(false);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            // Reset state when closing dialog
             setState(initialState);
        }
        setOpen(isOpen);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState(prev => ({ ...prev, status: 'loading' }));
        const formResult = await symptomCheckerAction(state.symptoms);
        setState(prev => ({ ...prev, ...formResult }));
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-auto">
                    Check Symptoms Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>AI Symptom Checker</DialogTitle>
                    <DialogDescription>
                        Describe your symptoms, and our AI will provide possible causes.
                    </DialogDescription>
                </DialogHeader>

                {state.status === 'success' && state.result ? (
                    <div className="space-y-4">
                        <ScrollArea className="h-[300px] rounded-md border p-4">
                            <h3 className="font-semibold text-lg">Possible Causes:</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{state.result.possibleCauses}</p>
                        </ScrollArea>
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Disclaimer</AlertTitle>
                            <AlertDescription>
                                {state.result.disclaimer}
                            </AlertDescription>
                        </Alert>
                        <DialogFooter>
                            <Button onClick={() => handleOpenChange(false)}>Close</Button>
                        </DialogFooter>
                    </div>
                ) : state.status === 'loading' ? (
                    <div className="flex flex-col items-center justify-center space-y-4 p-8">
                        <LoadingStethoscope />
                        <p className="text-muted-foreground">Checking your symptoms...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            name="symptoms"
                            placeholder="e.g., I have a headache, fever, and a sore throat..."
                            rows={5}
                            required
                            minLength={10}
                            value={state.symptoms}
                            onChange={(e) => setState(prev => ({...prev, symptoms: e.target.value}))}
                        />
                        {state.status === 'error' && state.error && (
                             <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{state.error}</AlertDescription>
                            </Alert>
                        )}
                        <DialogFooter>
                             <Button type="submit" disabled={state.status === 'loading'} className="w-full">
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Check Symptoms
                                </>
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
