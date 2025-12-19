'use client';

import { 
    BeakerIcon, 
    CheckBadgeIcon, 
    ClockIcon, 
    AdjustmentsHorizontalIcon 
} from "@heroicons/react/24/outline";

export default function WaterHistory({ history }) {
    if (!history || history.length === 0) {
        return (
            <div className="py-20 text-center space-y-4">
                <div className="bg-cyan-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <BeakerIcon className="w-8 h-8 text-cyan-200" />
                </div>
                <p className="text-slate-400 font-medium italic">No hydration logs yet. Start drinking!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {history.map((entry, index) => {
                const date = new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });

                const percentage = Math.min(Math.round((entry.amountMl / entry.targetMl) * 100), 100);
                const isGoalMet = percentage >= 100;

                return (
                    <div 
                        key={entry._id || index}
                        className="group relative bg-white hover:bg-cyan-50/30 transition-all duration-500 p-6 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row md:items-center gap-6 overflow-hidden shadow-sm hover:shadow-md"
                    >
                        {/* Soft Azure Glow on Hover */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* COLUMN 1: Date */}
                        <div className="relative z-10 md:w-32 flex-shrink-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-1">Entry Date</p>
                            <p className="text-sm font-bold text-slate-700 whitespace-nowrap">{date}</p>
                        </div>

                        {/* COLUMN 2: Amount (Volume) */}
                        <div className="relative z-10 md:w-32 flex-shrink-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-1">Total Intake</p>
                            <p className="text-xl font-black text-slate-900">
                                {entry.amountMl}<span className="text-xs ml-1 text-slate-400 font-bold">ml</span>
                            </p>
                        </div>

                        {/* COLUMN 3: Visual Progress Bar */}
                        <div className="relative z-10 flex-grow max-w-xs">
                            <div className="flex justify-between items-end mb-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Goal Reach</p>
                                <p className={`text-xs font-black ${isGoalMet ? 'text-cyan-600' : 'text-slate-400'}`}>
                                    {percentage}%
                                </p>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${isGoalMet ? 'bg-cyan-500' : 'bg-cyan-300'}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>

                        {/* COLUMN 4: Status Badge */}
                        <div className="relative z-10 md:w-40 flex justify-end">
                            {isGoalMet ? (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-200 animate-in zoom-in">
                                    <CheckBadgeIcon className="w-4 h-4" />
                                    Goal Achieved
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                    <ClockIcon className="w-4 h-4" />
                                    In Progress
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}   