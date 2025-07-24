import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 min-h-[90vh] py-24 flex items-center relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-30" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-50/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-6 bg-blue-50 text-[#0077B6] border-blue-200 px-4 py-2 text-sm font-medium shadow-sm"
          >
            ✨ Top-Notch Dental Care, Just for You
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Your{" "}
            <span className="text-[#0077B6] relative">
              Best Dental
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#0077B6]/20 to-[#0077B6]/40 rounded-full" />
            </span>{" "}
            Experience Awaits
          </h1>

          <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Learn about our care, convenient scheduling, and advanced services designed to deliver an ideal patient
            experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-[#0077B6] hover:bg-[#005f8e] text-white px-8 py-3 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => window.location.href = '/book'}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
              </svg>
              Book Appointment
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#0077B6] text-[#0077B6] bg-white/80 backdrop-blur-sm hover:bg-[#0077B6] hover:text-white px-8 py-3 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="mr-2">
                <polygon points="10,8 16,12 10,16" />
              </svg>
              Watch Video
            </Button>
          </div>

          {/* Trust indicators */}
          <Card className="inline-flex items-center gap-6 px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0077B6] to-[#005f8e] border-2 border-white flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">2,500+ Happy Patients</div>
                <div className="text-xs text-gray-500">5-star rated care</div>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Same Day Appointments</div>
                <div className="text-xs text-gray-500">Available now</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
