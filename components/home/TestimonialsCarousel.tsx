"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    text: "BlueWave Dental has completely transformed my smile and confidence. Dr. Carter and her team provided exceptional care throughout my entire treatment journey. The results exceeded my expectations!",
    name: "Sarah Johnson",
    location: "Downtown Seattle",
    treatment: "Smile Makeover",
    rating: 5,
    image: "",
  },
  {
    id: 2,
    text: "The professionalism and expertise at BlueWave Dental is outstanding. My dental implant procedure was seamless, and the follow-up care was exceptional. I couldn't be happier with the results.",
    name: "Michael Chen",
    location: "Bellevue",
    treatment: "Dental Implants",
    rating: 5,
    image: "",
  },
  {
    id: 3,
    text: "As someone who was anxious about dental procedures, the team at BlueWave made me feel completely at ease. Their gentle approach and modern technology made my root canal surprisingly comfortable.",
    name: "Emily Rodriguez",
    location: "Capitol Hill",
    treatment: "Root Canal",
    rating: 5,
    image: "",
  },
  {
    id: 4,
    text: "The orthodontic treatment I received was life-changing. The clear aligners were comfortable, and the results were amazing. The entire team was supportive throughout the process.",
    name: "David Thompson",
    location: "Queen Anne",
    treatment: "Orthodontics",
    rating: 5,
    image: "",
  },
  {
    id: 5,
    text: "BlueWave Dental's preventive care program has kept my family's teeth healthy for years. Their thorough cleanings and personalized care plans are exactly what we needed.",
    name: "Lisa Park",
    location: "Fremont",
    treatment: "Family Dentistry",
    rating: 5,
    image: "",
  },
  {
    id: 6,
    text: "The teeth whitening treatment gave me the bright smile I always wanted. The process was quick, comfortable, and the results were immediate. Highly recommend BlueWave Dental!",
    name: "James Wilson",
    location: "Ballard",
    treatment: "Teeth Whitening",
    rating: 5,
    image: "",
  },
]

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, testimonials.length - itemsPerView)
  const canPrev = currentIndex > 0
  const canNext = currentIndex < maxIndex

  const handlePrev = () => {
    if (canPrev) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (canNext) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))
  }

  return (
    <div className="w-full">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Patient Stories</h3>
          <p className="text-gray-600">Real experiences from our valued patients</p>
        </div>

        {/* Navigation Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={!canPrev}
            className="w-10 h-10 p-0 border-gray-300 hover:border-[#0077B6] hover:text-[#0077B6] disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canNext}
            className="w-10 h-10 p-0 border-gray-300 hover:border-[#0077B6] hover:text-[#0077B6] disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex-shrink-0 px-3" style={{ width: `${100 / itemsPerView}%` }}>
              <Card className="h-full border border-gray-200 hover:border-[#0077B6]/30 hover:shadow-lg transition-all duration-200 bg-white">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">{renderStars(testimonial.rating)}</div>

                  {/* Testimonial Text */}
                  <blockquote className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow italic">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Patient Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-gray-200">
                        <AvatarImage src={testimonial.image || undefined} alt={testimonial.name} />
                        <AvatarFallback className="bg-[#0077B6] text-white text-xs font-semibold">
                          {getInitials(testimonial.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                        <div className="text-xs text-gray-500">{testimonial.location}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 text-xs">
                      {testimonial.treatment}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex sm:hidden items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={!canPrev}
          className="w-10 h-10 p-0 border-gray-300 hover:border-[#0077B6] hover:text-[#0077B6] disabled:opacity-50 bg-transparent"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!canNext}
          className="w-10 h-10 p-0 border-gray-300 hover:border-[#0077B6] hover:text-[#0077B6] disabled:opacity-50 bg-transparent"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Button>
      </div>

      {/* Carousel Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex ? "bg-[#0077B6] w-6" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-[#0077B6] mb-1">2,500+</div>
            <div className="text-sm text-gray-600">Happy Patients</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0077B6] mb-1">98%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0077B6] mb-1">4.9/5</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0077B6] mb-1">15+</div>
            <div className="text-sm text-gray-600">Years of Service</div>
          </div>
        </div>
      </div>
    </div>
  )
}
