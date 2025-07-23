"use client"

import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/nextjs"
import React, { useState } from "react"
import { FaShieldAlt, FaUserMd, FaGlobe, FaUsers, FaChartBar, FaDatabase } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

function TestimonialsCarousel() {
  const testimonials = [
    {
      text: "BlueWave Dental has completely transformed the way we manage our dental care. The team is incredibly intuitive, and the customized reports have made decision-making so much easier.",
      name: "Floyd Miles",
      company: "McDonald's",
    },
    {
      text: "The collaboration features have significantly improved communication across our teams. We're completing projects faster and with fewer errors.",
      name: "Jane Cooper",
      company: "Louis Vuitton",
    },
    {
      text: "BlueWave Dental has completely transformed the way we manage our dental care. The team is incredibly intuitive, and the customized reports have made decision-making so much easier.",
      name: "Jenny Wilson",
      company: "Louis Vuitton",
    },
    {
      text: "The collaboration features have significantly improved communication across our teams. We're completing projects faster and with fewer errors.",
      name: "Courtney Henry",
      company: "Louis Vuitton",
    },
  ]

  const [start, setStart] = useState(0)
  const visible = 4
  const end = start + visible
  const canPrev = start > 0
  const canNext = end < testimonials.length

  const handlePrev = () => {
    if (canPrev) setStart(start - 1)
  }

  const handleNext = () => {
    if (canNext) setStart(start + 1)
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 w-full" style={{ scrollBehavior: "smooth" }}>
            {testimonials.slice(start, end).map((t, idx) => (
              <Card
                key={idx}
                className="bg-white border-0 rounded-3xl p-6 flex flex-col justify-between min-h-[280px] min-w-[300px] max-w-[340px] flex-shrink-0 shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30"
              >
                <div className="text-gray-700 text-lg mb-8 leading-relaxed font-medium italic">"{t.text}"</div>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0077B6] to-[#005f8e] flex items-center justify-center shadow-lg">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-base">{t.name}</div>
                    <div className="text-sm text-[#0077B6] font-medium">{t.company}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <>
      <SignedIn>
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex flex-col items-center justify-between relative">
          {/* Top Navigation Bar */}
          <nav className="w-full bg-white text-gray-900 py-4 shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl w-full flex items-center justify-between px-6 md:px-8">
              {/* Clean Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0077B6] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 15s1.5-2 4-2 4 2 4 2" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-xl text-gray-900">BlueWave</span>
                  <span className="text-[#0077B6] text-sm font-medium ml-1">Dental</span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-8">
                  {[
                    { href: "#services", label: "Services" },
                    { href: "#why", label: "Why Us" },
                    { href: "#testimonials", label: "Testimonials" },
                    { href: "#team", label: "Team" },
                    { href: "#contact", label: "Contact" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-gray-600 hover:text-[#0077B6] font-medium text-sm transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>

                {/* User Button */}
                <div className="flex items-center gap-4">
                  <UserButton
                    afterSignOutUrl="/sign-in"
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 rounded-full",
                        userButtonPopoverCard: "bg-white border border-gray-200 shadow-lg rounded-lg",
                      },
                    }}
                  />

                  {/* Mobile Menu Button */}
                  <button
                    className="md:hidden p-2 text-gray-600 hover:text-[#0077B6] transition-colors duration-200"
                    aria-label="Open menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
              <div className="md:hidden bg-white border-t border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="flex flex-col gap-4">
                    {[
                      { href: "#services", label: "Services" },
                      { href: "#why", label: "Why Us" },
                      { href: "#testimonials", label: "Testimonials" },
                      { href: "#team", label: "Team" },
                      { href: "#contact", label: "Contact" },
                    ].map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="text-gray-600 hover:text-[#0077B6] font-medium py-2 transition-colors duration-200"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                    <div className="pt-4 border-t border-gray-100 mt-2">
                      <Button className="w-full bg-[#0077B6] text-white hover:bg-[#005f8e] py-2 text-sm font-medium">
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Hero Section */}
          <section className="w-full bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 flex flex-col items-center justify-center px-6 md:px-12 py-16 md:py-32 min-h-[700px] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-transparent rounded-full blur-3xl"></div>

            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto z-10 text-center">
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 text-[#0077B6] px-8 py-3 rounded-full font-bold mb-8 text-lg md:text-xl shadow-lg border border-blue-200/50 backdrop-blur-sm hover:scale-105 transition-transform duration-200">
                ✨ Top-Notch Dental Care, Just for You
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-8 text-gray-900 leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                Your{" "}
                <span className="bg-gradient-to-r from-[#0077B6] to-[#0088CC] bg-clip-text text-transparent">
                  Best Dental
                </span>{" "}
                Experience Awaits
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-12 font-medium leading-relaxed max-w-3xl">
                Learn about our care, convenient scheduling, and advanced services designed to deliver an ideal patient
                experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button className="bg-gradient-to-r from-[#0077B6] to-[#0088CC] text-white px-8 py-6 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border-0">
                  Explore Our Services
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-[#0077B6] text-[#0077B6] px-8 py-6 rounded-2xl text-lg font-bold shadow-xl hover:bg-[#0077B6] hover:text-white transition-all duration-300 flex items-center gap-4 bg-white/80 backdrop-blur-sm"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#0077B6] to-[#0088CC] rounded-full flex items-center justify-center">
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                      <polygon points="10,8 16,12 10,16" />
                    </svg>
                  </div>
                  Watch Video
                </Button>
              </div>
            </div>
          </section>

          {/* Services Overview */}
          <section id="services" className="max-w-7xl w-full py-12 md:py-20 mx-auto px-6">
            <div className="mb-12">
              <h3 className="text-sm font-bold text-[#0077B6] mb-4 tracking-widest uppercase">OUR SERVICES</h3>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">A Wide Range of Services</h2>
                  <p className="text-lg text-gray-600 text-xl font-medium">for Your Best Smile</p>
                </div>
                <Button className="mt-6 md:mt-0 bg-gradient-to-r from-[#0077B6] to-[#0088CC] text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  Explore All Services
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-8 w-full min-w-[320px] md:min-w-0">
                <Card className="overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col p-0 min-w-[280px] max-w-[320px] flex-shrink-0 transition-all duration-300 border-0">
                  <div className="h-48 w-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-transparent"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#0077B6] to-[#0088CC] rounded-2xl flex items-center justify-center shadow-xl z-10">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <div className="font-bold text-xl text-gray-900 mb-2">General Dentistry</div>
                    <div className="text-gray-600 text-base mb-6 leading-relaxed">
                      Comprehensive exams, cleanings, and preventive care.
                    </div>
                    <Button
                      variant="outline"
                      className="border-2 border-[#0077B6] text-[#0077B6] px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-[#0077B6] hover:text-white transition-all duration-300 bg-transparent"
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
                <Card className="overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col p-0 min-w-[280px] max-w-[320px] flex-shrink-0 transition-all duration-300 border-0">
                  <div className="h-48 w-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-transparent"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#0077B6] to-[#0088CC] rounded-2xl flex items-center justify-center shadow-xl z-10">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 6v6" />
                        <path d="m21 12-6-6-6 6-6-6" />
                      </svg>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <div className="font-bold text-xl text-gray-900 mb-2">Dental Implant</div>
                    <div className="text-gray-600 text-base mb-6 leading-relaxed">
                      Permanent solutions for missing teeth.
                    </div>
                    <Button
                      variant="outline"
                      className="border-2 border-[#0077B6] text-[#0077B6] px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-[#0077B6] hover:text-white transition-all duration-300 bg-transparent"
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
                <Card className="overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col p-0 min-w-[280px] max-w-[320px] flex-shrink-0 transition-all duration-300 border-0">
                  <div className="h-48 w-full bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 to-transparent"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#0077B6] to-[#0088CC] rounded-2xl flex items-center justify-center shadow-xl z-10">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="px-6 py-5">
                    <div className="font-bold text-xl text-gray-900 mb-2">Teeth Whitening</div>
                    <div className="text-gray-600 text-base mb-6 leading-relaxed">
                      Whitening, veneers, and smile makeovers.
                    </div>
                    <Button
                      variant="outline"
                      className="border-2 border-[#0077B6] text-[#0077B6] px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-[#0077B6] hover:text-white transition-all duration-300 bg-transparent"
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section id="why" className="max-w-7xl w-full py-12 md:py-20 mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Experience the difference with our comprehensive approach to dental care
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-white rounded-3xl shadow-2xl p-6 md:p-10 border-0">
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 transition-all duration-300">
                <div className="mb-4 text-[#0077B6] w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <FaShieldAlt size={24} />
                </div>
                <div className="font-bold text-xl text-gray-900">Hygiene & Safety</div>
                <div className="text-gray-600 text-base leading-relaxed">
                  Strict sterilization and safety protocols for your peace of mind.
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 transition-all duration-300">
                <div className="mb-4 text-[#0077B6] w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <FaUserMd size={24} />
                </div>
                <div className="font-bold text-xl text-gray-900">Expertise</div>
                <div className="text-gray-600 text-base leading-relaxed">
                  Experienced dentists and specialists dedicated to your care.
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 transition-all duration-300">
                <div className="mb-4 text-[#0077B6] w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <FaChartBar size={24} />
                </div>
                <div className="font-bold text-xl text-gray-900">Modern Technology</div>
                <div className="text-gray-600 text-base leading-relaxed">
                  State-of-the-art equipment and digital solutions for best results.
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 transition-all duration-300">
                <div className="mb-4 text-[#0077B6] w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <FaGlobe size={24} />
                </div>
                <div className="font-bold text-xl text-gray-900">Global Standards</div>
                <div className="text-gray-600 text-base leading-relaxed">
                  Internationally recognized care and protocols for every patient.
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100/50 transition-all duration-300">
                <div className="mb-4 text-[#0077B6] w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <FaUsers size={24} />
                </div>
                <div className="font-bold text-xl text-gray-900">Collaboration</div>
                <div className="text-gray-600 text-base leading-relaxed">
                  Teamwork and communication for a seamless patient experience.
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 transition-all duration-300">
                <div className="mb-4 text-[#0077B6] w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <FaDatabase size={24} />
                </div>
                <div className="font-bold text-xl text-gray-900">Data-Driven Care</div>
                <div className="text-gray-600 text-base leading-relaxed">
                  Smart insights and digital records for informed decisions and better outcomes.
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="max-w-7xl w-full py-12 md:py-20 mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Real stories from real patients who trust us with their smiles
            </p>
            <TestimonialsCarousel />
          </section>

          {/* Meet Our Team */}
          <section id="team" className="max-w-7xl w-full py-12 md:py-20 mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 text-center">Meet Our Team</h2>
            <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Dedicated professionals committed to your oral health and comfort
            </p>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-8 w-full min-w-[320px] md:min-w-0">
                <Card className="bg-white border-0 shadow-2xl flex flex-col items-center p-8 rounded-3xl transition-all duration-300 min-w-[280px] max-w-[320px] flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#0077B6] to-[#0088CC] rounded-full mb-6 flex items-center justify-center shadow-2xl">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="5" />
                      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div className="font-bold text-2xl text-gray-900 mb-2">Dr. Emily Carter</div>
                  <div className="text-[#0077B6] text-lg mb-4 font-semibold">Lead Dentist</div>
                  <div className="text-gray-600 text-base text-center leading-relaxed">
                    Expert in cosmetic and restorative dentistry. Passionate about patient care and comfort.
                  </div>
                </Card>
                <Card className="bg-white border-0 shadow-2xl flex flex-col items-center p-8 rounded-3xl transition-all duration-300 min-w-[280px] max-w-[320px] flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#0077B6] to-[#0088CC] rounded-full mb-6 flex items-center justify-center shadow-2xl">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="5" />
                      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div className="font-bold text-2xl text-gray-900 mb-2">Dr. John Smith</div>
                  <div className="text-[#0077B6] text-lg mb-4 font-semibold">Orthodontist</div>
                  <div className="text-gray-600 text-base text-center leading-relaxed">
                    Specialist in braces and aligners. Dedicated to creating beautiful, healthy smiles.
                  </div>
                </Card>
                <Card className="bg-white border-0 shadow-2xl flex flex-col items-center p-8 rounded-3xl transition-all duration-300 min-w-[280px] max-w-[320px] flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#0077B6] to-[#0088CC] rounded-full mb-6 flex items-center justify-center shadow-2xl">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="5" />
                      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div className="font-bold text-2xl text-gray-900 mb-2">Dr. Priya Patel</div>
                  <div className="text-[#0077B6] text-lg mb-4 font-semibold">Implant Specialist</div>
                  <div className="text-gray-600 text-base text-center leading-relaxed">
                    Expert in dental implants and oral surgery. Committed to advanced, gentle care.
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="w-full py-12 md:py-20 bg-gradient-to-r from-[#0077B6] via-[#0088CC] to-[#0077B6] flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="max-w-4xl w-full flex flex-col items-center justify-center text-center z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8 drop-shadow-lg">
                Book Your Appointment Today
              </h2>
              <p className="text-lg md:text-xl text-white/90 text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl">
                Experience gentle, modern dental care. Schedule your visit and smile with confidence!
              </p>
              <Button className="bg-white text-[#0077B6] px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl transition-all duration-300 flex items-center gap-4">
                <svg
                  className="w-7 h-7 text-[#0077B6]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Book Appointment
              </Button>
            </div>
          </section>

          {/* Footer */}
          <footer id="contact" className="w-full bg-white border-t border-gray-200 py-10 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <div className="font-black text-xl text-[#0077B6] mb-3">BlueWave Dental Clinic</div>
                <div className="text-gray-600 text-sm mb-1">📍 123 Smile Ave, City, Country</div>
                <div className="text-gray-600 text-sm mb-1">📧 contact@bluewavedental.com</div>
                <div className="text-gray-600 text-sm mb-1">📞 +1 234 567 8901</div>
                <div className="text-gray-600 text-sm">🕒 Mon–Sat: 9am–7pm</div>
              </div>
              <div className="flex space-x-6 justify-center md:justify-end">
                <a
                  href="#"
                  className="text-[#0077B6] hover:text-[#0088CC] transition-colors duration-200 font-semibold text-base"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-[#0077B6] hover:text-[#0088CC] transition-colors duration-200 font-semibold text-base"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="text-[#0077B6] hover:text-[#0088CC] transition-colors duration-200 font-semibold text-base"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
        </main>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/sign-in" />
      </SignedOut>
    </>
  )
}
