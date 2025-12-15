'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BookOpenIcon } from '@heroicons/react/24/solid'; 

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            // If the user is logged in, redirect to home page
            router.push('/');
        }
    }, [status, router]);

    if (status === 'loading' || status === 'authenticated') {
        return (
            <div className='flex min-h-screen items-center justify-center 
                        bg-gradient-to-br from-indigo-50 to-white'>
                <div className='flex items-center space-x-3'>
                    <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h1 className='text-xl font-medium text-indigo-700 animate-pulse'>
                        Loading user session...
                    </h1>
                </div>
            </div>
        )
    }

    return (
        <div className='flex min-h-screen items-center justify-center 
                    bg-gradient-to-r from-indigo-50 to-blue-50 p-4'>
            
            <div className='bg-white p-10 rounded-2xl shadow-2xl border 
                        border-gray-100 w-full max-w-md text-center transform transition duration-500 hover:shadow-3xl'>
                
                <div className='flex justify-center mb-6'>
                    <div className='p-3 bg-indigo-100 rounded-full'>
                        <BookOpenIcon className='w-8 h-8 text-indigo-600' />
                    </div>
                </div>

                <h1 className='text-3xl font-extrabold text-gray-800 mb-2'>
                    MyJournal App
                </h1>
                <p className='text-lg text-indigo-600 font-semibold mb-6'>
                    Access Restricted
                </p>
                
                <p className='text-gray-500 mb-10 text-sm'>
                    Please sign in to access your personal journal, custom trackers, and insights.
                </p>
                
                <button 
                    onClick={() => signIn('google')}
                    className='w-full flex items-center justify-center space-x-3 
                            py-3 px-4 bg-indigo-600 text-white font-semibold rounded-xl 
                            shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.01]'>

                    <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M12.0003 4.67385C14.043 4.67385 15.6888 5.38573 16.9201 6.61701L19.4678 4.06934C17.652 2.25356 15.0118 1.17385 12.0003 1.17385C7.29497 1.17385 3.19728 3.99839 1.54226 8.01633L4.85175 10.4357C5.64548 8.1691 8.51475 6.74104 12.0003 6.74104C13.5672 6.74104 14.7709 7.1593 15.6558 7.97157C16.5408 8.78384 17.0279 10.0469 17.0279 11.5369C17.0279 13.0906 16.4952 14.4533 15.3908 15.5577C14.2863 16.6622 12.9237 17.1948 11.5369 17.1948C8.52535 17.1948 5.65608 15.7668 4.85175 13.4975L1.54226 15.9168C3.19728 19.9348 7.29497 22.7593 12.0003 22.7593C15.0118 22.7593 17.652 21.6796 19.4678 19.8638L16.9201 17.3161C15.6888 18.5474 14.043 19.2593 12.0003 19.2593C9.07438 19.2593 6.64166 17.9255 5.53723 15.7833L10.3804 14.8093L12.0003 12.0003L12.0003 11.0264L12.0003 11.5369L17.0279 11.5369C17.0279 9.8784 16.7909 8.23724 16.4357 6.61701H12.0003V4.67385Z" />
                    </svg>
                    <span>Continue with Google</span>
                </button>
            </div>
        </div>
    );
}

