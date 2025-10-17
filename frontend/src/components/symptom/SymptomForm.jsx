import React from 'react';

const SymptomForm = ({
  symptoms,
  setSymptoms,
  age,
  setAge,
  sex,
  setSex,
  onSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 w-full">
      <div>
        <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700 mb-1">
          Enter your symptoms (comma-separated)
        </label>
        <textarea
          id="symptoms"
          rows={3}
          className="w-full px-4 py-2 bg-white/50 border border-white/40 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
          placeholder="e.g., headache, fever, cough"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            className="w-full px-4 py-2 bg-white/50 border border-white/40 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
            placeholder="e.g., 30"
            value={age}
            onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            disabled={isLoading}
            min="1"
            max="120"
          />
        </div>
        <div>
          <label htmlFor="sex" className="block text-sm font-medium text-slate-700 mb-1">
            Sex
          </label>
          <select
            id="sex"
            className="w-full px-4 py-2 bg-white/50 border border-white/40 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            disabled={isLoading}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !symptoms || age === ''}
        >
          {isLoading ? 'Checking...' : 'Check Symptoms'}
        </button>
      </div>
    </form>
  );
};

export default SymptomForm;