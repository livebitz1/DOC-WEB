"use client";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Image from "next/image";
import React, { useState } from "react";
// Removed unused AuthWrapper import
function TestimonialsCarousel() {
  const testimonials = [
    {
      text: "BlueWave Dental has completely transformed the way we manage our dental care. The team is incredibly intuitive, and the customized reports have made decision-making so much easier.",
      name: "Floyd Miles",
      company: "McDonald's",
    },
    {
      text: "The collaboration features have significantly improved communication across our teams. We’re completing projects faster and with fewer errors.",
      name: "Jane Cooper",
      company: "Louis Vuitton",
    },
    {
      text: "BlueWave Dental has completely transformed the way we manage our dental care. The team is incredibly intuitive, and the customized reports have made decision-making so much easier.",
      name: "Jenny Wilson",
      company: "Louis Vuitton",
    },
    {
      text: "The collaboration features have significantly improved communication across our teams. We’re completing projects faster and with fewer errors.",
      name: "Courtney Henry",
      company: "Louis Vuitton",
    },
  ];

  const [start, setStart] = useState(0);
  const visible = 4;
  const end = start + visible;
  const canPrev = start > 0;
  const canNext = end < testimonials.length;

  const handlePrev = () => {
    if (canPrev) setStart(start - 1);
  };
  const handleNext = () => {
    if (canNext) setStart(start + 1);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-8 w-full" style={{ scrollBehavior: 'smooth' }}>
            {testimonials.slice(start, end).map((t, idx) => (
              <Card key={idx} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between min-h-[220px] min-w-[280px] max-w-[320px] flex-shrink-0">
                <div className="text-gray-700 text-base mb-6">“{t.text}”</div>
                <div className="flex items-center gap-3 mt-auto">
                  {/* Customer avatar icon using react-icons */}
                  <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#0077B6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.company}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        {/* Removed left and right arrow buttons for testimonial carousel */}
      </div>
    </div>
  );
}
import { FaShieldAlt, FaUserMd, FaGlobe, FaUsers, FaChartBar, FaDatabase } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";

export default function Home() {

  const [menuOpen, setMenuOpen] = React.useState(false);
  // Fix for mobile menu: use portal and overlay for proper visibility and interaction
  return (
    <>
      <SignedIn>
        <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-between relative">
          {/* Top Navigation Bar */}
          <nav className="w-full bg-[#0077B6] text-white py-4 shadow">
            <div className="max-w-6xl w-full flex items-center justify-between px-4 md:px-6">
              <span className="font-bold text-2xl md:text-3xl tracking-wide flex items-center gap-2">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 15s1.5-2 4-2 4 2 4 2" /></svg>
                BlueWave Dental Clinic
              </span>
              <button className="md:hidden block p-2 rounded-lg hover:bg-[#005f8e] transition" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <div className="space-x-6 hidden md:flex">
                <a href="#services" className="hover:underline">Services</a>
                <a href="#why" className="hover:underline">Why Us</a>
                <a href="#testimonials" className="hover:underline">Testimonials</a>
                <a href="#team" className="hover:underline">Team</a>
                <a href="#contact" className="hover:underline">Contact</a>
              </div>
            </div>
            {/* Mobile Menu */}
            {menuOpen && (
              <div className="md:hidden w-full bg-[#0077B6] border-t border-[#E5E7EB] px-4 py-6 fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out transform translate-y-0 shadow-2xl animate-navbarPop">
                <div className="flex flex-col gap-4 text-lg font-semibold">
                  <a href="#services" className="hover:underline" onClick={() => setMenuOpen(false)}>Services</a>
                  <a href="#why" className="hover:underline" onClick={() => setMenuOpen(false)}>Why Us</a>
                  <a href="#testimonials" className="hover:underline" onClick={() => setMenuOpen(false)}>Testimonials</a>
                  <a href="#team" className="hover:underline" onClick={() => setMenuOpen(false)}>Team</a>
                  <a href="#contact" className="hover:underline" onClick={() => setMenuOpen(false)}>Contact</a>
                </div>
              </div>
            )}
          </nav>

          {/* Hero Section - Redesigned to match provided image */}
          <section className="w-full bg-[#F8FAFC] flex flex-col items-center justify-center px-4 md:px-12 py-16 md:py-32 min-h-[650px] relative overflow-hidden">
            <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto z-10 text-center">
              <div className="bg-[#E5E7EB] text-[#0077B6] px-6 py-2 rounded-full font-semibold mb-6 text-lg md:text-xl shadow inline-block">Top-Notch Dental Care, Just for You</div>
              <h1 className="text-4xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight">
                Your <span className="text-[#0077B6]">Best Dental</span> Experience Awaits
              </h1>
              <p className="text-lg md:text-2xl text-gray-600 mb-8 font-medium">
                Learn about our care, convenient scheduling, and advanced services designed to deliver an ideal patient experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button className="bg-[#0077B6] text-white px-10 py-7 rounded-lg text-2xl font-bold shadow hover:bg-[#005f8e]">Explore Our Services</Button>
                <Button variant="outline" className="border-[#0077B6] text-[#0077B6] px-10 py-7 rounded-lg text-2xl font-bold shadow flex items-center gap-3">
                  <svg width="28" height="28" fill="none" stroke="#0077B6" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="#0077B6"/></svg>
                  Watch Video
                </Button>
              </div>
            </div>

            {/* ...removed appointment bar from hero section... */}
          </section>

          {/* Services Overview */}
          <section id="services" className="max-w-6xl w-full py-12 md:py-16 mx-auto px-4">
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[#0077B6] mb-2 tracking-wide">OUR SERVICES</h3>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#0077B6] mb-1">A Wide Range of Services</h2>
                  <p className="text-gray-700 text-lg font-medium">for Your Best Smile</p>
                </div>
                <Button className="mt-4 md:mt-0 bg-[#0077B6] text-white px-6 py-3 rounded-full text-base font-bold shadow hover:bg-[#005f8e]">Explore All Services</Button>
              </div>
            </div>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-8 w-full min-w-[320px] md:min-w-0">
                <Card className="overflow-hidden bg-white rounded-2xl shadow-lg flex flex-col p-0 min-w-[260px] max-w-[320px] flex-shrink-0">
                  <div className="h-36 w-full bg-[#E5E7EB] flex items-center justify-center">
                    <img src="/globe.svg" alt="General Dentistry" className="w-16 h-16" />
                  </div>
                  <div className="px-6 py-4">
                    <div className="font-bold text-lg text-[#0077B6] mb-1">General Dentistry</div>
                    <div className="text-gray-500 text-sm mb-4">Comprehensive exams, cleanings, and preventive care.</div>
                    <Button variant="outline" className="border-[#0077B6] text-[#0077B6] px-4 py-2 rounded-full text-sm font-semibold shadow">Learn More</Button>
                  </div>
                </Card>
                <Card className="overflow-hidden bg-white rounded-2xl shadow-lg flex flex-col p-0 min-w-[260px] max-w-[320px] flex-shrink-0">
                  <div className="h-36 w-full bg-[#E5E7EB] flex items-center justify-center">
                    <img src="/next.svg" alt="Dental Implant" className="w-16 h-16" />
                  </div>
                  <div className="px-6 py-4">
                    <div className="font-bold text-lg text-[#0077B6] mb-1">Dental Implant</div>
                    <div className="text-gray-500 text-sm mb-4">Permanent solutions for missing teeth.</div>
                    <Button variant="outline" className="border-[#0077B6] text-[#0077B6] px-4 py-2 rounded-full text-sm font-semibold shadow">Learn More</Button>
                  </div>
                </Card>
                <Card className="overflow-hidden bg-white rounded-2xl shadow-lg flex flex-col p-0 min-w-[260px] max-w-[320px] flex-shrink-0">
                  <div className="h-36 w-full bg-[#E5E7EB] flex items-center justify-center">
                    <img src="/window.svg" alt="Teeth Whitening" className="w-16 h-16" />
                  </div>
                  <div className="px-6 py-4">
                    <div className="font-bold text-lg text-[#0077B6] mb-1">Teeth Whitening</div>
                    <div className="text-gray-500 text-sm mb-4">Whitening, veneers, and smile makeovers.</div>
                    <Button variant="outline" className="border-[#0077B6] text-[#0077B6] px-4 py-2 rounded-full text-sm font-semibold shadow">Learn More</Button>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section id="why" className="max-w-6xl w-full py-12 md:py-16 mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0077B6] mb-10">Why Choose Us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-[#E5E7EB]">
              <div className="flex flex-col gap-2 p-6 rounded-xl bg-[#F8FAFC]">
                <div className="mb-2 text-[#0077B6]"> <FaShieldAlt size={28} /> </div>
                <div className="font-bold text-lg text-gray-900">Hygiene & Safety</div>
                <div className="text-gray-600 text-sm">Strict sterilization and safety protocols for your peace of mind.</div>
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-xl bg-[#F8FAFC]">
                <div className="mb-2 text-[#0077B6]"> <FaUserMd size={28} /> </div>
                <div className="font-bold text-lg text-gray-900">Expertise</div>
                <div className="text-gray-600 text-sm">Experienced dentists and specialists dedicated to your care.</div>
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-xl bg-[#F8FAFC]">
                <div className="mb-2 text-[#0077B6]"> <FaChartBar size={28} /> </div>
                <div className="font-bold text-lg text-gray-900">Modern Technology</div>
                <div className="text-gray-600 text-sm">State-of-the-art equipment and digital solutions for best results.</div>
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-xl bg-[#F8FAFC]">
                <div className="mb-2 text-[#0077B6]"> <FaGlobe size={28} /> </div>
                <div className="font-bold text-lg text-gray-900">Global Standards</div>
                <div className="text-gray-600 text-sm">Internationally recognized care and protocols for every patient.</div>
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-xl bg-[#F8FAFC]">
                <div className="mb-2 text-[#0077B6]"> <FaUsers size={28} /> </div>
                <div className="font-bold text-lg text-gray-900">Collaboration</div>
                <div className="text-gray-600 text-sm">Teamwork and communication for a seamless patient experience.</div>
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-xl bg-[#F8FAFC]">
                <div className="mb-2 text-[#0077B6]"> <FaDatabase size={28} /> </div>
                <div className="font-bold text-lg text-gray-900">Data-Driven Care</div>
                <div className="text-gray-600 text-sm">Smart insights and digital records for informed decisions and better outcomes.</div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="max-w-6xl w-full py-12 md:py-16 mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#222] mb-10">What Our Clients Say</h2>
            <TestimonialsCarousel />
          </section>
          {/* Meet Our Team */}
          <section id="team" className="max-w-6xl w-full py-12 md:py-16 mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0077B6] mb-8 text-center">Meet Our Team</h2>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-8 w-full min-w-[320px] md:min-w-0">
                <Card className="bg-white border-2 border-[#E5E7EB] shadow-lg flex flex-col items-center p-8 rounded-2xl transition-transform hover:scale-105 min-w-[260px] max-w-[320px] flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-tr from-[#E5E7EB] to-[#0077B6]/10 rounded-full mb-4 flex items-center justify-center">
                    <svg className="w-14 h-14 text-[#0077B6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="5" />
                      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div className="font-bold text-xl text-[#0077B6] mb-1">Dr. Emily Carter</div>
                  <div className="text-gray-600 text-base mb-2">Lead Dentist</div>
                  <div className="text-gray-500 text-sm text-center">Expert in cosmetic and restorative dentistry. Passionate about patient care and comfort.</div>
                </Card>
                <Card className="bg-white border-2 border-[#E5E7EB] shadow-lg flex flex-col items-center p-8 rounded-2xl transition-transform hover:scale-105 min-w-[260px] max-w-[320px] flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-tr from-[#E5E7EB] to-[#0077B6]/10 rounded-full mb-4 flex items-center justify-center">
                    <svg className="w-14 h-14 text-[#0077B6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="5" />
                      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div className="font-bold text-xl text-[#0077B6] mb-1">Dr. John Smith</div>
                  <div className="text-gray-600 text-base mb-2">Orthodontist</div>
                  <div className="text-gray-500 text-sm text-center">Specialist in braces and aligners. Dedicated to creating beautiful, healthy smiles.</div>
                </Card>
                <Card className="bg-white border-2 border-[#E5E7EB] shadow-lg flex flex-col items-center p-8 rounded-2xl transition-transform hover:scale-105 min-w-[260px] max-w-[320px] flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-tr from-[#E5E7EB] to-[#0077B6]/10 rounded-full mb-4 flex items-center justify-center">
                    <svg className="w-14 h-14 text-[#0077B6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="5" />
                      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div className="font-bold text-xl text-[#0077B6] mb-1">Dr. Priya Patel</div>
                  <div className="text-gray-600 text-base mb-2">Implant Specialist</div>
                  <div className="text-gray-500 text-sm text-center">Expert in dental implants and oral surgery. Committed to advanced, gentle care.</div>
                </Card>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="w-full py-12 md:py-20 bg-[#0077B6] flex flex-col items-center justify-center px-4">
            <div className="max-w-xl w-full flex flex-col items-center justify-center text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow">Book Your Appointment Today</h2>
              <p className="text-white/80 text-lg mb-8">Experience gentle, modern dental care. Schedule your visit and smile with confidence!</p>
              <Button className="bg-white text-[#0077B6] px-10 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-[#E5E7EB] transition-all duration-200 flex items-center gap-3">
                <svg className="w-6 h-6 text-[#0077B6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Book Appointment
              </Button>
            </div>
          </section>

          {/* Footer */}
          <footer id="contact" className="w-full bg-white border-t border-[#E5E7EB] py-8 mt-8 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-0 md:px-6">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <div className="font-bold text-[#0077B6]">BlueWave Dental Clinic</div>
                <div className="text-gray-600 text-sm">123 Smile Ave, City, Country</div>
                <div className="text-gray-600 text-sm">contact@bluewavedental.com | +1 234 567 8901</div>
                <div className="text-gray-600 text-sm">Mon–Sat: 9am–7pm</div>
              </div>
              <div className="flex space-x-4 justify-center md:justify-end w-full md:w-auto">
                <a href="#" className="text-[#0077B6] hover:underline">Facebook</a>
                <a href="#" className="text-[#0077B6] hover:underline">Instagram</a>
                <a href="#" className="text-[#0077B6] hover:underline">LinkedIn</a>
              </div>
            </div>
          </footer>
        </main>
      </SignedIn>
      <SignedOut>
        {/* Only redirect, do not render anything else for signed out users */}
        <RedirectToSignIn redirectUrl="/sign-in" />
      </SignedOut>
    </>
  );
}
