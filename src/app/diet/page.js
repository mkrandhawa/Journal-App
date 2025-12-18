'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DietEntryForm from '@/components/DietEntryForm';
import DietHistory from '@/components/DietHistory';
import DietCalendarHeatmap from '@/components/DietCalendarHeatMap';
import { FireIcon, BoltIcon } from "@heroicons/react/24/outline";

export default function DietTrackerPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [latestEntry, setLatestEntry] = useState(null);
    const [history, setHistory] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    const todayStr = new Date().toISOString().split('T')[0];
    const hasEnteredToday = history.length > 0 && 
        new Date(history[0].date).toISOString().split('T')[0] === todayStr;

    const fetchHistory = async () => {
        setDataLoading(true);
        try {
            const response = await fetch('/api/diet');
            const result = await response.json();
            if (response.ok) {
                setHistory(result.data);
            }
        } catch (error) {
            console.error("Error fetching diet history:", error);
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

    const handleEntryCreated = (newEntry) => {
        setHistory(prev => [newEntry, ...prev]);
        setLatestEntry(newEntry);
    };

    if (status === 'loading' || dataLoading) {
        return (
            <div className="flex flex-col items-center justify-center pt-32 space-y-4">
                <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-emerald-900/40 font-medium tracking-widest uppercase text-xs">Refreshing Kitchen...</p>
            </div>
        );
    }

    if (status === 'authenticated') {
        const userName = session.user.name ? session.user.name.split(' ')[0] : 'User';

        return (
            <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
                
                {/* --- MINIMALIST HEADER --- */}
                <div className="border-b border-emerald-50 pb-8">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-500 tracking-tighter">
                        {userName}&apos;s Nutrition
                    </h1>
                    <p className="text-xl text-emerald-900/40 font-medium mt-2 italic">
                        Fueling your body with intention.
                    </p>
                </div>

                {/* --- MAIN ACTION AREA --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    <div className="lg:col-span-2">
                        {hasEnteredToday ? (
                            /* SUCCESS CARD: DIET VERSION */
                            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 p-12 rounded-[3.5rem] shadow-2xl text-white flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-500">
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                                
                                <div className="relative bg-white/20 p-6 rounded-full backdrop-blur-xl border border-white/30 shadow-inner">
                                    <FireIcon className="w-12 h-12 text-white" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black tracking-tight">Daily Fuel Logged!</h2>
                                    <p className="text-emerald-50 text-lg opacity-80">
                                        You consumed <span className="font-bold text-white">{history[0].caloriesConsumed} kcal</span> today. Great discipline!
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 w-full pt-4">
                                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Protein</p>
                                        <p className="text-xl font-bold">{history[0].protein}g</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Carbs</p>
                                        <p className="text-xl font-bold">{history[0].carbs}g</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Fat</p>
                                        <p className="text-xl font-bold">{history[0].fat}g</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-emerald-50/50 h-fit">
                                <DietEntryForm onEntryCreated={handleEntryCreated} />
                            </div>
                        )}
                    </div>

                    {/* --- SIDEBAR: HEATMAP --- */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-[3rem] border border-emerald-50 shadow-xl shadow-emerald-900/5">
                            <div className="flex items-center gap-2 mb-6 text-emerald-800">
                                <BoltIcon className="w-5 h-5" />
                                <h3 className="font-bold tracking-tight">Consistency Streak</h3>
                            </div>
                            <DietCalendarHeatmap history={history} /> 
                        </div>
                    </div>
                </div>

                {/* --- HISTORY SECTION --- */}
                <div className="space-y-8">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-black text-emerald-900/30 uppercase tracking-[0.2em] whitespace-nowrap">Nutrition Archive</h2>
                        <div className="h-px w-full bg-emerald-50" />
                    </div>
                    <div className="bg-emerald-50/30 p-4 rounded-[3.5rem] border border-emerald-100/50">
                        <DietHistory history={history} latestEntry={latestEntry} /> 
                    </div>
                </div>
            </div>
        );
    }

    return null;
}