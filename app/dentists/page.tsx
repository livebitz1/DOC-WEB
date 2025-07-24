"use client"
import React, { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Dentist = {
  id: number;
  name: string;
  email: string;
  specialty?: string;
  imageUrl?: string;
  bio?: string;
  qualifications?: string[];
  availability?: {
    [key: string]: string[];
  };
};

export default function DentistsPage() {
  const [search, setSearch] = React.useState("");
  const [dentists, setDentists] = React.useState<Dentist[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showEmail, setShowEmail] = React.useState<{[id: number]: boolean}>({});
  const [copiedEmailId, setCopiedEmailId] = React.useState<number | null>(null);

  React.useEffect(() => {
    fetchDentists();
  }, []);

  const fetchDentists = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dentists");
      if (!res.ok) throw new Error("Failed to fetch dentists");
      const data = await res.json();
      setDentists(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  };

  const filteredDentists = dentists.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  // Handle selecting a dentist for booking
  const handleSelectForBooking = (dentist: Dentist) => {
    // If user came from /book, restore form state and redirect back
    const params = new URLSearchParams(window.location.search)
    const fromBook = params.get("from") === "book"
    if (fromBook) {
      // Restore form state if present
      const formData = sessionStorage.getItem("bookFormData")
      let url = `/book?doctor=${encodeURIComponent(dentist.name)}`
      if (formData) {
        // Optionally, could pass more state, but doctor is enough
        // Remove the saved state after use
        sessionStorage.removeItem("bookFormData")
      }
      window.location.href = url
    } else {
      window.location.href = `/book?doctor=${encodeURIComponent(dentist.name)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 text-[#0077B6] border-[#0077B6]">
              OUR TEAM
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-[#0077B6]">Expert Dentists</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our experienced team of dental professionals is dedicated to providing you with the highest quality care
              in a comfortable and welcoming environment.
            </p>
            <div className="mt-8 flex justify-center">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by dentist name..."
                className="w-full max-w-md px-5 py-3 rounded-full border border-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-[#0077B6] text-lg"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Dentists Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center text-gray-500 text-xl py-20">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-xl py-20">{error}</div>
        ) : filteredDentists.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-20">No dentists found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDentists.map((dentist, idx) => (
              <Card key={idx} className="border border-gray-200 bg-white">
                <CardHeader className="text-center pb-4">
                  {/* Profile Photo or Placeholder */}
                  {dentist.imageUrl ? (
                    <img
                      src={dentist.imageUrl}
                      alt={dentist.name}
                      className="w-32 h-32 mx-auto mb-6 rounded-full object-cover border-4 border-[#0077B6] shadow"
                    />
                  ) : (
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#0077B6] to-[#005f8e] rounded-full flex items-center justify-center">
                      <span className="text-3xl text-white font-bold">{dentist.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                  )}

                  {/* Name and Specialization */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{dentist.name}</h2>
                  <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 mb-4">
                    {dentist.specialty}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Availability Section */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Availability</h3>
                    {dentist.availability && Object.keys(dentist.availability).some(day => dentist.availability && dentist.availability[day]?.length > 0) ? (
                      <div className="space-y-2">
                        {Object.entries(dentist.availability).map(([day, slots]) => (
                          slots && slots.length > 0 ? (
                            <div key={day} className="flex items-start gap-2">
                              <span className="capitalize w-16 font-medium text-gray-700">{day}:</span>
                              <div className="flex flex-wrap gap-2">
                                {slots.map((slot, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs border border-blue-200">
                                    {slot}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : null
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No availability set</span>
                    )}
                  </div>
                  {/* Qualifications */}
                  {dentist.qualifications && dentist.qualifications.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Qualifications</h3>
                      <div className="space-y-2">
                        {dentist.qualifications.map((qualification, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-[#0077B6] rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-600 leading-relaxed">{qualification}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator className="mb-6" />

                  {/* Bio */}
                  {dentist.bio && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">About</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{dentist.bio}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-[#0077B6] text-[#0077B6] bg-transparent"
                      size="sm"
                      onClick={() => setShowEmail(prev => ({ ...prev, [dentist.id]: !prev[dentist.id] }))}
                    >
                      {showEmail[dentist.id] ? "Hide Email" : "Contact"}
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 bg-[#0077B6] text-white"
                      size="sm"
                      onClick={() => handleSelectForBooking(dentist)}
                    >
                      Select for Booking
                    </Button>
                  </div>
                  {showEmail[dentist.id] && (
                    <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-full overflow-hidden">
                      <span className="font-semibold text-[#0077B6]">Email:</span>
                      <span className="ml-2 text-gray-700 truncate break-all inline-block align-middle w-5/6 max-w-full" title={dentist.email}>{dentist.email}</span>
                      <button
                        className="ml-2 px-2 py-1 bg-[#0077B6] text-white rounded text-xs hover:bg-[#005f8e] transition"
                        onClick={() => {
                          navigator.clipboard.writeText(dentist.email);
                          setCopiedEmailId(dentist.id);
                          setTimeout(() => setCopiedEmailId(null), 1500);
                        }}
                        title="Copy Email"
                      >
                        {copiedEmailId === dentist.id ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Schedule Your Appointment?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Our team is here to provide you with exceptional dental care. Contact us today to book your consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#0077B6] text-white">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </Button>
              <Button size="lg" variant="outline" className="border-[#0077B6] text-[#0077B6] bg-transparent">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                </svg>
                Book Online
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-[#0077B6] rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 text-sm">
                123 Smile Ave
                <br />
                City, Country
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-[#0077B6] rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm">
                +1 234 567 8901
                <br />
                Emergency: +1 234 567 8902
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-[#0077B6] rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
              <p className="text-gray-600 text-sm">
                Mon-Fri: 9am-7pm
                <br />
                Sat: 9am-5pm
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
