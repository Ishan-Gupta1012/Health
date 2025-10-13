import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Trash2, Edit, X, Plus, Calendar, BookOpen, BrainCircuit } from 'lucide-react';
import { apiService } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

const MealTracker = () => {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({ mealType: 'Breakfast', foodItem: '', quantity: '', time: '' });
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('today'); // 'today' or 'history'
  const [editingMeal, setEditingMeal] = useState(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const mealData = view === 'today'
        ? await apiService.meals.getTodaysMeals()
        : await apiService.meals.getMealHistory();
      setMeals(mealData);

      if (view === 'today') {
        const adviceData = await apiService.meals.getAIAdvice();
        setAdvice(adviceData.advice);
      }
    } catch (err) {
      setError('Failed to fetch meal data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [view, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!newMeal.foodItem || !newMeal.quantity || !newMeal.time) {
      setError('Please fill in all fields to add a meal.');
      return;
    }
    setError('');
    try {
      await apiService.meals.addMeal(newMeal);
      setNewMeal({ mealType: 'Breakfast', foodItem: '', quantity: '', time: '' });
      fetchData(); // Refresh list
    } catch (err) {
      setError('Failed to add meal.');
      console.error(err);
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await apiService.meals.deleteMeal(id);
      setMeals(prevMeals => prevMeals.filter(meal => meal._id !== id));
    } catch (err) {
      setError('Failed to delete meal.');
      console.error(err);
    }
  };
  
  const handleUpdateMeal = async (e) => {
    e.preventDefault();
    if (!editingMeal) return;
    setError('');
    try {
      await apiService.meals.updateMeal(editingMeal._id, editingMeal);
      setEditingMeal(null);
      fetchData(); // Refresh list
    } catch (err) {
      setError('Failed to update meal.');
      console.error(err);
    }
  };

  const openEditModal = (meal) => {
    setEditingMeal({ ...meal });
  };
  
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

  const macroGoals = {
    carbs: (totalCalories * 0.4) / 4, // 4 kcal per gram
    protein: (totalCalories * 0.3) / 4, // 4 kcal per gram
    fat: (totalCalories * 0.3) / 9, // 9 kcal per gram
  };
  
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-black mb-2">Daily Nutrition Tracker</h1>
          <p className="text-black/80 mb-6">Log your meals to keep track of your diet and get AI-powered insights.</p>
        </motion.div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}
        
        <div className="flex space-x-2 mb-6">
            <button onClick={() => setView('today')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${view === 'today' ? 'bg-green-500 text-white shadow' : 'bg-white/50 text-black hover:bg-white/70'}`}>
                <Calendar className="inline-block w-4 h-4 mr-2"/>Today's Log
            </button>
            <button onClick={() => setView('history')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${view === 'history' ? 'bg-green-500 text-white shadow' : 'bg-white/50 text-black hover:bg-white/70'}`}>
                <BookOpen className="inline-block w-4 h-4 mr-2"/>7-Day History
            </button>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {view === 'today' && (
              <motion.div layout className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 text-black">Add a New Meal</h2>
                <form onSubmit={handleAddMeal} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black/80 mb-1">Meal Type</label>
                      <select name="mealType" value={newMeal.mealType} onChange={handleInputChange} className="input">
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black/80 mb-1">Time</label>
                      <input type="time" name="time" value={newMeal.time} onChange={handleInputChange} className="input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black/80 mb-1">Food Item</label>
                    <input type="text" name="foodItem" value={newMeal.foodItem} onChange={handleInputChange} placeholder="e.g., Oatmeal with berries" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black/80 mb-1">Quantity</label>
                    <input type="text" name="quantity" value={newMeal.quantity} onChange={handleInputChange} placeholder="e.g., 1 cup" className="input" />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2"/> Add Meal
                  </button>
                </form>
              </motion.div>
            )}

            <motion.div layout className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">{view === 'today' ? "Today's Meal Log" : "Meal History"}</h2>
              <div className="overflow-x-auto">
                {loading ? <p className="text-center text-black/70">Loading meals...</p> : meals.length === 0 ? <p className="text-center text-black/70">No meals logged for this period.</p> :
                  <table className="min-w-full text-sm text-black">
                    <thead className="bg-black/10">
                      <tr>
                        <th className="p-3 text-left font-semibold">Meal Type</th>
                        <th className="p-3 text-left font-semibold">Food Item</th>
                        <th className="p-3 text-left font-semibold">Quantity</th>
                        <th className="p-3 text-left font-semibold">Time</th>
                        <th className="p-3 text-left font-semibold">Calories</th>
                        <th className="p-3 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meals.map(meal => (
                        <tr key={meal._id} className="border-b border-black/10 hover:bg-black/5">
                          <td className="p-3">{meal.mealType}</td>
                          <td className="p-3">{meal.foodItem}</td>
                          <td className="p-3">{meal.quantity}</td>
                          <td className="p-3">{meal.time}</td>
                          <td className="p-3 font-medium">~{meal.calories} kcal</td>
                          <td className="p-3 text-center">
                            <button onClick={() => openEditModal(meal)} className="text-blue-600 hover:text-blue-800 mr-2"><Edit size={16}/></button>
                            <button onClick={() => handleDeleteMeal(meal._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div layout className="glass-card p-6 text-center">
              <h2 className="font-semibold text-black">Total Calories</h2>
              <p className="text-4xl font-bold text-green-600 my-2">{totalCalories} kcal</p>
            </motion.div>

            <motion.div layout className="glass-card p-6">
              <h2 className="font-semibold mb-3 text-black">Macronutrient Breakdown (Estimates)</h2>
              <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium text-black/80">Carbs</span><span className="text-black/80">{macroGoals.carbs.toFixed(0)}g</span></div>
                    <div className="w-full bg-gray-200/50 rounded-full h-2.5"><div className="bg-green-400 h-2.5 w-[40%] rounded-full"></div></div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium text-black/80">Protein</span><span className="text-black/80">{macroGoals.protein.toFixed(0)}g</span></div>
                    <div className="w-full bg-gray-200/50 rounded-full h-2.5"><div className="bg-blue-400 h-2.5 w-[30%] rounded-full"></div></div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium text-black/80">Fat</span><span className="text-black/80">{macroGoals.fat.toFixed(0)}g</span></div>
                    <div className="w-full bg-gray-200/50 rounded-full h-2.5"><div className="bg-yellow-400 h-2.5 w-[30%] rounded-full"></div></div>
                </div>
              </div>
            </motion.div>

            {view === 'today' && (
              <motion.div layout className="glass-card p-6">
                <h2 className="font-semibold mb-3 text-black flex items-center"><BrainCircuit className="w-5 h-5 mr-2 text-green-600"/>Personalized Health Advice</h2>
                <p className="text-black/80 text-sm leading-relaxed">{advice || 'Log your meals yesterday to see advice here!'}</p>
              </motion.div>
            )}
          </div>
        </div>
        
        <p className="text-center text-xs text-black/60 mt-8">
            This information is for general guidance only and does not substitute professional medical advice. Always consult with a healthcare provider for personalized health recommendations.
        </p>
      </div>

      <AnimatePresence>
        {editingMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card w-full max-w-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">Edit Meal</h2>
                <button onClick={() => setEditingMeal(null)} className="text-black/50 hover:text-black"><X /></button>
              </div>
              <form onSubmit={handleUpdateMeal} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black/80 mb-1">Meal Type</label>
                    <select name="mealType" value={editingMeal.mealType} onChange={(e) => setEditingMeal({...editingMeal, mealType: e.target.value})} className="input">
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                      <option>Snack</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black/80 mb-1">Time</label>
                    <input type="time" name="time" value={editingMeal.time} onChange={(e) => setEditingMeal({...editingMeal, time: e.target.value})} className="input" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/80 mb-1">Food Item</label>
                  <input type="text" name="foodItem" value={editingMeal.foodItem} onChange={(e) => setEditingMeal({...editingMeal, foodItem: e.target.value})} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/80 mb-1">Quantity</label>
                  <input type="text" name="quantity" value={editingMeal.quantity} onChange={(e) => setEditingMeal({...editingMeal, quantity: e.target.value})} className="input" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealTracker;

