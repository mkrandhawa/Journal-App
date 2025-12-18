'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation'; 
import AuthButtons from "./AuthButtons";
import {
    HomeIcon,
    FireIcon,     // For Diet/Calories
    BoltIcon,     // For Gym/Energy
    MoonIcon,     // For Sleep
    ScaleIcon     // For Weight
} from '@heroicons/react/24/outline'; 

// Mapping the routes to their corresponding icons
const navItems = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Diet Tracker", href: "/diet", icon: FireIcon },
    { name: "Weight History", href: "/weight", icon: ScaleIcon },
    { name: "Gym Log", href: "/gym", icon: BoltIcon },
    { name: "Sleep Log", href: "/sleep", icon: MoonIcon }
    
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-100 shadow-xl fixed top-0 left-0 flex flex-col">
            
            {/* Logo/Header */}
            <div className="p-6">
                <h2 className="text-2xl font-extrabold text-indigo-700">
                    My<span className="text-gray-900">Journal</span>
                </h2>
            </div>
            
            {/* Navigation Section */}
            <nav className="mt-4 flex-grow">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon; 

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex items-center space-x-3 py-3 px-6 mx-3 rounded-lg text-lg font-medium transition duration-200
                                ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700 font-semibold' // Active style
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900' // Inactive style
                                }
                            `}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <AuthButtons /> 
        </aside>
    );
}
