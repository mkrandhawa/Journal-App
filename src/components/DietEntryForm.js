'use client';
import { useState } from 'react';
import { ChartBarIcon, CalendarDaysIcon, FireIcon, PencilSquareIcon } from '@heroicons/react/24/outline'; 
import InputField from './inputFields';

const initialFormData = {
    
    caloriesConsumed: '',
    targetCalories: '', 
    proteinGrams: '',
    carbsGrams: '',
    fatGrams: '',
    notes: '',
    date: new Date().toISOString().split('T')[0], 
  
}
export default function DietEntryForm({ onEntryCreated }) {
  const [formData, setFormData] = useState(initialFormData);


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); 
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    console.log(`Field Changed: ${name} = ${value}`);
   setFormData(prev => ({
        ...prev,
        [name]: value,
        }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (!formData.caloriesConsumed || !formData.targetCalories) {
      setMessage({ type: 'error', text: 'Please enter Calories Consumed and Target Calories.' });
      setLoading(false);
      return;
    }

    const payload = {
        date: formData.date ? new Date(formData.date) : Date.now(),
        notes: formData.notes,
        caloriesConsumed: Number(formData.caloriesConsumed) || 0,
        targetCalories: Number(formData.targetCalories) || 0,
        proteinGrams: Number(formData.proteinGrams) || 0,
        carbsGrams: Number(formData.carbsGrams) || 0,
        fatGrams: Number(formData.fatGrams) || 0,
    };
    
    try {
      const response = await fetch('/api/diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Send the converted payload
      });

      const data = await response.json();
      

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Failed to save entry.';
        throw new Error(errorMessage);
      }

        setMessage({ type: 'success', text: 'Entry successfully logged! Check your history below.' });
        setFormData(prev => ({ 
            ...initialFormData,
            targetCalories: prev.targetCalories 
        })); 

      if (onEntryCreated) {
          onEntryCreated(data.data);
      }

    } catch (error) {
      console.error("Submission Error:", error);
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

//   const InputField = ({ label, name, type = 'number', placeholder, required = false, step = 1, min = 0, icon: Icon, onChange, isMacronutrient = false , value}) => (
//     <div className="flex flex-col">
//       <label htmlFor={name} className={`mb-1 text-sm font-medium ${isMacronutrient ? 'text-gray-500' : 'text-gray-700'}`}>
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         {Icon && (
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Icon className="w-5 h-5 text-gray-400" />
//           </div>
//         )}
//         <input
//           id={name}
//           name={name}
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           required={required}
//           min={min}
//           step={step}
//           className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition duration-150 ${Icon ? 'pl-10' : ''} text-gray-600`}
//         />
//       </div>
//     </div>
//   );


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center border-b pb-3 border-gray-100">
            <PencilSquareIcon className="w-6 h-6 mr-3 text-blue-500" /> 
            Daily Diet Entry
        </h2>

        {/* --- 1. CORE TRACKING SECTION (Date and Target) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <InputField 
                label="Date" 
                name="date" 
                type="date" 
                required={true} 
                value={formData.date}
                onChange={handleChange}
                icon={CalendarDaysIcon}
            />
            <InputField 
                label="Target Calories (kcal)" 
                name="targetCalories" 
                placeholder="e.g., 2000" 
                required={true}
                type='text'
                value={formData.targetCalories}
                onChange={handleChange}
                icon={ChartBarIcon}
            />
        </div>

        {/* --- 2. INTAKE SECTION --- */}
        <h3 className="text-xl font-semibold text-gray-700 pt-4">Intake & Macros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
                label="Calories Consumed (kcal)" 
                name="caloriesConsumed" 
                placeholder="e.g., 1850" 
                required={true}
                icon={FireIcon}
                type='text'
                value={formData.caloriesConsumed} 
                onChange={handleChange}

            />
            <div className="grid grid-cols-3 gap-3">
                <InputField 
                    label="Protein (g)" 
                    name="proteinGrams" 
                    placeholder="150" 
                    isMacronutrient={true} 
                    type='text' 
                    value={formData.proteinGrams}
                    onChange={handleChange}
                />
                <InputField 
                    label="Carbs (g)" 
                    name="carbsGrams" 
                    placeholder="200" 
                    isMacronutrient={true}  
                    type='text' 
                    value={formData.carbsGrams}
                    onChange={handleChange}
                />
                <InputField 
                    label="Fat (g)" 
                    name="fatGrams" 
                    placeholder="60" 
                    isMacronutrient={true}  
                    type='text' 
                    value={formData.fatGrams}
                    onChange={handleChange}
                />
            </div>
        </div>

        {/* --- 3. NOTES --- */}
        <div className="flex flex-col">
            <label htmlFor="notes" className="mb-2 text-sm font-medium text-gray-700 flex items-center">
                <PencilSquareIcon className="w-4 h-4 mr-1 text-gray-400" />
                Notes (Optional Reflection)
            </label>
            <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="E.g., Felt great today! Hit my protein goal and managed my energy well."
                className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition duration-150 text-gray-900 text-gray-600"
            ></textarea>
        </div>

        {/* --- 4. Submit Button and Messages --- */}
        <div>
            {message && (
                <div className={`p-3 mb-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}
            
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 text-white font-bold rounded-xl transition duration-300 shadow-lg 
                    flex items-center justify-center space-x-2 
                    ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'}
                `}
            >
                {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <>
                        <ChartBarIcon className="w-5 h-5" />
                        <span>Save Diet Entry</span>
                    </>
                )}
            </button>
        </div>
    </form>
  );
}
