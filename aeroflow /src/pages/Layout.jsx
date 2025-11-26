
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plane, LayoutDashboard, Calendar, LogOut, Menu, X, User, BookOpen } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToastProvider } from "./components/ToastContainer";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("User not logged in");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  const navItems = [
    { name: "Search Flights", page: "Home", icon: Plane },
    { name: "My Bookings", page: "MyBookings", icon: BookOpen },
    { name: "Flight Status", page: "FlightStatus", icon: Calendar },
    { name: "Dashboard", page: "AdminDashboard", icon: LayoutDashboard },
  ];

  return (
    <ToastProvider>
      <style>{`
        :root {
            --primary: #c8102e;
            --primary-dark: #a00d26;
            --secondary: #1a1a1a;
            --accent: #dc2626;
            --success: #10b981;
            --error: #ef4444;

            /* Premium Metallic Palette - Softened */
            --metal-black: #121214;
            --metal-charcoal: #1A1A1C;
            --metal-graphite: #2C2C2E;
            --metal-chrome: #EDEDED;
            --metal-steel: #A8B0BA;
            --metal-silver: #F5F5F7;
          }

          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #1A1A1C 0%, #2C2C2E 50%, #1A1A1C 100%);
            line-height: 1.6;
          }
      `}</style>

      <div className="min-h-screen bg-slate-50">
        {/* Side-aligned Top Navigation */}
        <nav className="relative bg-gradient-to-r from-[#1A1A1C] via-[#2C2C2E] to-[#1A1A1C] border-b border-[#3C3C3E]/50 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.3)] rounded-b-xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/3 before:to-transparent before:pointer-events-none before:animate-[shimmer_12s_ease-in-out_infinite] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-[#EDEDED]/20 after:to-transparent">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
            <div className="flex justify-between items-center h-24">
              {/* Desktop Navigation - Left Side */}
              <div className="hidden md:flex items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all relative overflow-hidden ${
                      isActive(item.page)
                        ? "bg-gradient-to-br from-red-900/25 to-red-800/25 text-red-300 border border-red-700/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]"
                        : "text-[#EDEDED] hover:bg-[#2C2C2E] border border-transparent hover:border-[#3C3C3E] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Logo - Right Side */}
              <Link to={createPageUrl("Home")} className="flex items-center gap-3 group order-first md:order-last">
                <div className="hidden sm:block text-right">
                  <span className="text-2xl font-bold text-[#EDEDED] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] tracking-wide leading-relaxed">
                    AeroFlow
                  </span>
                  <p className="text-xs text-red-400 -mt-1 font-medium leading-relaxed">Travel Smart</p>
                </div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-[#3C3C3E] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none">
                  <Plane className="w-7 h-7 text-[#EDEDED] transform rotate-45 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                </div>
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 bg-gradient-to-r from-[#2C2C2E] to-[#3C3C3E] hover:from-[#3C3C3E] hover:to-[#4C4C4E] border-[#3C3C3E] text-[#EDEDED] shadow-[0_2px_12px_rgba(0,0,0,0.25)] rounded-xl px-5 py-2.5">
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">{user.full_name || user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button onClick={() => base44.auth.redirectToLogin()} className="bg-gradient-to-r from-[#2C2C2E] to-[#3C3C3E] hover:from-[#3C3C3E] hover:to-[#4C4C4E] border border-[#3C3C3E] text-[#EDEDED] shadow-[0_2px_12px_rgba(0,0,0,0.25)] rounded-xl px-6 py-2.5">Login</Button>
                )}

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2.5 rounded-xl hover:bg-[#2C2C2E] border border-[#3C3C3E] transition-all"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5 text-[#EDEDED]" /> : <Menu className="w-5 h-5 text-[#EDEDED]" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-b from-[#2C2C2E] to-[#1A1A1C] border-t border-[#3C3C3E]/50">
              <div className="px-6 py-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-5 py-4 rounded-xl font-medium transition-all ${
                      isActive(item.page)
                        ? "bg-gradient-to-br from-red-900/25 to-red-800/25 text-red-300 border border-red-700/40"
                        : "text-[#EDEDED] hover:bg-[#3C3C3E] border border-transparent hover:border-[#3C3C3E]"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#1A1A1C] via-[#2C2C2E] via-50% to-[#1A1A1C]">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative bg-gradient-to-b from-[#1A1A1C] to-[#121214] text-[#EDEDED] py-16 mt-16 border-t border-[#3C3C3E]/50 rounded-t-2xl before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#EDEDED]/20 before:to-transparent shadow-[inset_0_4px_15px_rgba(0,0,0,0.25)]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-5">
                <div className="relative w-14 h-14 bg-gradient-to-br from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-[#3C3C3E] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none">
                  <Plane className="w-6 h-6 text-[#EDEDED] transform rotate-45 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                </div>
                <div>
                  <p className="font-bold text-lg text-[#EDEDED] drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] tracking-wide leading-relaxed">AeroFlow</p>
                  <p className="text-sm text-[#A8B0BA] leading-relaxed">Elevating travel experiences worldwide</p>
                </div>
              </div>
              <p className="text-sm text-[#A8B0BA] leading-relaxed">
                © 2025 AeroFlow. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
