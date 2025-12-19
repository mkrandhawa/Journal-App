'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { 
  ScaleIcon, 
  MoonIcon, 
  BeakerIcon, 
  CakeIcon,
  ArrowTrendingDownIcon,
  FireIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    weight: null,
    sleep: null,
    water: null,
    diet: null,
    loading: true
  });

  const fetchDashboardData = async () => {
    try {
      const [weightRes, sleepRes, waterRes, dietRes] = await Promise.all([
        fetch('/api/weight'),
        fetch('/api/sleep'),
        fetch('/api/water'),
        fetch('/api/diet')
      ]);

      const [w, s, wa, d] = await Promise.all([
        weightRes.json(),
        sleepRes.json(),
        waterRes.json(),
        dietRes.json()
      ]);

      const todayStr = new Date().toDateString();

      setStats({
        weight: w.data?.[0] || null,
        sleep: s.data?.[0] || null,
        water: wa.data?.find(entry => new Date(entry.date).toDateString() === todayStr) || null,
        diet: d.data?.find(entry => new Date(entry.date).toDateString() === todayStr) || null,
        loading: false
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated' && status !== 'loading') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  if (status === 'loading' || stats.loading) {
    return (
      <div className="flex flex-col items-center justify-center pt-32 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-indigo-900/40 font-medium tracking-widest uppercase text-xs">Assembling your health lab...</p>
      </div>
    );
  }

  const userName = session.user.name ? session.user.name.split(' ')[0] : 'User';

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4">
      
      {/* --- HEADER --- */}
      <div className="border-b border-slate-100 pb-8">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 tracking-tighter leading-[1.1] block">
              Welcome back, {userName}
          </h1>
          <p className="text-xl text-slate-400 font-medium mt-2 italic">
              Your body is a lab. Your data is the formula.
          </p>
      </div>

      {/* --- QUICK ACTIONS: 4 COLUMN GRID --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">
        <Link href="/weight" className="flex flex-col items-center justify-center p-6 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 hover:bg-indigo-50 transition-all group">
          <ScaleIcon className="w-6 h-6 text-indigo-500 mb-2" />
          <span className="text-sm font-bold text-slate-700">Weight</span>
        </Link>
        <Link href="/diet" className="flex flex-col items-center justify-center p-6 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 hover:bg-emerald-50 transition-all group">
          <CakeIcon className="w-6 h-6 text-emerald-500 mb-2" />
          <span className="text-sm font-bold text-slate-700">Diet</span>
        </Link>
        <Link href="/water" className="flex flex-col items-center justify-center p-6 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 hover:bg-cyan-50 transition-all group">
          <BeakerIcon className="w-6 h-6 text-cyan-500 mb-2" />
          <span className="text-sm font-bold text-slate-700">Water</span>
        </Link>
        <Link href="/sleep" className="flex flex-col items-center justify-center p-6 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 hover:bg-slate-900 transition-all group">
          <MoonIcon className="w-6 h-6 text-slate-400 group-hover:text-amber-300 mb-2" />
          <span className="text-sm font-bold text-slate-700 group-hover:text-white">Sleep</span>
        </Link>
      </div>

      {/* --- SNAPSHOTS --- */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
        <div className="flex items-center gap-6 px-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-[0.4em] whitespace-nowrap">Daily Snapshot</h2>
            <div className="h-px w-full bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Weight Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Weight</p>
                <p className="text-4xl font-black text-slate-800">{stats.weight?.weight || '--'}<span className="text-sm ml-1 text-slate-400">kg</span></p>
                <div className="mt-4 flex items-center text-[10px] font-bold text-indigo-500 uppercase">
                   <ArrowTrendingDownIcon className="w-3 h-3 mr-1" /> Goal: {stats.weight?.targetWeight}kg
                </div>
            </div>

            {/* Diet Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Nutrition</p>
                <p className="text-4xl font-black text-slate-800">{stats.diet?.caloriesConsumed || '0'}<span className="text-sm ml-1 text-slate-400">kcal</span></p>
                <div className="mt-4 flex items-center text-[10px] font-bold text-emerald-500 uppercase">
                   <FireIcon className="w-3 h-3 mr-1" /> Protein: {stats.diet?.proteinGrams || '0'}g
                </div>
            </div>

          

            {/* Sleep Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Recovery</p>
                <p className="text-4xl font-black text-slate-800">{stats.sleep?.hoursSlept || '0'}<span className="text-sm ml-1 text-slate-400">hrs</span></p>
                <p className="text-[10px] mt-4 font-black text-amber-500 uppercase tracking-tight">Quality: {stats.sleep?.sleepQuality || 'N/A'}</p>
            </div>

              {/* Water Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Hydration</p>
                <p className="text-4xl font-black text-slate-800">{stats.water?.amountMl || '0'}<span className="text-sm ml-1 text-slate-400">ml</span></p>
                <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                   <div 
                    className="bg-cyan-500 h-full transition-all duration-1000" 
                    style={{ width: `${Math.min(((stats.water?.amountMl || 0) / (stats.water?.targetMl || 2000)) * 100, 100)}%` }}
                   />
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}