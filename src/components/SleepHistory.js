'use client';

import { MoonIcon, SunIcon, SparklesIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function SleepHistory({ history }) {
    if (!history || history.length === 0) {
        return (
            <div className="py-20 text-center space-y-4">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <MoonIcon className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-medium italic">Your dream journal is empty...</p>
            </div>
        );
    }

    const getMoodStyle = (mood) => {
        switch (mood) {
            case 'Energized': return { icon: <SparklesIcon className="w-5 h-5" />, color: 'text-amber-500 bg-amber-50' };
            case 'Refreshed': return { icon: <SunIcon className="w-5 h-5" />, color: 'text-emerald-500 bg-emerald-50' };
            case 'Okay': return { icon: <MoonIcon className="w-5 h-5" />, color: 'text-indigo-500 bg-indigo-50' };
            case 'Tired': return { icon: <MoonIcon className="w-5 h-5" />, color: 'text-slate-400 bg-slate-100' };
            default: return { icon: <MoonIcon className="w-5 h-5" />, color: 'text-slate-400 bg-slate-50' };
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {history.map((entry, index) => {
                const mood = getMoodStyle(entry.wakeMood);
                const date = new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });

                return (
                    <div 
                        key={entry._id || index}
                        className="group relative bg-white hover:bg-slate-50 transition-all duration-500 p-6 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row md:items-center gap-6 overflow-hidden shadow-sm hover:shadow-md"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 md:w-28 flex-shrink-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-1">Night of</p>
                            <p className="text-sm font-bold text-slate-700 whitespace-nowrap">{date}</p>
                        </div>

                        <div className="relative z-10 md:w-28 flex-shrink-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-1">Duration</p>
                            <p className="text-xl font-black text-slate-900">
                                {entry.hoursSlept}<span className="text-xs ml-1 text-slate-400">hrs</span>
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-wrap items-center gap-3 md:w-72 flex-shrink-0">
                            <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-slate-200">
                                {entry.sleepQuality} Quality
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${mood.color}`}>
                                {mood.icon}
                                {entry.wakeMood}
                            </div>
                        </div>

                        <div className="relative z-10 flex items-center gap-2 flex-grow min-w-0 text-slate-400 italic text-sm border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                            <ChatBubbleLeftRightIcon className="w-4 h-4 flex-shrink-0 opacity-50" />
                            <p className="truncate line-clamp-1">{entry.notes || 'No notes for this night...'}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}