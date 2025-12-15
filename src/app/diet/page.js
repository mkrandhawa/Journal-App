// src/app/diet/page.js (Updated)
'use client'; 

import { useState, useEffect } from 'react'; //
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DietEntryForm from '@/components/DietEntryForm'; 
import DietHistory from '@/components/DietHistory'; 

export default function DietTrackerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [latestEntry, setLatestEntry] = useState(null); 

  useEffect(() => {
    if (status === 'unauthenticated' && status !== 'loading') {
      router.push('/login');
    }
  }, [status, router]);

  const handleEntryCreated = (newEntry) => {
      setLatestEntry(newEntry);
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <p className="text-xl text-gray-500">Securing tracker...</p>
      </div>
    );
  }

  if (status === 'authenticated') {
    const userName = session.user.name ? session.user.name.split(' ')[0] : 'User';

    return (
      <div className="space-y-10">

        {/* Header Area */}
        <div className="pb-4 border-b border-gray-100">
            <h1 className="text-5xl font-extrabold text-blue-700 flex items-center">
                {userName}&apos;s Tracker
            </h1>
            <p className="text-lg text-gray-500 mt-2">
                Track your daily caloric intake and macronutrient goals with ease.
            </p>
        </div>

        {/* --- Diet Entry Form Component Container --- */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
            <DietEntryForm onEntryCreated={handleEntryCreated} />
        </div>

        {/* --- History and Visualization Component Container --- */}
        <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-700 mb-6">Your Recent Logs</h2>
            <div className="p-2 bg-gray-50 rounded-3xl shadow-inner border-2 border-gray-100">
                {/* Pass the latest entry to the history component */}
                <DietHistory latestEntry={latestEntry} />
            </div>
        </div>
      </div>
    );
  }

  return null;
}
