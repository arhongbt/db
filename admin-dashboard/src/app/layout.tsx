"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowUpDown,
  Receipt,
  Calculator,
  MessageSquare,
  Landmark,
  FileBarChart,
  Settings,
  Leaf,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Översikt", icon: LayoutDashboard },
  { href: "/transaktioner", label: "Transaktioner", icon: ArrowUpDown },
  { href: "/moms", label: "Moms", icon: Receipt },
  { href: "/skatt", label: "Skatt", icon: Calculator },
  { href: "/rapporter", label: "Rapporter", icon: FileBarChart },
  { href: "/ai-konsult", label: "AI-konsult", icon: MessageSquare },
  { href: "/installningar", label: "Inställningar", icon: Settings },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="sv">
      <head>
        <title>Sista Resan — Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-dvh">
        <div className="flex min-h-dvh">
          {/* Sidebar */}
          <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-gray-200/80 fixed inset-y-0 left-0 z-30">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Sista Resan</p>
                <p className="text-[11px] text-gray-400">Admin — Enskild firma</p>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      active
                        ? "bg-brand-50 text-brand-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className={`w-[18px] h-[18px] ${active ? "text-brand-500" : ""}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bankkoppling status */}
            <div className="px-4 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200/60">
                <Landmark className="w-4 h-4 text-amber-600" />
                <div>
                  <p className="text-xs font-medium text-amber-800">Bank ej kopplad</p>
                  <p className="text-[10px] text-amber-600">Koppla via Tink</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile header */}
          <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200/80 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="font-semibold text-sm">Admin</p>
              </div>
            </div>
          </div>

          {/* Mobile bottom nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200/80 px-2 py-1.5 flex justify-around">
            {NAV_ITEMS.slice(0, 5).map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] ${
                    active ? "text-brand-600 font-medium" : "text-gray-400"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Main content */}
          <main className="flex-1 md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
