'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/header';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { LoadingStethoscope } from '@/components/loading-stethoscope';
import { symptomChecker, type SymptomCheckerOutput } from '@/ai/flows/symptom-checker';

const symptomsList = [
  { id: 'fever', label: 'Fever' },
  { id: 'cough', label: 'Cough' },
  { id: 'headache', label: 'Headache' },
  { id: 'sore-throat', label: 'Sore Throat' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'nausea', label: 'Nausea' },
  { id: 'shortness-of-breath', label: 'Shortness of Breath' },
  { id: 'body-aches', label: 'Body Aches' },
];

type State = {
  result: SymptomCheckerOutput | null;
  error: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
};

const initialState: State = {
  result: null,
  error: null,
  status: 'idle',
};

export default function SymptomCheckerPage() {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [concerns, setConcerns] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [state, setState] = useState<State>(initialState);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ ...initialState, status: 'loading' });

    const allSymptoms = [
      description,
      duration ? `Duration: ${duration}` : '',
      concerns ? `Concerns: ${concerns}` : '',
      ...selectedSymptoms,
    ].filter(Boolean).join(', ');

    if (allSymptoms.trim().length < 10) {
      setState({
        result: null,
        error: 'Please describe your symptoms in more detail.',
        status: 'error',
      });
      return;
    }

    try {
      const result = await symptomChecker({ symptoms: allSymptoms });
      setState({ result, error: null, status: 'success' });
    } catch (err) {
      setState({ result: null, error: 'An unexpected error occurred. Please try again.', status: 'error' });
    }
  };
  
  const handleCloseDialog = () => {
    setState(initialState);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-cyan-100 via-purple-100 to-rose-100">
      <Header />
      <div className="flex items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-4xl bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
              Symptom Checker
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  type="text"
                  placeholder="Describe your primary symptom"
                  className="bg-white/50"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="How long have you felt this way?"
                  className="bg-white/50"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Any other specific concerns?"
                  className="bg-white/50 md:col-span-2"
                  value={concerns}
                  onChange={(e) => setConcerns(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {symptomsList.map((symptom) => (
                  <label
                    key={symptom.id}
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all border-2 ${
                      selectedSymptoms.includes(symptom.label)
                        ? 'bg-primary/20 border-primary'
                        : 'bg-white/50 hover:bg-white/80 border-transparent'
                    }`}
                  >
                    <Checkbox
                      id={symptom.id}
                      checked={selectedSymptoms.includes(symptom.label)}
                      onCheckedChange={() => handleSymptomToggle(symptom.label)}
                    />
                    <span className="font-medium text-sm text-gray-700">{symptom.label}</span>
                  </label>
                ))}
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto mx-auto flex"
                size="lg"
                disabled={state.status === 'loading'}
              >
                Check Symptoms
              </Button>
            </form>
          </div>
        </div>
      </div>

       <Dialog open={state.status === 'loading' || state.status === 'success' || state.status === 'error'} onOpenChange={handleCloseDialog}>
        <DialogContent onEscapeKeyDown={handleCloseDialog} className="sm:max-w-md">
           <DialogHeader>
            <DialogTitle>
              {state.status === 'loading' && 'Analyzing Symptoms...'}
              {state.status === 'success' && 'Possible Causes'}
              {state.status === 'error' && 'Error'}
            </DialogTitle>
             <DialogDescription>
                {state.status === 'success' && 'Based on the symptoms you provided, here are some possible causes. This is not a medical diagnosis.'}
             </DialogDescription>
          </DialogHeader>
          
          {state.status === 'loading' && (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
              <LoadingStethoscope />
              <p className="text-muted-foreground">Checking your symptoms...</p>
            </div>
          )}

          {state.status === 'success' && state.result && (
            <div className="space-y-4">
              <div className="max-h-[300px] overflow-y-auto rounded-md border p-4 text-sm text-muted-foreground whitespace-pre-wrap">
                {state.result.possibleCauses}
              </div>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>{state.result.disclaimer}</AlertDescription>
              </Alert>
            </div>
          )}

          {state.status === 'error' && state.error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
