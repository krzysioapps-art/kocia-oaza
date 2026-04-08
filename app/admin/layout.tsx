"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === "/admin/login") return;

        const isAuthenticated = localStorage.getItem("admin_authenticated");
        if (!isAuthenticated) {
            router.push("/admin/login");
        }
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem("admin_authenticated");
        router.push("/admin/login");
    };

    // Don't show sidebar on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const navItems = [
        { href: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
        { href: "/admin/cats", icon: "pets", label: "Koty" },
        { href: "/admin/forms", icon: "description", label: "Zgłoszenia" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "w-64" : "w-20"
                    } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-10`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-gray-200">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--warm-coral)] to-[var(--paw-orange)] flex items-center justify-center shadow-lg flex-shrink-0">
                            <img
                                src="/kocia_oaza_sygnet.svg"
                                alt="Kocia Oaza"
                                className="w-7 h-7"
                            />
                        </div>
                        {sidebarOpen && (
                            <div>
                                <h1 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Caveat', cursive" }}>
                                    Kocia Oaza
                                </h1>
                                <p className="text-xs text-gray-500">Panel Admin</p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? "bg-gradient-to-r from-[var(--warm-coral)] to-[var(--paw-orange)] text-white shadow-md"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <span className="material-icons">{item.icon}</span>
                                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <span className="material-icons">
                            {sidebarOpen ? "chevron_left" : "chevron_right"}
                        </span>
                        {sidebarOpen && <span className="font-medium">Zwiń</span>}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <span className="material-icons">logout</span>
                        {sidebarOpen && <span className="font-medium">Wyloguj</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Caveat', cursive" }}>
                                {pathname === "/admin/dashboard" && "Dashboard"}
                                {pathname === "/admin/cats" && "Lista kotów"}
                                {pathname === "/admin/cats/new" && "Dodaj nowego kota"}
                                {pathname.includes("/admin/cats/") && pathname.includes("/edit") && "Edytuj kota"}
                                {pathname === "/admin/forms" && "Zgłoszenia adopcyjne"}
                                {pathname.includes("/admin/forms/") && !pathname.includes("/admin/forms") && "Szczegóły zgłoszenia"}
                            </h2>
                        </div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--paw-orange)] transition-colors"
                        >
                            <span className="material-icons text-sm">open_in_new</span>
                            <span>Strona główna</span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">{children}</main>
            </div>
        </div>
    );
}