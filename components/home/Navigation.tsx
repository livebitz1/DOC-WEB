import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import React from "react"

export function Navigation({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0077B6] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 15s1.5-2 4-2 4 2 4 2" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900">BlueWave</span>
              <span className="text-[#0077B6] text-sm font-medium ml-1">Dental</span>
            </div>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {[{ href: "/dentists", label: "Dentists" },{ href: "#services", label: "Services" },{ href: "#why", label: "Why Us" },{ href: "#testimonials", label: "Testimonials" },{ href: "#team", label: "Team" },{ href: "#contact", label: "Contact" }].map((item) => (
                <a key={item.href} href={item.href} className="text-gray-600 font-medium text-sm">{item.label}</a>
              ))}
            </nav>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <UserButton afterSignOutUrl="/sign-in" />
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
              {[{ href: "/dentists", label: "Dentists" },{ href: "#services", label: "Services" },{ href: "#why", label: "Why Us" },{ href: "#testimonials", label: "Testimonials" },{ href: "#team", label: "Team" },{ href: "#contact", label: "Contact" }].map((item) => (
                <a key={item.href} href={item.href} className="text-gray-600 font-medium py-2" onClick={() => setMenuOpen(false)}>{item.label}</a>
              ))}
              <Separator className="my-2" />
              <Button className="bg-[#0077B6] text-white">Book Appointment</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
