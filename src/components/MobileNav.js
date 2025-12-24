'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";
import {
    HomeIcon,
    FireIcon,
    MoonIcon,
    ScaleIcon,
    BeakerIcon,
    ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';

const navItems = [
    { href: "/", icon: HomeIcon },
    { href: "/diet", icon: FireIcon },
    { href: "/weight", icon: ScaleIcon },
    { href: "/sleep", icon: MoonIcon },
    { href: "/water", icon: BeakerIcon },
    { href: "/logout", icon: ArrowRightStartOnRectangleIcon },
];

export default function MobileNav() {
    const pathname = usePathname();
    const {data:session, status} = useSession();

    return (
        <aside className="md:hidden">
            <nav className="
                md:hidden
                fixed bottom-0 left-0 right-0
                bg-white border-t border-gray-200
                flex justify-around items-center
                h-16 z-50
            ">
                {navItems.map(({ href, icon: Icon }) => {
                    const isActive = pathname === href;

                    if (href === '/logout') {
                        if (status === 'unauthenticated') {
                            return null;
                        }
                        return (
                            <button
                                key={href}
                                onClick={() => signOut()} 
                                className="flex flex-col items-center justify-center w-full h-full"
                            >
                                <Icon className="w-6 h-6 text-red-500" />
                            </button>
                        );
                    }

                    return (
                        <Link 
                            key={href} 
                            href={href}
                            className="flex flex-col items-center justify-center w-full h-full"
                        >
                            <Icon
                                className={`
                                    w-6 h-6
                                    ${isActive ? 'text-indigo-600' : 'text-gray-400'}
                                `}
                            />
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}