"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Star, Calendar, Play } from "lucide-react"

export function HeroSection() {
  const { isSignedIn } = useUser()
  const router = useRouter()

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 min-h-[90vh] py-16 sm:py-24 flex items-center relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-30" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-50/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-6 bg-blue-50 text-[#0077B6] border-blue-200 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium shadow-sm"
          >
            ✨ Top-Notch Dental Care, Just for You
          </Badge>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight px-2">
            Your{" "}
            <span className="text-[#0077B6] relative inline-block">
              Best Dental
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-[#0077B6]/20 to-[#0077B6]/40 rounded-full" />
            </span>{" "}
            Experience Awaits
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto px-4">
            Learn about our care, convenient scheduling, and advanced services designed to deliver an ideal patient
            experience.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Button
              size="lg"
              className="bg-[#0077B6] hover:bg-[#005f8e] text-white px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              onClick={() => {
                if (isSignedIn) {
                  router.push("/book")
                } else {
                  router.push("/sign-in")
                }
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#0077B6] text-[#0077B6] bg-white/80 backdrop-blur-sm hover:bg-[#0077B6] hover:text-white px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Video
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center px-4">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm max-w-sm sm:max-w-none">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  {/* Avatar Stack */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#0077B6] to-[#005f8e] border-2 border-white flex items-center justify-center shadow-sm"
                        >
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-current" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider - Hidden on mobile */}
                  <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-blue-100 to-green-100" />

                  {/* Rating Info */}
                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm sm:text-base font-bold text-gray-900">4.8</span>
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">2,500+ Happy Patients</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">5-star rated care</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
