'use client';
import { ScaleIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon, MinusIcon } from '@heroicons/react/24/solid';

export default function WeightHistory({ history }) {
    const getWeightChange = (current, index) => {
        const previousEntry = history[index + 1];
        if (!previousEntry) return { diff: 0, color: 'text-gray-400', icon: MinusIcon };

        const diff = current - previousEntry.weight;
        
        // Logic: Red for gain > 0.5kg, Green for loss > 0.1kg
        if (diff > 0.5) return { diff: `+${diff.toFixed(1)}`, color: 'text-red-500', icon: ArrowTrendingUpIcon };
        if (diff < -0.1) return { diff: `${diff.toFixed(1)}`, color: 'text-green-500', icon: ArrowTrendingDownIcon };
        return { diff: 'Stable', color: 'text-blue-400', icon: MinusIcon };
    };

    return (
        <div className="space-y-4">
            {history.map((entry, index) => {
                const change = getWeightChange(entry.weight, index);
                const dateObj = new Date(entry.date);

                return (
                    <div key={entry._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl bg-gray-50 ${change.color}`}>
                                <change.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">{dateObj.toLocaleDateString()}</p>
                                <p className="text-2xl font-black text-gray-800">{entry.weight}<span className="text-sm ml-1 text-gray-400 font-normal">kg</span></p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Change</p>
                            <p className={`text-lg font-bold ${change.color}`}>{change.diff}</p>
                        </div>
                        
                        <div className="hidden md:block text-center border-l border-gray-100 pl-6">
                            <p className="text-xs font-bold text-gray-400 uppercase">BMI</p>
                            <p className="text-lg font-bold text-gray-700">{entry.BMI || '--'}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}