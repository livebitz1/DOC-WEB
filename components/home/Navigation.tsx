import React, { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AuthButton } from "@/components/home/AuthButton";

export function Navigation({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const { user } = useUser();
  const [isDoctor, setIsDoctor] = useState(false);
  useEffect(() => {
    async function checkDoctor() {
      if (user?.emailAddresses?.[0]?.emailAddress) {
        try {
          const res = await fetch("/api/dentists");
          const dentists = await res.json();
          const match = dentists.find((d: any) => d.email === user.emailAddresses[0].emailAddress);
          setIsDoctor(!!match);
        } catch {}
      } else {
        setIsDoctor(false);
      }
    }
    checkDoctor();
  }, [user]);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="/">
              <img src="/logo.jpeg" alt="Santepheap Dental Clinic Logo" className="w-40 h-15 rounded-lg object-contain bg-white border border-gray-200 cursor-pointer" />
            </a>
            <div>
              <span className="font-bold text-lg text-gray-900">SANTEHEAP</span>
            </div>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {[{ href: "/dentists", label: "Dentists" },{ href: "/book", label: "Book" },{ href: "/chat/list", label: "Chat" },{ href: "#services", label: "Services" },{ href: "#why", label: "Why Us" },{ href: "#testimonials", label: "Testimonials" },{ href: "#team", label: "Team" },{ href: "#contact", label: "Contact" }].map((item) => (
                <a key={item.href} href={item.href} className="text-gray-600 font-medium text-sm">{item.label}</a>
              ))}
              {isDoctor && (
                <a href="/doctor" className="text-blue-700 font-semibold text-sm">Doctor Dashboard</a>
              )}
            </nav>
            {/* Auth Button with loading state */}
            <AuthButton />
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <AuthButton />
            <button className="p-2 text-gray-600" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-3">
              {[{ href: "/dentists", label: "Dentists" },{ href: "/book", label: "Book" },{ href: "/chat/list", label: "Chat" },{ href: "#services", label: "Services" },{ href: "#why", label: "Why Us" },{ href: "#testimonials", label: "Testimonials" },{ href: "#team", label: "Team" },{ href: "#contact", label: "Contact" }].map((item) => (
                <a key={item.href} href={item.href} className="text-gray-600 font-medium py-2" onClick={() => setMenuOpen(false)}>{item.label}</a>
              ))}
              {isDoctor && (
                <a href="/doctor" className="text-blue-700 font-semibold py-2 text-center">Doctor Dashboard</a>
              )}
              <Separator className="my-2" />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
