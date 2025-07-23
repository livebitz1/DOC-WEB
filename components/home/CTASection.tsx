import { Button } from "@/components/ui/button"
import React from "react"

export function CTASection() {
  return (
    <section className="py-16 lg:py-20 bg-[#0077B6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Book Your Appointment Today</h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Experience gentle, modern dental care. Schedule your visit and smile with confidence!
        </p>
        <Button size="lg" className="bg-white text-[#0077B6]">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Book Appointment
        </Button>
      </div>
    </section>
  )
}
