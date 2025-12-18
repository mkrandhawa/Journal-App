'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SleepEntryForm from "@/components/SleepEntryForm"; 
import SleepHistory from "@/components/SleepHistory";   
import { MoonIcon, SparklesIcon, CloudIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function SleepTrackerPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    const todayStr = new Date().toISOString().split('T')[0];
    const hasEnteredToday = history.length > 0 && 
        new Date(history[0].date).toISOString().split('T')[0] === todayStr;

    const fetchHistory = async () => {
        setDataLoading(true);
        try {
            const response = await fetch('/api/sleep');
            const result = await response.json();
            if (response.ok) setHistory(result.data);
        } catch (error) {
            console.error("Error fetching sleep history:", error);
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
            <div className="flex flex-col items-center justify-center pt-32 space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-indigo-900/40 font-medium tracking-widest uppercase text-xs">Entering Dreamscape...</p>
            </div>
        );
    }

    const avgSleep = history.length > 0 
        ? (history.reduce((acc, curr) => acc + (curr.hoursSlept || 0), 0) / history.length).toFixed(1) 
        : "0.0";

    if (status === 'authenticated') {
        const userName = session.user.name ? session.user.name.split(' ')[0] : 'User';
    
        return (
            <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4 animate-in fade-in duration-700">
                
                {/* --- HEADER: Left Aligned & Color Synced --- */}
                <div className="border-b border-slate-100 pb-8 ">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 tracking-tighter">
                        {userName}&apos;s Sleep Lab
                    </h1>
                    <p className="text-xl text-slate-400 font-medium mt-2 italic">
                        Rest is the foundation of every great achievement.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* --- MAIN ACTION AREA --- */}
                    <div className="lg:col-span-2">
                        {hasEnteredToday ? (
                            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 p-12 rounded-[3.5rem] shadow-2xl text-white flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-500">
                                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping duration-[3000ms]" />
                                    <div className="relative bg-white/5 p-6 rounded-full backdrop-blur-2xl border border-white/10 shadow-inner">
                                        <MoonIcon className="w-14 h-14 text-amber-300" />
                                    </div>
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <h2 className="text-4xl font-black tracking-tight">Sleep Logged</h2>
                                    <p className="text-slate-300 text-lg opacity-80 max-w-md mx-auto">
                                        You rested for <span className="font-bold text-white underline decoration-amber-300 underline-offset-4">{history[0].hoursSlept} hours</span>.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full pt-4 relative z-10">
                                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Quality</p>
                                        <p className="text-2xl font-black tracking-tighter text-white">{history[0].sleepQuality}</p>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Mood</p>
                                        <p className="text-2xl font-black tracking-tighter text-amber-200">{history[0].wakeMood}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-50 h-fit animate-in slide-in-from-bottom-8 duration-1000">
                                <SleepEntryForm onEntryCreated={(entry) => setHistory([entry, ...history])} />
                            </div>
                        )}
                    </div>

                    {/* --- SIDEBAR --- */}
                    <div className="lg:col-span-1 space-y-8 animate-in slide-in-from-bottom-10 duration-1000 delay-150">
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-indigo-100 transition-all duration-500">
                            <div className="flex items-center gap-2 mb-6 text-slate-800">
                                <SparklesIcon className="w-5 h-5 text-amber-400" />
                                <h3 className="font-bold tracking-tight">Recovery Stats</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1">Avg. Duration</p>
                                    <p className="text-4xl font-black text-slate-800">{avgSleep}<span className="text-sm ml-1 text-slate-400">hrs</span></p>
                                </div>
                                <div className="h-px bg-slate-50" />
                                <div className="flex justify-between items-center px-2">
                                    <CloudIcon className="w-5 h-5 text-indigo-400" />
                                    <span className="text-sm font-medium text-slate-600 italic">Consistency is key</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- ARCHIVE: Synced to bottom animation --- */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <div className="flex items-center gap-6 px-4">
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-[0.4em] whitespace-nowrap">Rest Archive</h2>
                        <div className="h-px w-full bg-slate-100" />
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-[3.5rem] border border-slate-100/50">
                        <SleepHistory history={history} /> 
                    </div>
                </div>
            </div>
        );
    }
    return null;
}