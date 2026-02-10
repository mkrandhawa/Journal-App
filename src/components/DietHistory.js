'use client';
import { CalendarIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

export default function DietHistory({ history }) {

    if (history.length === 0) {
        return (
            <div className="p-6 sm:p-8 text-center text-gray-500 bg-gray-50 rounded-2xl">
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
                        className="bg-white p-4 sm:p-5 border border-gray-100 rounded-3xl shadow-lg transition hover:shadow-xl"
                    >
                        {/* Header/Status */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b pb-3 border-gray-100 gap-3 sm:gap-0">
                            {/* Date */}
                            <span className="text-lg sm:text-xl font-bold text-gray-700 flex items-center">
                                <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-500" />
                                {formatDate(entry.date)}
                            </span>
                            
                            <span className={`flex items-center justify-center sm:justify-start px-4 py-1 text-sm font-bold rounded-full transition duration-150 shadow-sm w-full sm:w-auto
                                ${goalMet ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}
                            `}>
                                {goalMet ? 
                                    (<><CheckCircleIcon className="w-4 h-4 mr-1" /> Deficit Maintained</>) : 
                                    (<><ExclamationCircleIcon className="w-4 h-4 mr-1" /> Calorie Excess</>)}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-3 sm:grid-cols-5 text-center gap-y-3 sm:gap-y-0 sm:divide-x divide-gray-100 mb-4"> 
                            
                            <div className="col-span-3 sm:col-span-1 p-2 bg-blue-50 rounded-xl sm:rounded-r-none sm:rounded-l-xl">
                                <p className="text-3xl font-extrabold text-blue-700">{entry.caloriesConsumed}</p>
                                <p className="text-xs text-blue-500 font-semibold mt-1 uppercase">Kcal Consumed</p>
                            </div>
                            
                            <div className="col-span-3 sm:col-span-1 p-2 flex flex-col justify-center">
                                <p className="text-xl font-bold text-gray-700">{entry.targetCalories}</p>
                                <p className="text-xs text-gray-400 mt-1 uppercase">Target</p>
                            </div>
                            
                            <div className="col-span-1 p-2">
                                <p className="text-lg sm:text-xl font-bold text-gray-700">{entry.proteinGrams || 0}g</p>
                                <p className="text-xs text-gray-400 mt-1">Protein</p>
                            </div>
                            <div className="col-span-1 p-2">
                                <p className="text-lg sm:text-xl font-bold text-gray-700">{entry.carbsGrams || 0}g</p>
                                <p className="text-xs text-gray-400 mt-1">Carbs</p>
                            </div>
                            <div className="col-span-1 p-2 sm:rounded-r-xl">
                                <p className="text-lg sm:text-xl font-bold text-gray-700">{entry.fatGrams || 0}g</p>
                                <p className="text-xs text-gray-400 mt-1">Fat</p>
                            </div>
                        </div>
                        
                        {entry.notes && (
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <p className="text-sm font-semibold text-gray-600 mb-1 flex items-center">
                                    <DocumentTextIcon className="w-4 h-4 mr-1.5 text-blue-400"/>
                                    Daily Reflection:
                                </p>
                                <blockquote className="p-3 bg-gray-50 border-l-4 border-blue-200 text-gray-600 italic text-sm sm:text-base rounded-r-lg break-words">
                                    {entry.notes}
                                </blockquote>
                            </div>
                        )}
                        
                    </div>
                );
            })}
        </div>
    );
}