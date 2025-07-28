
"use client";
import { FaTooth, FaRegStar, FaTeeth, FaSmile, FaUserMd, FaRegCalendarCheck, FaRegHeart, FaSyringe, FaLayerGroup, FaAlignLeft, FaRegGrinStars, FaRegClock, FaExclamationCircle } from "react-icons/fa";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useRouter } from "next/navigation"

const services = [
  {
    id: 1,
    title: "General Dentistry",
    description: "Comprehensive exams, cleanings, and preventive care for optimal oral health.",
    features: ["Regular Checkups", "Professional Cleaning", "Cavity Prevention", "Oral Health Assessment"],
    icon: <FaLayerGroup className="w-8 h-8 text-white" />,
    bgColor: "bg-blue-50",
    price: "From $120",
    duration: "45-60 min",
  },
  {
    id: 2,
    title: "Dental Implants",
    description: "Permanent solutions for missing teeth with natural-looking results.",
    features: ["Single Tooth Replacement", "Multiple Implants", "Full Mouth Restoration", "Bone Grafting"],
    icon: <FaSyringe className="w-8 h-8 text-white" />,
    bgColor: "bg-emerald-50",
    price: "From $2,500",
    duration: "2-3 visits",
  },
  {
    id: 3,
    title: "Teeth Whitening",
    description: "Professional whitening treatments for a brighter, more confident smile.",
    features: ["In-Office Whitening", "Take-Home Kits", "Custom Trays", "Stain Removal"],
    icon: <FaRegStar className="w-8 h-8 text-white" />,
    bgColor: "bg-amber-50",
    price: "From $350",
    duration: "60-90 min",
  },
  {
    id: 4,
    title: "Orthodontics",
    description: "Straighten your teeth with modern braces and clear aligner solutions.",
    features: ["Traditional Braces", "Clear Aligners", "Invisalign", "Retainers"],
    icon: <FaAlignLeft className="w-8 h-8 text-white" />,
    bgColor: "bg-purple-50",
    price: "From $3,200",
    duration: "12-24 months",
  },
  {
    id: 5,
    title: "Cosmetic Dentistry",
    description: "Enhance your smile with veneers, bonding, and aesthetic treatments.",
    features: ["Porcelain Veneers", "Dental Bonding", "Smile Makeovers", "Gum Contouring"],
    icon: <FaRegGrinStars className="w-8 h-8 text-white" />,
    bgColor: "bg-pink-50",
    price: "From $800",
    duration: "2-3 visits",
  },
  {
    id: 6,
    title: "Emergency Care",
    description: "Immediate dental care for urgent situations and dental emergencies.",
    features: ["24/7 Emergency Line", "Pain Relief", "Trauma Treatment", "Same-Day Appointments"],
    icon: <FaExclamationCircle className="w-8 h-8 text-white" />,
    bgColor: "bg-red-50",
    price: "From $150",
    duration: "30-60 min",
  },
]

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const router = useRouter();

  const handleLearnMore = (serviceId: number) => {
    setSelectedService(selectedService === serviceId ? null : serviceId);
  };

  const handleBookAppointment = () => {
    router.push('/dentists');
  };

  return (
    <section id="services" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 text-[#0077B6] border-[#0077B6] px-4 py-2 text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
            </svg>
            OUR SERVICES
          </Badge>

          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-2">
              <span className="inline-flex items-center justify-center rounded-full bg-blue-50 p-3 shadow text-blue-600">
                <FaTooth className="w-7 h-7" />
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Comprehensive Dental Care
              </h2>
            </div>
            {/* Removed badges for Family Friendly, Expert Dentists, Advanced Procedures, Easy Scheduling, Compassionate Care as requested */}
            <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
              From routine cleanings to advanced procedures, we provide complete dental solutions for your entire family
            </p>
            {/* Removed Book Appointment and Call Now buttons from Comprehensive Dental Care section as requested */}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              className="group border border-gray-200 hover:border-[#0077B6]/30 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              {/* Service Icon Header */}
              <div className={`h-24 ${service.bgColor} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5" />
                <div className="w-14 h-14 bg-[#0077B6] rounded-xl flex items-center justify-center shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#0077B6] transition-colors duration-200">
                    {service.title}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 text-xs">
                    {service.duration}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#0077B6]">{service.price}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLearnMore(service.id)}
                    className="text-[#0077B6] hover:bg-blue-50 p-2"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${selectedService === service.id ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Expandable Features Section */}
                {selectedService === service.id && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                      What's Included
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#0077B6] rounded-full flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-3" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLearnMore(service.id)}
                    className="flex-1 border-[#0077B6] text-[#0077B6] bg-transparent hover:bg-blue-50 transition-colors duration-200"
                  >
                    {selectedService === service.id ? "Show Less" : "Learn More"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleBookAppointment}
                    className="flex-1 bg-[#0077B6] hover:bg-[#005f8e] text-white transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                    </svg>
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-[#0077B6] to-[#005f8e] border-0 text-white">
            <CardContent className="p-8 lg:p-12">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">Not Sure Which Service You Need?</h3>
                <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                  Schedule a consultation with our experienced dental team. We'll assess your needs and recommend the
                  best treatment plan for your oral health.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-[#0077B6] hover:bg-gray-100 px-8 py-3 font-semibold"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Free Consultation
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#0077B6] px-8 py-3 font-semibold"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call (555) 123-4567
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </section>
  );
}
