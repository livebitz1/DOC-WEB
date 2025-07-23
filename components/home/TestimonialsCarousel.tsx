import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function TestimonialsCarousel() {
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
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="flex gap-6 pb-4">
          {testimonials.slice(start, end).map((t, idx) => (
            <Card key={idx} className="min-w-[300px] max-w-[340px] flex-shrink-0 border border-gray-200">
              <CardContent className="p-6">
                <blockquote className="text-gray-700 text-base mb-6 leading-relaxed italic">"{t.text}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0077B6] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-[#0077B6] font-medium">{t.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
