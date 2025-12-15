'use client';

import {signIn, signOut, useSession} from 'next-auth/react';

export default function AuthButtons() {
    const {data: session, status} = useSession();

    if(status === 'loading') {
        return <div className='text-center text-gray-500 py-4'>Loading...</div>;
    }

    if (session){
        return(
            <div className='p-4 border-t'>
                <p className='text-sm font-semibold text-gray-800 truncate'>
                    Welcome, {session.user.name || session.user.email}!
                </p>
                <button onClick={() => signOut()}
                className='mt-2 w-full py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transiition'>
                    Sign Out
                </button>
            </div>
        )
    }
               
 

    return (
        <div className='p-4 border-t'>
            <button onClick={() => signIn('google')}
            className='w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-blue-700 transition'>
                Sign In with Google
            </button>
        </div>
    );

}