'use client'; 

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DietEntryForm from '@/components/DietEntryForm'; 
import DietHistory from '@/components/DietHistory'; 
import DietCalendarHeatmap from '@/components/DietCalendarHeatMap';

export default function DietTrackerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [latestEntry, setLatestEntry] = useState(null); 
  const [history, setHistory] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

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
      fetchHistory();
  }, []); 

  // Auth Guard
  useEffect(() => {
    if (status === 'unauthenticated' && status !== 'loading') {
      router.push('/login');
    }
  }, [status, router]);

    const handleEntryCreated = (newEntry) => {
        // Optimistically update history and set latest entry
        setHistory(prevHistory => [newEntry, ...prevHistory]);
        setLatestEntry(newEntry); // Used for calendar/visualization component
    };


  if (status === 'loading' || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <p className="text-xl text-gray-500">Loading data...</p>
      </div>
    );
  }

  if (status === 'authenticated') {
    const userName = session.user.name ? session.user.name.split(' ')[0] : 'User';

    return (
      <div className="space-y-10">

        <div className="pb-4 border-b border-gray-100">
            <h1 className="text-5xl font-extrabold text-blue-700 flex items-center">
                {userName}&apos;s Tracker
            </h1>
            <p className="text-lg text-gray-500 mt-2">
                Track your daily caloric intake and macronutrient goals with ease.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 h-fit">
                <DietEntryForm onEntryCreated={handleEntryCreated} />
            </div>

            <div className="lg:col-span-1 h-fit">
                <DietCalendarHeatmap history={history} /> 
            </div>
        </div>


        <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-700 mb-6">Your Recent Logs</h2>
            <div className="p-2 bg-gray-50 rounded-3xl shadow-inner border-2 border-gray-100">
                <DietHistory history={history} latestEntry={latestEntry} /> 
            </div>
        </div>
      </div>
    );
  }

  return null;
}
