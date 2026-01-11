'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WeightEntryForm from "@/components/WeightEntryForm";
import WeightHistory from "@/components/WeightHistory";
import WeightChart from "@/components/WeightChart"; 
import { ChartBarIcon, ClockIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function WeightTrackerPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [latestEntry, setLatestEntry] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [firstEntry, setFirstEntry] = useState(null);

    const todayStr = new Date().toISOString().split('T')[0];
    const hasEnteredToday = history.length > 0 && 
        new Date(history[0].date).toISOString().split('T')[0] === todayStr;

    
    const handleEntryCreated = (newEntry) => {
        setHistory(prev => [newEntry, ...prev]);
        setLatestEntry(newEntry); 
    };

    const fetchHistory = async () => {
        setDataLoading(true);
        try {
            const response = await fetch('/api/weight');
            const result = await response.json();
            if (response.ok) {
                setHistory(result.data);
                setFirstEntry(result.firstEntry);
            }
        } catch (error) {
            console.error("Error fetching weight history:", error);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchHistory();
        }
    }, [status, router]);

    if (status === 'loading' || dataLoading) {
        return (
            <div className="flex flex-col items-center justify-center pt-32 space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-indigo-900/40 font-medium tracking-widest uppercase text-xs">Softening your space...</p>
            </div>
        );
    }

    if (status === 'authenticated') {
        const userName = session.user.name ? session.user.name.split(' ')[0] : 'User';

        return (
            <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
                
                <div className="border-b border-indigo-50 pb-8">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-violet-600 tracking-tighter leading-[1.3] block">
                        {userName}&apos;s Journey
                    </h1>
                    <p className="text-xl text-indigo-900/40 font-medium mt-2 italic ">
                        Small steps, big changes. Keep moving forward.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    <div className="lg:col-span-2">
                        {hasEnteredToday ? (
                            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 p-12 rounded-[3.5rem] shadow-2xl text-white flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-500">
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                                
                                <div className="relative bg-white/20 p-6 rounded-full backdrop-blur-xl border border-white/30 shadow-inner">
                                    <SparklesIcon className="w-12 h-12 text-white" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black tracking-tight">Logged for Today!</h2>
                                    <p className="text-indigo-50 text-lg opacity-80">
                                        Consistency is your superpower. You weighed <span className="font-bold text-white">{history[0].weight} kg</span> today.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Current</p>
                                        <p className="text-2xl font-bold">{history[0].weight}kg</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Target</p>
                                        <p className="text-2xl font-bold">{history[0].targetWeight}kg</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-indigo-50/50 h-fit">
                                <WeightEntryForm onEntryCreated={handleEntryCreated} lastEntry={history[0]} />
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-[3rem] border border-indigo-50 shadow-xl shadow-indigo-900/5">
                            <div className="flex items-center gap-2 mb-6 text-indigo-800">
                                <ChartBarIcon className="w-5 h-5" />
                                <h3 className="font-bold tracking-tight">Quick Insight</h3>
                            </div>
                            <div className="text-center py-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-3xl font-black text-indigo-600">
                                    {history[0]?.BMI ? `BMI: ${history[0].BMI}` : "Goal-Focused"}
                                </p>
                            </div>
                        </div>
                         <div className="bg-white p-8 rounded-[3rem] border border-indigo-50 shadow-xl shadow-indigo-900/5">
                            <div className="flex items-center gap-2 mb-6 text-indigo-800">
                                <ChartBarIcon className="w-5 h-5" />
                                <h3 className="font-bold tracking-tight">Quick Insight</h3>
                            </div>
                            <div className="text-center py-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total loss</p>
                                <p className="text-3xl font-black text-indigo-600">
                                    {history.length > 1 
                                        ? `${(history[0].weight - firstEntry).toFixed(2)}kg` 
                                        : "0.0kg"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FULL CHART SECTION --- */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-[4rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                    
                    <div className="relative bg-white/80 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white shadow-2xl shadow-indigo-100/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
                            
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-200 blur-lg opacity-40 animate-pulse"></div>
                                    <div className="relative p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                                        <ChartBarIcon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Weight Progression</h3>
                                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Visualizing your success</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 px-5 py-2.5 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-bold text-indigo-700">
                                    {history.length > 1 
                                        ? `${(history[0].weight - history[history.length - 1].weight).toFixed(1)}kg total change` 
                                        : "Tracking started"}
                                </span>
                            </div>
                        </div>

                        <div className="w-full min-h-[350px] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                            <WeightChart history={history} />
                        </div>
                    </div>
                </div>




                {/* --- HISTORY SECTION --- */}
                <div className="space-y-8">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-black text-indigo-900/30 uppercase tracking-[0.2em] whitespace-nowrap">Log History</h2>
                        <div className="h-px w-full bg-indigo-50" />
                    </div>
                    <div className="bg-indigo-50/30 p-4 rounded-[3.5rem] border border-indigo-100/50">
                        <WeightHistory history={history} latestEntry={latestEntry} /> 
                    </div>
                </div>
            </div>
        );
    }

    return null;
}