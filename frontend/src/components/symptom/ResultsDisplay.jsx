import React from 'react';
import DiseaseCard from './DiseaseCard';

const ResultsDisplay = ({ conditions }) => {
  if (!conditions || conditions.length === 0) {
    return (
      <div className="text-center p-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg mt-8">
        <p className="text-slate-600">We couldn’t identify a likely condition. Please check your symptoms or try again.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Possible Conditions</h2>
      <div className="space-y-6">
        {conditions.map((condition) => (
          <DiseaseCard key={condition.id} condition={condition} />
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;