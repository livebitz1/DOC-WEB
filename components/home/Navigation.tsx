import React, { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AuthButton } from "@/components/home/AuthButton";
import { FaBoxOpen, FaUserMd, FaCalendarAlt, FaComments, FaTooth, FaQuestionCircle, FaQuoteRight, FaUsers, FaEnvelope } from "react-icons/fa";

const navLinks = [
  { href: "/products", label: "Products", icon: <FaBoxOpen /> },
  { href: "/dentists", label: "Dentists", icon: <FaUserMd /> },
  { href: "/book", label: "Book", icon: <FaCalendarAlt /> },
  { href: "/chat/list", label: "Chat", icon: <FaComments /> },
  { href: "#services", label: "Services", icon: <FaTooth /> },
  { href: "#why", label: "Why Us", icon: <FaQuestionCircle /> },
  { href: "#testimonials", label: "Testimonials", icon: <FaQuoteRight /> },
  { href: "#team", label: "Team", icon: <FaUsers /> },
  { href: "#contact", label: "Contact", icon: <FaEnvelope /> },
];

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
              {navLinks.map((item) => (
                <a key={item.href} href={item.href} className="flex items-center gap-1 text-gray-600 font-medium text-sm hover:text-[#0077B6] transition-colors">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
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
              {navLinks.map((item) => (
                <a key={item.href} href={item.href} className="flex items-center gap-2 text-gray-600 font-medium py-2 hover:text-[#0077B6] transition-colors" onClick={() => setMenuOpen(false)}>
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
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
