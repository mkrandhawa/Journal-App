'use client';
import { CalendarIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

export default function DietHistory({ history}) {

    if (history.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-2xl">
                <ChartBarIcon className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                <p className="text-lg font-medium">No diet entries logged yet.</p>
                <p className="text-sm text-gray-400">Your history will appear here after your first submission.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pt-2">
            {history.map((entry) => {
                const goalMet = entry.caloriesConsumed <= entry.targetCalories;
                return (
                    <div 
                        key={entry._id} 
                        className="bg-white p-5 border border-gray-100 rounded-3xl shadow-lg transition hover:shadow-xl"
                    >
                        {/* Header/Status */}
                        <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-100">
                            {/* Date */}
                            <span className="text-xl font-bold text-gray-700 flex items-center">
                                <CalendarIcon className="w-6 h-6 mr-3 text-blue-500" />
                                {formatDate(entry.date)}
                            </span>
                            
                            <span  className={`flex items-center px-4 py-1 text-sm font-bold rounded-full transition duration-150 shadow-sm
                                ${goalMet ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}
                            `}>
                                {goalMet ? 
                                    (<><CheckCircleIcon className="w-4 h-4 mr-1" /> Deficit Maintained</>) : 
                                    (<><ExclamationCircleIcon className="w-4 h-4 mr-1" /> Calorie Excess</>)}
                            </span>
                        </div>

                        <div className="grid grid-cols-5 text-center divide-x divide-gray-100 mb-4"> 
                            
                            <div className="p-2 bg-blue-50 rounded-l-xl">
                                <p className="text-3xl font-extrabold text-blue-700">{entry.caloriesConsumed}</p>
                                <p className="text-xs text-blue-500 font-semibold mt-1">KCAL CONSUMED</p>
                            </div>
                            
                            <div className="p-2">
                                <p className="text-xl font-bold text-gray-700">{entry.targetCalories}</p>
                                <p className="text-xs text-gray-400 mt-1">Target</p>
                            </div>
                            
                            <div className="p-2">
                                <p className="text-xl font-bold text-gray-700">{entry.proteinGrams || 0}g</p>
                                <p className="text-xs text-gray-400 mt-1">Protein</p>
                            </div>
                            <div className="p-2">
                                <p className="text-xl font-bold text-gray-700">{entry.carbsGrams || 0}g</p>
                                <p className="text-xs text-gray-400 mt-1">Carbs</p>
                            </div>
                            <div className="p-2 rounded-r-xl">
                                <p className="text-xl font-bold text-gray-700">{entry.fatGrams || 0}g</p>
                                <p className="text-xs text-gray-400 mt-1">Fat</p>
                            </div>
                        </div>
                        
                        {entry.notes && (
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <p className="text-sm font-semibold text-gray-600 mb-1 flex items-center">
                                    <DocumentTextIcon className="w-4 h-4 mr-1.5 text-blue-400"/>
                                    Daily Reflection:
                                </p>
                                <blockquote className="p-3 bg-gray-50 border-l-4 border-blue-200 text-gray-600 italic rounded-r-lg">
                                    {entry.notes}
                                </blockquote>
                            </div>
                        )}
                        {/* --- END NOTES SECTION --- */}
                        
                    </div>
                );
            })}
        </div>
    );
}
