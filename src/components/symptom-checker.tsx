"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
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
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

const initialState: {
    result: SymptomCheckerOutput | null;
    error: string | null;
} = {
    result: null,
    error: null,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                </>
            ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Check Symptoms
                </>
            )}
        </Button>
    );
}

async function symptomCheckerAction(prevState: any, formData: FormData) {
    const symptoms = formData.get('symptoms') as string;
    if (!symptoms || symptoms.trim().length < 10) {
        return { result: null, error: 'Please describe your symptoms in more detail (at least 10 characters).' };
    }

    try {
        const result = await symptomChecker({ symptoms });
        return { result, error: null };
    } catch (e) {
        return { result: null, error: 'An unexpected error occurred. Please try again.' };
    }
}

export function SymptomChecker() {
    const [state, formAction] = useFormState(symptomCheckerAction, initialState);
    const [open, setOpen] = useState(false);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            // Reset state when closing dialog
            formAction(new FormData(), {result: null, error: null});
        }
        setOpen(isOpen);
    };

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

                {state.result ? (
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
                ) : (
                    <form action={formAction} className="space-y-4">
                        <Textarea
                            name="symptoms"
                            placeholder="e.g., I have a headache, fever, and a sore throat..."
                            rows={5}
                            required
                            minLength={10}
                        />
                        {state.error && (
                             <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{state.error}</AlertDescription>
                            </Alert>
                        )}
                        <DialogFooter>
                             <SubmitButton />
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
