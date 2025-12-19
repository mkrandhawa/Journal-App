'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WaterEntryForm from "@/components/WaterEntryForm"; 
import WaterHistory from "@/components/WaterHistory";
import { BeakerIcon, SparklesIcon, CloudIcon, WaterIcon, WavesIcon } from "@heroicons/react/24/outline";

export default function WaterTrackerPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    const todayStr = new Date().toISOString().split('T')[0];
    
    const todayEntry = history.find(entry => 
        new Date(entry.date).toISOString().split('T')[0] === todayStr
    );

    const fetchHistory = async () => {
        setDataLoading(true);
        try {
            const response = await fetch('/api/water');
            const result = await response.json();
            if (response.ok) setHistory(result.data);
        } catch (error) {
            console.error("Error fetching water history:", error);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') fetchHistory();
        if (status === 'unauthenticated' && status !== 'loading') router.push('/login');
    }, [status, router]);

    if (status === 'loading' || dataLoading) {
        return (
            <div className="flex flex-col items-center justify-center pt-32 space-y-4 bg-slate-50">
                <div className="w-10 h-10 border-4 border-cyan-100 border-t-cyan-500 rounded-full animate-spin" />
                <p className="text-cyan-900/40 font-medium tracking-widest uppercase text-xs">Purifying...</p>
            </div>
             
        );
    }

    const avgIntake = history.length > 0 
        ? (history.reduce((acc, curr) => acc + (curr.amountMl || 0), 0) / history.length).toFixed(0) 
        : "0";

    if (status === 'authenticated') {
        const userName = session.user.name ? session.user.name.split(' ')[0] : 'User';
        const percentage = todayEntry ? Math.min(Math.round((todayEntry.amountMl / todayEntry.targetMl) * 100), 100) : 0;
    
        return (
            <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4 animate-in fade-in duration-1000">
                
                <div className="border-b border-slate-100">
                    <div className="border-b border-slate-100 "> 
                        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 tracking-tighter leading-[1.2] block">
                            {userName}&apos;s Hydration
                        </h1>
                        <p className="text-xl text-slate-400 font-medium mt-2 italic">
                            Stay fluid, stay focused. Fuel your cells.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* --- MAIN ACTION AREA --- */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-cyan-50 h-fit animate-in slide-in-from-bottom-8 duration-1000">
                            <WaterEntryForm 
                                currentEntry={todayEntry}
                               onEntryCreated={(updatedDay) => {
                                setHistory(prev => {
                                    const updatedDate = new Date(updatedDay.date).toDateString();
                                    
                                    const exists = prev.some(entry => new Date(entry.date).toDateString() === updatedDate);

                                    if (!exists) {
                                        return [updatedDay, ...prev];
                                    }

                                    return prev.map(entry => 
                                        new Date(entry.date).toDateString() === updatedDate ? updatedDay : entry
                                    );
                                  });
                             }}
                            />
                        </div>
                    </div>

                    {/* --- SIDEBAR: PROGRESS WAVE --- */}
                    <div className="lg:col-span-1 space-y-8 animate-in slide-in-from-bottom-10 duration-1000 delay-150">
                        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 p-8 rounded-[3rem] shadow-xl text-white flex flex-col items-center text-center space-y-6">
                            <div 
                                className="absolute bottom-0 left-0 w-full bg-white/10 transition-all duration-1000 ease-in-out" 
                                style={{ height: `${percentage}%` }}
                            />
                            
                            <div className="relative z-10 p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30">
                                <BeakerIcon className="w-8 h-8 text-white" />
                            </div>

                            <div className="relative z-10">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Today&apos;s Goal</p>
                                <p className="text-5xl font-black">{percentage}%</p>
                                <p className="text-sm font-medium mt-1">{todayEntry?.amountMl || 0} / {todayEntry?.targetMl || 2000} ml</p>
                            </div>

                            <div className="relative z-10 w-full pt-4 border-t border-white/10">
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Daily Average</p>
                                <p className="text-2xl font-black">{avgIntake} <span className="text-sm font-normal opacity-70">ml</span></p>
                            </div>
                        </div>

                        {/* Quick Tip Card */}
                        <div className="bg-white p-8 rounded-[3rem] border border-cyan-50 shadow-lg shadow-cyan-900/5">
                            <div className="flex items-center gap-2 mb-4 text-cyan-800">
                                <SparklesIcon className="w-5 h-5 text-cyan-400" />
                                <h3 className="font-bold tracking-tight">Hydration Tip</h3>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed italic">
                                &quot;Drinking water before meals can help boost metabolism and improve digestion.&quot;
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- ARCHIVE --- */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <div className="flex items-center gap-6 px-4">
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-[0.4em] whitespace-nowrap">Hydration Archive</h2>
                        <div className="h-px w-full bg-cyan-50" />
                    </div>
                    <div className="bg-cyan-50/20 p-4 rounded-[3.5rem] border border-cyan-100/50">
                        <WaterHistory history={history} isWater={true} /> 
                    </div>
                </div>
            </div>
        );
    }
    return null;
}