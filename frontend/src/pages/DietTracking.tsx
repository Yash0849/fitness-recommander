// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { dietLogAPI } from '../lib/api';
// import { DietLog } from '../lib/localStorage';
// import { Apple, Plus, PieChart, Coffee, Sun, Moon, Trash2 } from 'lucide-react';
// import Modal from '../components/Modal';

// export default function DietTracking() {
//   const { user } = useAuth();
//   const [dietLogs, setDietLogs] = useState<DietLog[]>([]);
//   const [selectedMeal, setSelectedMeal] = useState<string>('all');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
//   const [logToDelete, setLogToDelete] = useState<string | null>(null);
//   const [newMeal, setNewMeal] = useState({
//     foodName: '',
//     calories: '',
//     protein: '',
//     carbs: '',
//     fats: '',
//     mealType: 'breakfast'
//   });

//   useEffect(() => {
//     if (user) {
//       loadDietLogs();
//     }
//   }, [user]);

//   const loadDietLogs = async () => {
//     try {
//       const response = await dietLogAPI.getAll();
//       setDietLogs(response);
//     } catch (error) {
//       console.error('Failed to load diet logs:', error);
//     }
//   };

//   const meals = [
//     { id: 'all', name: 'All Meals', icon: Apple },
//     { id: 'breakfast', name: 'Breakfast', icon: Sun },
//     { id: 'lunch', name: 'Lunch', icon: Coffee },
//     { id: 'dinner', name: 'Dinner', icon: Moon },
//   ];

//   const filteredLogs = selectedMeal === 'all' 
//     ? dietLogs 
//     : dietLogs.filter(log => log.mealType === selectedMeal);

//   const totalNutrition = filteredLogs.reduce((acc, log) => ({
//     calories: (acc.calories || 0) + (log.calories || 0),
//     protein: (acc.protein || 0) + (log.protein || 0),
//     carbs: (acc.carbs || 0) + (log.carbs || 0),
//     fats: (acc.fats || 0) + (log.fats || 0),
//   }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

//   const handleAddMeal = async () => {
//     if (!newMeal.foodName.trim()) return;

//     try {
//       const response = await dietLogAPI.create({
//         meals: [{
//           name: newMeal.foodName,
//           calories: parseFloat(newMeal.calories) || 0,
//           protein: parseFloat(newMeal.protein) || 0,
//           carbs: parseFloat(newMeal.carbs) || 0,
//           fat: parseFloat(newMeal.fats) || 0
//         }],
//         totalCalories: parseFloat(newMeal.calories) || 0
//       });
      
//       // Handle both direct object and nested object responses
//       const newDietLog = response.dietLog || response;
//       setDietLogs([newDietLog, ...dietLogs]);
//       setNewMeal({
//         foodName: '',
//         calories: '',
//         protein: '',
//         carbs: '',
//         fats: '',
//         mealType: 'breakfast'
//       });
//       setShowAddModal(false);
//     } catch (error) {
//       console.error('Failed to add meal:', error);
//     }
//   };

//   const handleDeleteMeal = async () => {
//     if (!logToDelete) return;

//     try {
//       await dietLogAPI.delete(logToDelete);
//       setDietLogs(dietLogs.filter(log => log.id !== logToDelete));
//       setLogToDelete(null);
//       setShowDeleteConfirmModal(false);
//     } catch (error) {
//       console.error('Failed to delete meal:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Diet Tracking</h1>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
//         >
//           <Plus className="w-5 h-5" />
//           <span>Log Meal</span>
//         </button>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
//             <div className="border-b">
//               <div className="flex overflow-x-auto p-4 space-x-4">
//                 {meals.map(meal => (
//                   <button
//                     key={meal.id}
//                     onClick={() => setSelectedMeal(meal.id)}
//                     className={`flex items-center space-x-2 px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
//                       selectedMeal === meal.id
//                         ? 'bg-green-600 text-white'
//                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                     }`}
//                   >
//                     <meal.icon className="w-4 h-4" />
//                     <span>{meal.name}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="p-6">
//               {filteredLogs.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Apple className="w-8 h-8 text-green-600" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">No meals logged</h3>
//                   <p className="text-gray-600 mb-6">Start tracking your nutrition</p>
//                   <button
//                     onClick={() => setShowAddModal(true)}
//                     className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
//                   >
//                     Log First Meal
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {filteredLogs.map(log => (
//                     <div key={log.id} className="bg-gray-50 rounded-xl p-6">
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center space-x-4">
//                           <div className="bg-green-100 p-3 rounded-xl">
//                             <Apple className="w-6 h-6 text-green-600" />
//                           </div>
//                           <div>
//                             <h3 className="text-lg font-semibold">{log.foodName}</h3>
//                             <p className="text-gray-500">{log.mealType}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                           <p className="text-lg font-semibold">{log.calories} kcal</p>
//                           <button
//                             onClick={() => handleDeleteMeal()}
//                             className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
//                           >
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-3 gap-4">
//                         <div className="bg-white p-3 rounded-lg text-center">
//                           <p className="text-sm text-gray-500">Protein</p>
//                           <p className="font-semibold">{log.protein}g</p>
//                         </div>
//                         <div className="bg-white p-3 rounded-lg text-center">
//                           <p className="text-sm text-gray-500">Carbs</p>
//                           <p className="font-semibold">{log.carbs}g</p>
//                         </div>
//                         <div className="bg-white p-3 rounded-lg text-center">
//                           <p className="text-sm text-gray-500">Fats</p>
//                           <p className="font-semibold">{log.fats}g</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-3xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-6 flex items-center">
//             <PieChart className="w-6 h-6 mr-2 text-green-600" />
//             Nutrition Summary
//           </h2>
//           <div className="space-y-6">
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <p className="text-gray-500 mb-1">Total Calories</p>
//               <p className="text-2xl font-bold">{totalNutrition.calories} kcal</p>
//             </div>
//             <div className="space-y-4">
//               <div className="bg-gray-50 p-4 rounded-xl">
//                 <p className="text-gray-500 mb-1">Protein</p>
//                 <p className="text-xl font-semibold">{totalNutrition.protein}g</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl">
//                 <p className="text-gray-500 mb-1">Carbs</p>
//                 <p className="text-xl font-semibold">{totalNutrition.carbs}g</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl">
//                 <p className="text-gray-500 mb-1">Fats</p>
//                 <p className="text-xl font-semibold">{totalNutrition.fats}g</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Modal
//         isOpen={showAddModal}
//         onClose={() => setShowAddModal(false)}
//         title="Log New Meal"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Food Name
//             </label>
//             <input
//               type="text"
//               value={newMeal.foodName}
//               onChange={(e) => setNewMeal({ ...newMeal, foodName: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Enter food name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Meal Type
//             </label>
//             <select
//               value={newMeal.mealType}
//               onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             >
//               <option value="breakfast">Breakfast</option>
//               <option value="lunch">Lunch</option>
//               <option value="dinner">Dinner</option>
//               <option value="snack">Snack</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Calories
//               </label>
//               <input
//                 type="number"
//                 value={newMeal.calories}
//                 onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="kcal"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Protein
//               </label>
//               <input
//                 type="number"
//                 value={newMeal.protein}
//                 onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="grams"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Carbs
//               </label>
//               <input
//                 type="number"
//                 value={newMeal.carbs}
//                 onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="grams"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Fats
//               </label>
//               <input
//                 type="number"
//                 value={newMeal.fats}
//                 onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="grams"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               onClick={() => setShowAddModal(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleAddMeal}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               Save Meal
//             </button>
//           </div>
//         </div>
//       </Modal>

//       <Modal
//         isOpen={showDeleteConfirmModal}
//         onClose={() => {
//           setShowDeleteConfirmModal(false);
//           setLogToDelete(null);
//         }}
//         title="Delete Meal"
//       >
//         <div className="space-y-4">
//           <p className="text-gray-600">Are you sure you want to delete this meal? This action cannot be undone.</p>
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={() => {
//                 setShowDeleteConfirmModal(false);
//                 setLogToDelete(null);
//               }}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDeleteMeal}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage, DietLog } from '../lib/localStorage';
import { foodAPI } from '../lib/api';
import { getAllFoodNames } from '../lib/foodDatabase';
import { Apple, Plus, PieChart, Coffee, Sun, Moon, Trash2, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';
import { Link } from 'react-router-dom';

const formatMealLabel = (mealType: string) => mealType.charAt(0).toUpperCase() + mealType.slice(1);

export default function DietTracking() {
  const { user } = useAuth();
  const [dietLogs, setDietLogs] = useState<DietLog[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [newMeal, setNewMeal] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    mealType: 'breakfast'
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingNutrition, setIsLoadingNutrition] = useState(false);
  const [nutritionError, setNutritionError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      const userDietLogs = storage.getDietLogs(user.id);
      setDietLogs(userDietLogs);
    }
  }, [user]);

  // Get food suggestions from both local database and previous entries
  const getFoodSuggestions = () => {
    const suggestions = new Set<string>();
    
    // Add all foods from local database (Indian foods, snacks, fruits, common foods)
    const localFoodNames = getAllFoodNames();
    localFoodNames.forEach(name => suggestions.add(name));
    
    // Add previously logged foods
    if (user) {
      const allLogs = storage.getDietLogs(user.id);
      allLogs.forEach(log => {
        suggestions.add(log.foodName);
      });
    }
    
    return Array.from(suggestions).sort();
  };

  const handleFoodNameChange = (value: string) => {
    setNewMeal({ ...newMeal, foodName: value });
    setNutritionError(null);
    
    const allSuggestions = getFoodSuggestions();
    if (value.trim().length > 0) {
      const filtered = allSuggestions.filter(food => 
        food.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      
      // Debounce API call - fetch nutrition after user stops typing for 1 second
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(async () => {
        const currentValue = value.trim();
        if (currentValue.length > 2) { // Only search if at least 3 characters
          setIsLoadingNutrition(true);
          try {
            const nutrition = await foodAPI.searchFood(currentValue);
            if (nutrition) {
              // Preserve user's food name, only update nutrition values
              setNewMeal(prev => ({
                ...prev,
                foodName: currentValue, // Keep the user's entered food name
                calories: nutrition.calories.toString(),
                protein: nutrition.protein.toString(),
                carbs: nutrition.carbs.toString(),
                fats: nutrition.fats.toString(),
              }));
              setNutritionError(null);
            } else {
              setNutritionError('Nutrition data not found. Please enter manually.');
            }
          } catch (error) {
            console.error('Error fetching nutrition:', error);
            setNutritionError('Unable to fetch nutrition data. Please enter manually.');
          } finally {
            setIsLoadingNutrition(false);
          }
        }
      }, 1000); // Wait 1 second after user stops typing
    } else {
      // Show all suggestions when input is empty
      setSuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0);
      setIsLoadingNutrition(false);
      setNutritionError(null);
    }
  };

  const selectSuggestion = async (foodName: string) => {
    setShowSuggestions(false);
    setNutritionError(null);
    
    // Auto-fill nutrition if available from previous entry
    if (user) {
      const allLogs = storage.getDietLogs(user.id);
      const previousEntry = allLogs.find(log => 
        log.foodName.toLowerCase() === foodName.toLowerCase()
      );
      if (previousEntry && previousEntry.calories) {
        // Use functional update to ensure we have the latest state
        setNewMeal(prev => ({
          ...prev,
          foodName,
          calories: previousEntry.calories?.toString() || '',
          protein: previousEntry.protein?.toString() || '',
          carbs: previousEntry.carbs?.toString() || '',
          fats: previousEntry.fats?.toString() || '',
        }));
      } else {
        // If not found in previous entries, fetch from API
        setIsLoadingNutrition(true);
        try {
          const nutrition = await foodAPI.searchFood(foodName);
          if (nutrition) {
            // Preserve user's food name, only update nutrition values
            setNewMeal(prev => ({
              ...prev,
              foodName, // Keep the user's entered food name
              calories: nutrition.calories.toString(),
              protein: nutrition.protein.toString(),
              carbs: nutrition.carbs.toString(),
              fats: nutrition.fats.toString(),
            }));
            setNutritionError(null);
          } else {
            // Set food name even if nutrition not found
            setNewMeal(prev => ({
              ...prev,
              foodName,
            }));
            setNutritionError('Nutrition data not found. Please enter manually.');
          }
        } catch (error) {
          console.error('Error fetching nutrition:', error);
          // Set food name even if API fails
          setNewMeal(prev => ({
            ...prev,
            foodName,
          }));
          setNutritionError('Unable to fetch nutrition data. Please enter manually.');
        } finally {
          setIsLoadingNutrition(false);
        }
      }
    }
  };

  const meals = [
    { id: 'all', name: 'All Meals', icon: Apple },
    { id: 'breakfast', name: 'Breakfast', icon: Sun },
    { id: 'lunch', name: 'Lunch', icon: Coffee },
    { id: 'dinner', name: 'Dinner', icon: Moon },
  ];

  const filteredLogs = selectedMeal === 'all' 
    ? dietLogs 
    : dietLogs.filter(log => log.mealType === selectedMeal);

  const totalNutrition = filteredLogs.reduce((acc, log) => ({
    calories: (acc.calories || 0) + (log.calories || 0),
    protein: (acc.protein || 0) + (log.protein || 0),
    carbs: (acc.carbs || 0) + (log.carbs || 0),
    fats: (acc.fats || 0) + (log.fats || 0),
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const summaryCards = [
    {
      label: 'Protein',
      value: `${totalNutrition.protein}g`,
      tone: 'from-emerald-500/20 to-cyan-500/10',
      text: 'text-emerald-100',
    },
    {
      label: 'Carbs',
      value: `${totalNutrition.carbs}g`,
      tone: 'from-amber-500/20 to-orange-500/10',
      text: 'text-amber-100',
    },
    {
      label: 'Fats',
      value: `${totalNutrition.fats}g`,
      tone: 'from-rose-500/20 to-fuchsia-500/10',
      text: 'text-rose-100',
    },
  ];

  const handleAddMeal = () => {
    if (!user || !newMeal.foodName) return;

    const meal: DietLog = {
      id: crypto.randomUUID(),
      userId: user.id,
      foodName: newMeal.foodName,
      calories: parseInt(newMeal.calories) || 0,
      protein: parseFloat(newMeal.protein) || 0,
      carbs: parseFloat(newMeal.carbs) || 0,
      fats: parseFloat(newMeal.fats) || 0,
      mealType: newMeal.mealType,
      loggedAt: new Date().toISOString()
    };

    storage.saveDietLog(meal);
    setDietLogs([...dietLogs, meal]);
    setNewMeal({
      foodName: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      mealType: 'breakfast'
    });
    setShowAddModal(false);
    setNutritionError(null);
    setIsLoadingNutrition(false);
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  const handleDeleteMeal = (logId: string) => {
    setLogToDelete(logId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteMeal = () => {
    if (!logToDelete) return;

    storage.deleteDietLog(logToDelete);
    setDietLogs(dietLogs.filter(log => log.id !== logToDelete));
    setLogToDelete(null);
    setShowDeleteConfirmModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Nutrition Dashboard</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-white">Diet Tracking</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Track meals, keep macros visible at a glance, and maintain a cleaner nutrition log that matches the rest of your workspace.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-95"
        >
          <Plus className="w-5 h-5" />
          <span>Log Meal</span>
        </button>
      </div>

      <div className="mb-8 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-slate-900 via-emerald-900 to-cyan-700 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-100">AI Food Vision</p>
            <h2 className="mt-2 text-2xl font-semibold">Scan meals from photos and auto-add nutrition to your tracker</h2>
            <p className="mt-2 max-w-2xl text-sm text-emerald-50/90">
              Use the new AI vision workspace to recognize food from an uploaded image or camera capture, estimate macros, and sync the result into this diet log automatically.
            </p>
          </div>
          <Link
            to="/ai-vision"
            className="inline-flex rounded-2xl bg-white px-5 py-3 font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Open Vision AI
          </Link>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-xl shadow-slate-950/30 backdrop-blur">
            <div className="border-b border-white/10 px-5 py-5">
              <div className="flex flex-wrap gap-3">
                {meals.map(meal => (
                  <button
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-base font-medium transition ${
                      selectedMeal === meal.id
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <meal.icon className="w-4 h-4" />
                    <span>{meal.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {filteredLogs.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-cyan-400/20 bg-white/5 px-6 py-14 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <Apple className="w-8 h-8" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">No meals logged</h3>
                  <p className="mb-6 text-slate-400">Start building your nutrition history with your first meal entry.</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-medium text-white transition hover:opacity-95"
                  >
                    Log First Meal
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {filteredLogs.map(log => (
                    <div key={log.id} className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-slate-800/95 to-slate-900/95 p-6 shadow-lg shadow-slate-950/20">
                      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                            <Apple className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                              {formatMealLabel(log.mealType)}
                            </div>
                            <h3 className="mt-3 text-2xl font-semibold text-white">{log.foodName}</h3>
                            <p className="mt-1 text-sm text-slate-400">
                              Logged {new Date(log.loggedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:pl-4">
                          <div className="rounded-2xl border border-cyan-400/15 bg-cyan-500/10 px-4 py-3 text-right">
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Calories</p>
                            <p className="mt-1 text-xl font-semibold text-cyan-50">{log.calories} kcal</p>
                          </div>
                          <button
                            onClick={() => handleDeleteMeal(log.id)}
                            className="rounded-full p-3 text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                          <p className="text-sm text-slate-400">Protein</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{log.protein}g</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                          <p className="text-sm text-slate-400">Carbs</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{log.carbs}g</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                          <p className="text-sm text-slate-400">Fats</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{log.fats}g</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-panel glow-border h-fit rounded-[2rem] p-6 xl:sticky xl:top-28">
          <h2 className="mb-6 flex items-center text-xl font-semibold text-white">
            <PieChart className="mr-3 h-6 w-6 text-emerald-300" />
            Nutrition Summary
          </h2>
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-transparent p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-200/75">Total Calories</p>
              <p className="mt-3 text-4xl font-semibold text-white">{totalNutrition.calories}</p>
              <p className="mt-1 text-sm text-slate-300">kcal in the current view</p>
            </div>
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-[1.5rem] border border-white/10 bg-gradient-to-br ${card.tone} p-5`}
              >
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">{card.label}</p>
                <p className={`mt-3 text-3xl font-semibold ${card.text}`}>{card.value}</p>
              </div>
            ))}
            <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              Filtering by <span className="font-medium text-white">{meals.find((meal) => meal.id === selectedMeal)?.name}</span>
              {' '}keeps the summary aligned with the meal list on the left.
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log New Meal"
      >
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
              {isLoadingNutrition && (
                <span className="ml-2 text-xs text-gray-500 flex items-center inline-flex">
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Fetching nutrition...
                </span>
              )}
            </label>
            <input
              type="text"
              value={newMeal.foodName}
              onChange={(e) => handleFoodNameChange(e.target.value)}
              onFocus={() => {
                const allSuggestions = getFoodSuggestions();
                if (newMeal.foodName.trim().length > 0) {
                  const filtered = allSuggestions.filter(food => 
                    food.toLowerCase().includes(newMeal.foodName.toLowerCase())
                  );
                  setSuggestions(filtered);
                  setShowSuggestions(filtered.length > 0);
                } else {
                  // Show all suggestions when input is focused and empty
                  setSuggestions(allSuggestions);
                  setShowSuggestions(allSuggestions.length > 0);
                }
              }}
              onBlur={(e) => {
                // Only hide suggestions if clicking outside the suggestions dropdown
                // Check if the related target is not within the suggestions dropdown
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget || !relatedTarget.closest('.suggestions-dropdown')) {
                  setTimeout(() => setShowSuggestions(false), 200);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter food name (e.g., apple, chicken breast)"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={(e) => {
                      // Prevent blur event from firing
                      e.preventDefault();
                      selectSuggestion(suggestion);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 transition hover:bg-green-50 hover:text-slate-900 focus:bg-green-50 focus:text-slate-900 focus:outline-none"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {nutritionError && (
              <p className="mt-1 text-xs text-amber-600">{nutritionError}</p>
            )}
            {newMeal.foodName.trim().length > 2 && !isLoadingNutrition && !nutritionError && (
              <p className="mt-1 text-xs text-gray-500">
                Nutrition data will auto-fill when available
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Type
            </label>
            <select
              value={newMeal.mealType}
              onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calories
              </label>
              <input
                type="number"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="kcal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Protein
              </label>
              <input
                type="number"
                value={newMeal.protein}
                onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="grams"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carbs
              </label>
              <input
                type="number"
                value={newMeal.carbs}
                onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="grams"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fats
              </label>
              <input
                type="number"
                value={newMeal.fats}
                onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="grams"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMeal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Meal
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setLogToDelete(null);
        }}
        title="Delete Meal"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this meal? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setLogToDelete(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteMeal}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
