// frontend/src/hooks/useNutritionGoals.js

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { calculateNutritionGoals } from '../utils/nutrition'; 

export const useNutritionGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState({ 
    tdee: 0, 
    protein: 0, 
    carbs: 0, 
    fat: 0, 
    message: "Awaiting user data for calculation." 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const calculatedGoals = calculateNutritionGoals(user);
      setGoals(calculatedGoals);
    }
    setLoading(false);
  }, [user]);

  return { goals, loading };
};