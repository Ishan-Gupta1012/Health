// frontend/src/pages/My/MealTracker.jsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../utils/api';
// Assuming you have defined useNutritionGoals in frontend/src/hooks/useNutritionGoals.js
import { useNutritionGoals } from '../../hooks/useNutritionGoals'; 
import { PlusCircle, Utensils } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner'; 

// Helper component for goal visualization
const GoalProgress = ({ label, consumed, max, unit, color }) => {
    // If max is 0 (due to missing profile data), set percentage to 0 to avoid errors
    const percentage = max > 0 ? Math.min(100, (consumed / max) * 100) : 0;
    const isExceeded = consumed > max && max > 0;

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
                <span className={`text-${color}-700`}>{label}</span>
                <span className={isExceeded ? 'text-red-500 font-bold' : 'text-gray-700'}>
                    {consumed} / {max} {unit}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className={`h-2 rounded-full transition-all duration-500 ${isExceeded ? 'bg-red-500' : `bg-${color}-500`}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            {isExceeded && <p className="text-xs text-red-500">Goal exceeded!</p>}
        </div>
    );
};


const MealTracker = () => {
    const { user } = useAuth();
    // Use nutrition goals hook to get TDEE and macro goals
    const { goals, loading: goalsLoading } = useNutritionGoals(); 
    const [todaysMeals, setTodaysMeals] = useState([]);
    const [mealsLoading, setMealsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for consumed totals (initialized to 0)
    const [consumed, setConsumed] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    });

    // Fetch meal data
    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setMealsLoading(true);
                const response = await apiService.meals.getTodaysMeals(); 
                const meals = response.meals || [];
                setTodaysMeals(meals);
                
                // Calculate total consumption from fetched meals
                const calculatedConsumption = meals.reduce((totals, meal) => {
                    totals.calories += meal.calories || 0;
                    totals.protein += meal.protein || 0;
                    totals.carbs += meal.carbs || 0;
                    totals.fat += meal.fat || 0;
                    return totals;
                }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

                setConsumed(calculatedConsumption);
                setError(null);
            } catch (err) {
                console.error("Meal fetch error:", err);
                setError("Failed to load today's meals.");
            } finally {
                setMealsLoading(false);
            }
        };
        fetchMeals();
    }, [user]);
    
    if (mealsLoading || goalsLoading) {
        return <LoadingSpinner size="large" className="min-h-screen" />;
    }

    // Assign goals from the hook
    const calorieGoal = goals.tdee;
    const proteinGoal = goals.protein;
    const carbsGoal = goals.carbs;
    const fatGoal = goals.fat;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // Standard centered and padded container for the UI
            className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" 
        >
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 flex items-center">
                    <Utensils className="w-8 h-8 mr-3 text-green-600" />
                    Daily Meal Tracker
                </h1>

                {/* Macro/Calorie Goals Overview Card (NEW FEATURE DISPLAY) */}
                <div className="bg-white shadow-xl rounded-xl p-6 mb-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Your Nutrition Goals</h2>
                    {goals.tdee > 0 ? (
                        <div className="space-y-4">
                            
                            {/* Calorie Goal */}
                            <GoalProgress 
                                label="Total Calories" 
                                consumed={consumed.calories} 
                                max={calorieGoal} 
                                unit="kcal" 
                                color="green"
                            />
                            
                            {/* Macronutrients Goals */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                <GoalProgress 
                                    label="Protein" 
                                    consumed={consumed.protein} 
                                    max={proteinGoal} 
                                    unit="g" 
                                    color="blue"
                                />
                                <GoalProgress 
                                    label="Carbohydrates" 
                                    consumed={consumed.carbs} 
                                    max={carbsGoal} 
                                    unit="g" 
                                    color="orange"
                                />
                                <GoalProgress 
                                    label="Fats" 
                                    consumed={consumed.fat} 
                                    max={fatGoal} 
                                    unit="g" 
                                    color="pink"
                                />
                            </div>

                            <p className="text-sm text-gray-500 pt-2">
                                {goals.message}
                            </p>
                        </div>
                    ) : (
                        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
                            <p className="font-semibold">Calculation Error:</p>
                            <p>{goals.message} Please ensure your **Date of Birth, Gender, Height, and Weight (in kg)** are entered in your Profile section.</p>
                        </div>
                    )}
                </div>

                {/* Meal List and Add Meal Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Today's Meals ({todaysMeals.length})</h2>
                    <button className="btn-primary flex items-center px-4 py-2">
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Log New Meal
                    </button>
                </div>

                {error && <div className="text-red-500 p-3 bg-red-100 rounded-lg">{error}</div>}

                {todaysMeals.length > 0 ? (
                    <div className="space-y-4">
                        {todaysMeals.map((meal, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: index * 0.05 }}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">{meal.name || `Meal ${index + 1}`}</h3>
                                    <span className="text-gray-500 text-sm">{meal.time || 'Time Not Specified'}</span>
                                </div>
                                <p className="text-gray-700 text-xl font-bold mt-1">{meal.calories} kcal</p>
                                <p className="text-sm text-gray-600 mt-2">Macros: {meal.protein}g Protein | {meal.carbs}g Carbs | {meal.fat}g Fat</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-10 bg-white rounded-xl border border-gray-200">
                        <Utensils className="w-10 h-10 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No meals logged today. Click "Log New Meal" to start tracking!</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MealTracker;