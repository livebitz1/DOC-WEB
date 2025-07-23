import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import React from "react"

export function ServicesSection() {
  return (
    <section id="services" className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Badge variant="outline" className="mb-4 text-[#0077B6] border-[#0077B6]">OUR SERVICES</Badge>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">A Wide Range of Services</h2>
              <p className="text-lg text-gray-600">for Your Best Smile</p>
            </div>
            <Button className="mt-6 lg:mt-0 bg-[#0077B6] text-white">Explore All Services</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border border-gray-200">
            <div className="h-32 bg-blue-50 flex items-center justify-center">
              <div className="w-16 h-16 bg-[#0077B6] rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <CardContent className="p-6">
              <CardTitle className="text-lg text-gray-900 mb-2">General Dentistry</CardTitle>
              <p className="text-gray-600 text-sm mb-4">Comprehensive exams, cleanings, and preventive care.</p>
              <Button variant="outline" size="sm" className="border-[#0077B6] text-[#0077B6] bg-transparent">Learn More</Button>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <div className="h-32 bg-green-50 flex items-center justify-center">
              <div className="w-16 h-16 bg-[#0077B6] rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6" />
                  <path d="m21 12-6-6-6 6-6-6" />
                </svg>
              </div>
            </div>
            <CardContent className="p-6">
              <CardTitle className="text-lg text-gray-900 mb-2">Dental Implant</CardTitle>
              <p className="text-gray-600 text-sm mb-4">Permanent solutions for missing teeth.</p>
              <Button variant="outline" size="sm" className="border-[#0077B6] text-[#0077B6] bg-transparent">Learn More</Button>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <div className="h-32 bg-yellow-50 flex items-center justify-center">
              <div className="w-16 h-16 bg-[#0077B6] rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
            <CardContent className="p-6">
              <CardTitle className="text-lg text-gray-900 mb-2">Teeth Whitening</CardTitle>
              <p className="text-gray-600 text-sm mb-4">Whitening, veneers, and smile makeovers.</p>
              <Button variant="outline" size="sm" className="border-[#0077B6] text-[#0077B6] bg-transparent">Learn More</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
