'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    FireIcon,
    MoonIcon,
    ScaleIcon,
    BeakerIcon
} from '@heroicons/react/24/outline';

const navItems = [
    { href: "/", icon: HomeIcon },
    { href: "/diet", icon: FireIcon },
    { href: "/weight", icon: ScaleIcon },
    { href: "/sleep", icon: MoonIcon },
    { href: "/water", icon: BeakerIcon }
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="
            md:hidden
            fixed bottom-0 left-0 right-0
            bg-white border-t border-gray-200
            flex justify-around items-center
            h-16 z-50
        ">
            {navItems.map(({ href, icon: Icon }) => {
                const isActive = pathname === href;

                return (
                    <Link key={href} href={href}>
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
    );
}
