'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PlusCircleIcon } from '@heroicons/react/24/outline';


export default function Home() {

  const {data: session, status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' && status !== 'loading'){
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading'){
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-xl text-gray-500">Loading Dashboard...</p>
      </div>
    )
  }
  
  if (status === 'authenticated'){
    const userName = session.user.name ? session.user.name.split(' ')[0] : 'User'; 
    
    return (
      <div className="space-y-10">
        
        {/* Welcome Banner */}
        <div className="p-8 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl shadow-xl text-white">
          <h1 className="text-4xl font-extrabold mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-indigo-200">
            It is time to log your progress and track your goals.
          </p>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button className="flex items-center justify-center p-5 bg-white rounded-xl shadow-lg border border-green-100 hover:bg-green-50 transition transform hover:-translate-y-0.5">
            <PlusCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <span className="text-lg font-semibold text-gray-700">New Entry</span>
          </button>
          
          <div className="p-5 bg-white rounded-xl shadow-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-600 mb-1">Trends</h3>
            <p className="text-sm text-gray-500">View overall statistics and trends.</p>
          </div>
          
          <div className="p-5 bg-white rounded-xl shadow-lg border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-600 mb-1">Journal</h3>
            <p className="text-sm text-gray-500">Review past journal entries.</p>
          </div>
        </div>

        {/* Data Snapshots/Stat Cards (Using Dummy Data/Placeholders for now) */}
        <h2 className="text-2xl font-bold text-gray-700 mt-8 mb-4">Your Health Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Stat Card 1: Weight */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-l-red-500">
                <p className="text-sm font-medium text-gray-500">Current Weight</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">185.4 <span className="text-lg font-normal text-gray-400">lbs</span></p>
                <p className="text-xs text-red-500 mt-2">▲ 0.2 lbs this week</p>
            </div>

            {/* Stat Card 2: Calories */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-l-blue-500">
                <p className="text-sm font-medium text-gray-500">Avg Daily Deficit</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">-550 <span className="text-lg font-normal text-gray-400">kcal</span></p>
                <p className="text-xs text-blue-500 mt-2">Goal: 500 kcal deficit</p>
            </div>
            
            {/* Stat Card 3: Sleep */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-l-green-500">
                <p className="text-sm font-medium text-gray-500">Last Night&apos;s Sleep</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">7h 45m</p>
                <p className="text-xs text-green-500 mt-2">Slept 95% of goal</p>
            </div>
            
            {/* Stat Card 4: Workouts */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-l-yellow-500">
                <p className="text-sm font-medium text-gray-500">Workouts Logged</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">3 <span className="text-lg font-normal text-gray-400">this week</span></p>
                <p className="text-xs text-yellow-500 mt-2">1 more to go!</p>
            </div>

        </div>
        
      </div>
    );
  }

  return null;
}
