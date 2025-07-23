import { Card, CardContent } from "@/components/ui/card"
import React from "react"

export function TeamSection() {
  return (
    <section id="team" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dedicated professionals committed to your oral health and comfort
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border border-gray-200 text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 bg-[#0077B6] rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">Dr. Emily Carter</h3>
              <p className="text-[#0077B6] font-medium mb-3">Lead Dentist</p>
              <p className="text-gray-600 text-sm">Expert in cosmetic and restorative dentistry. Passionate about patient care and comfort.</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 bg-[#0077B6] rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">Dr. John Smith</h3>
              <p className="text-[#0077B6] font-medium mb-3">Orthodontist</p>
              <p className="text-gray-600 text-sm">Specialist in braces and aligners. Dedicated to creating beautiful, healthy smiles.</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 bg-[#0077B6] rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">Dr. Priya Patel</h3>
              <p className="text-[#0077B6] font-medium mb-3">Implant Specialist</p>
              <p className="text-gray-600 text-sm">Expert in dental implants and oral surgery. Committed to advanced, gentle care.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
