"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FaShieldAlt, FaUserMd, FaGlobe, FaUsers, FaChartBar, FaDatabase } from "react-icons/fa"
import { useState } from "react"

const features = [
  {
    id: 1,
    icon: FaShieldAlt,
    title: "Hygiene & Safety",
    description: "Strict sterilization and safety protocols for your peace of mind.",
    details: [
      "Hospital-grade sterilization equipment",
      "Single-use disposable instruments",
      "Regular safety protocol updates",
      "COVID-19 safety measures",
    ],
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    stat: "100%",
    statLabel: "Safety Compliance",
    fullDescription:
      "Our commitment to hygiene and safety goes beyond industry standards. We maintain the highest level of cleanliness and safety protocols to ensure every patient feels secure and protected during their visit.",
    benefits: [
      "Peace of mind during treatment",
      "Reduced risk of infection",
      "Clean and sterile environment",
      "Updated safety protocols",
    ],
    certifications: ["OSHA Compliant", "CDC Guidelines", "ADA Standards"],
  },
  {
    id: 2,
    icon: FaUserMd,
    title: "Expert Team",
    description: "Experienced dentists and specialists dedicated to your care.",
    details: [
      "Board-certified dentists",
      "Continuing education programs",
      "Specialized training certifications",
      "Years of combined experience",
    ],
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    stat: "25+",
    statLabel: "Years Experience",
    fullDescription:
      "Our team consists of highly qualified dental professionals who are passionate about providing exceptional care. Each member brings years of experience and specialized expertise to ensure you receive the best possible treatment.",
    benefits: [
      "Expert diagnosis and treatment",
      "Personalized care plans",
      "Advanced treatment techniques",
      "Compassionate patient care",
    ],
    certifications: ["Board Certified", "ADA Member", "Continuing Education"],
  },
  {
    id: 3,
    icon: FaChartBar,
    title: "Modern Technology",
    description: "State-of-the-art equipment and digital solutions for best results.",
    details: ["Digital X-ray systems", "3D imaging technology", "Laser dentistry equipment", "CAD/CAM restorations"],
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    stat: "Latest",
    statLabel: "Technology",
    fullDescription:
      "We invest in the latest dental technology to provide more accurate diagnoses, comfortable treatments, and better outcomes. Our advanced equipment ensures precision and efficiency in every procedure.",
    benefits: ["More accurate diagnoses", "Faster treatment times", "Reduced discomfort", "Better treatment outcomes"],
    certifications: ["Digital Certified", "Technology Partner", "Innovation Award"],
  },
  {
    id: 4,
    icon: FaGlobe,
    title: "Global Standards",
    description: "Internationally recognized care and protocols for every patient.",
    details: [
      "ADA approved procedures",
      "International quality standards",
      "Evidence-based treatments",
      "Global best practices",
    ],
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    stat: "ISO",
    statLabel: "Certified",
    fullDescription:
      "We adhere to internationally recognized standards and protocols, ensuring that our patients receive world-class dental care that meets or exceeds global quality benchmarks.",
    benefits: [
      "World-class treatment quality",
      "Internationally recognized protocols",
      "Evidence-based care",
      "Quality assurance",
    ],
    certifications: ["ISO 9001", "International Standards", "Quality Certified"],
  },
  {
    id: 5,
    icon: FaUsers,
    title: "Patient-Centered Care",
    description: "Teamwork and communication for a seamless patient experience.",
    details: [
      "Personalized treatment plans",
      "Clear communication",
      "Comfort-focused approach",
      "Family-friendly environment",
    ],
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
    stat: "98%",
    statLabel: "Satisfaction Rate",
    fullDescription:
      "Every aspect of our practice is designed around you. From the moment you walk in, our team works together to ensure your comfort, address your concerns, and provide personalized care that meets your unique needs.",
    benefits: [
      "Personalized treatment approach",
      "Clear communication throughout",
      "Comfortable treatment environment",
      "Family-friendly atmosphere",
    ],
    certifications: ["Patient Choice Award", "Excellence in Service", "5-Star Rated"],
  },
  {
    id: 6,
    icon: FaDatabase,
    title: "Data-Driven Care",
    description: "Smart insights and digital records for informed decisions and better outcomes.",
    details: [
      "Electronic health records",
      "Treatment outcome tracking",
      "Predictive analytics",
      "Evidence-based decisions",
    ],
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600",
    stat: "24/7",
    statLabel: "Digital Access",
    fullDescription:
      "We leverage advanced data analytics and digital health records to make informed treatment decisions, track your progress, and ensure the best possible outcomes for your dental health.",
    benefits: [
      "Informed treatment decisions",
      "Better treatment outcomes",
      "Progress tracking",
      "Predictive care planning",
    ],
    certifications: ["HIPAA Compliant", "Digital Health", "Data Security"],
  },
]

const stats = [
  { number: "2,500+", label: "Happy Patients", icon: "👥" },
  { number: "15+", label: "Years of Service", icon: "🏆" },
  { number: "98%", label: "Success Rate", icon: "✅" },
  { number: "24/7", label: "Emergency Care", icon: "🚨" },
]

export function WhyChooseUsSection() {
  const [selectedFeature, setSelectedFeature] = useState<(typeof features)[0] | null>(null)

  const openFeatureDialog = (feature: (typeof features)[0]) => {
    setSelectedFeature(feature)
  }

  return (
    <section
      id="why"
      className="py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-30" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-50/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 text-[#0077B6] border-[#0077B6] px-4 py-2 text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            WHY CHOOSE US
          </Badge>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Excellence in{" "}
              <span className="text-[#0077B6] relative">
                Dental Care
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#0077B6]/20 to-[#0077B6]/40 rounded-full" />
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
              Experience the difference with our comprehensive approach to dental care, backed by expertise, technology,
              and genuine care for your well-being.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl lg:text-3xl font-bold text-[#0077B6] mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature) => {
            const IconComponent = feature.icon

            return (
              <Card
                key={feature.id}
                className="group bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-[#0077B6]/30 hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#0077B6]">{feature.stat}</div>
                      <div className="text-xs text-gray-500 font-medium">{feature.statLabel}</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#0077B6] transition-colors duration-200 mb-2">
                    {feature.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{feature.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-[#0077B6] text-[#0077B6] bg-transparent hover:bg-blue-50 transition-colors duration-200"
                        onClick={() => openFeatureDialog(feature)}
                      >
                        Learn More
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="text-left pb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center`}>
                            <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                          </div>
                          <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">{feature.title}</DialogTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200">
                                {feature.stat} {feature.statLabel}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <DialogDescription className="text-base text-gray-600 leading-relaxed">
                          {feature.fullDescription}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Key Features */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-[#0077B6]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Key Features
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {feature.details.map((detail, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-[#0077B6] rounded-full flex-shrink-0" />
                                <span className="text-sm text-gray-700 font-medium">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Benefits */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-[#0077B6]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Benefits for You
                          </h4>
                          <div className="space-y-3">
                            {feature.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <svg
                                    className="w-3 h-3 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-sm text-gray-700 leading-relaxed">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Certifications */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-[#0077B6]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Certifications & Standards
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {feature.certifications.map((cert, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="border-[#0077B6] text-[#0077B6] bg-blue-50"
                              >
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button className="flex-1 bg-[#0077B6] hover:bg-[#005f8e] text-white">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                              </svg>
                              Book Appointment
                            </Button>
                            <Button variant="outline" className="flex-1 border-[#0077B6] text-[#0077B6] bg-transparent">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Contact Us
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ...existing code... */}
      </div>
    </section>
  )
}
