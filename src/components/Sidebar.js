import Link from "next/link";
import AuthButtons from "./AuthButtons";

const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Diet Tracker", href: "/diet" },
    { name: "Gym Log", href: "/gym" },
    { name: "Sleep Log", href: "/sleep" },
    { name: "Weight History Log", href: "/weight" }
];

export default function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-white border-r shadow-md fixed top-0 left-0">
            <div className="p-6">
                <h2 className="text-2xl font-extrabold text-indigo-700">
                    My Journal
                </h2>
            </div>
            <nav className="mt-6">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="block py-3  px-6 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-duration-150"
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
            <AuthButtons />
        </aside>
    );
}   