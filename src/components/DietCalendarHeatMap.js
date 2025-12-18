'use client';
import { useMemo } from 'react';
import { FireIcon } from '@heroicons/react/24/outline';

const getDayColor = (entry) => {
    if (!entry) {
        return 'bg-gray-100'; 
    }
    if (entry.caloriesConsumed <= entry.targetCalories) {
        return 'bg-green-400 hover:bg-green-500'; 
    }
    return 'bg-red-400 hover:bg-red-500'; 
};

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DietCalendarHeatmap({ history }) {
    const dailyData = useMemo(() => {
        const map = new Map();
        history.forEach(entry => {
            const dateKey = new Date(entry.date).toISOString().split('T')[0];
            map.set(dateKey, entry);
        });
        return map;
    }, [history]);

    const today = useMemo(() => new Date(), []);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday...

    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    const calendarDays = useMemo(() => {
        const days = [];

        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({ id: `blank-${i}`, isPlaceholder: true });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(today.getFullYear(), today.getMonth(), day);
            const dateKey = date.toISOString().split('T')[0];
            const entry = dailyData.get(dateKey);

            days.push({ 
                id: dateKey, 
                dayOfMonth: day,
                entry: entry,
                isToday: day === today.getDate() && date.getMonth() === today.getMonth(),
                colorClass: getDayColor(entry),
            });
        }
        return days;
    }, [daysInMonth, startDayOfWeek, dailyData, today]);


    return (
        <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Overview
            </h3>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-gray-500 mb-2">
                {dayLabels.map(day => (
                    <div key={day} className="p-1">{day}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map(day => (
                    <div 
                        key={day.id} 
                        className={`relative aspect-square rounded-lg transition duration-200 cursor-pointe
                            ${day.isPlaceholder ? 'bg-transparent' : day.colorClass} 
                            ${day.isToday ? 'border-2 border-blue-500 shadow-lg' : ''}
                        `}
                        title={day.entry 
                            ? `${day.dayOfMonth}: Consumed ${day.entry.caloriesConsumed} kcal / Target ${day.entry.targetCalories} kcal` 
                            : `Day ${day.dayOfMonth}: No entry`}
                    >
                        {!day.isPlaceholder && (
                            <span className={`absolute top-1 left-1 text-xs font-medium 
                                ${day.entry ? 'text-white' : 'text-gray-500'}
                            `}>
                                {day.dayOfMonth}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center items-center mt-4 space-x-4 text-sm">
                <div className="flex items-center text-gray-700">
                    <span className="w-3 h-3 rounded-full bg-green-400 mr-1.5 "></span>
                    Goal Met
                </div>
                <div className="flex items-center text-gray-700">
                    <span className="w-3 h-3 rounded-full bg-red-400 mr-1.5"></span>
                    Over Target
                </div>
                <div className="flex items-center text-gray-700">
                    <span className="w-3 h-3 rounded-full bg-gray-100 mr-1.5 border border-gray-300"></span>
                    No Entry
                </div>
            </div>
        </div>
    );
}
