// src/components/AuthButtons.js (Excerpt)
'use client';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
// ...

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="text-center text-gray-500 py-4">Loading...</div>;
  }

  if (session) {
    return (
      // Updated styling for signed-in state
      <div className="p-4 border-t border-gray-100 bg-gray-50"> 
        <div className="flex items-center space-x-3 mb-2">
            {/* Use user image if available, otherwise a placeholder */}
            {session.user.image ? (
                <Image src={session.user.image} alt="User Avatar" width={32} height={32} className="rounded-full" />
            ) : (
                <span className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                    {session.user.name ? session.user.name[0] : 'U'}
                </span>
            )}
            <p className="text-sm font-semibold text-gray-800 truncate">
                {session.user.name || session.user.email}
            </p>
        </div>

        <button
          onClick={() => signOut()}
          className="mt-2 w-full py-2 text-sm px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50">
      <button
        onClick={() => signIn('google')}
        className="w-full py-2 px-4 text-sm bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
      >
        Sign in
      </button>
    </div>
  );
}
