import React from "react"
import { TestimonialsCarousel } from "@/app/page"

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from real patients who trust us with their smiles
          </p>
        </div>
        <TestimonialsCarousel />
      </div>
    </section>
  )
}
