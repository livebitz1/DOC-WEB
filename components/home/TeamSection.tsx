"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const teamMembers = [
  {
    id: 1,
    name: "Dr. Emily Carter",
    title: "Lead Dentist & Practice Owner",
    specialization: "Cosmetic & Restorative Dentistry",
    experience: "12+ years",
    image: "",
    bio: "Dr. Carter is a passionate dentist with over 12 years of experience in cosmetic and restorative dentistry. She graduated summa cum laude from Harvard School of Dental Medicine and has been transforming smiles ever since.",
    education: [
      "DDS, Harvard School of Dental Medicine",
      "BS Biology, Stanford University",
      "Advanced Cosmetic Dentistry Certificate",
    ],
    certifications: [
      "American Academy of Cosmetic Dentistry",
      "International Association of Orthodontics",
      "Invisalign Certified Provider",
    ],
    specialties: ["Porcelain Veneers", "Dental Implants", "Smile Makeovers", "Teeth Whitening"],
    languages: ["English", "Spanish"],
    email: "dr.carter@bluewavedental.com",
    phone: "+1 (555) 123-4567",
    availability: "Mon-Fri: 8:00 AM - 6:00 PM",
  },
  {
    id: 2,
    name: "Dr. John Smith",
    title: "Senior Orthodontist",
    specialization: "Orthodontics & Alignment",
    experience: "10+ years",
    image: "",
    bio: "Dr. Smith specializes in orthodontics and has helped thousands of patients achieve perfectly aligned smiles. He stays current with the latest orthodontic technologies and techniques.",
    education: ["DDS, NYU College of Dentistry", "MS Orthodontics, University of Pennsylvania", "BS Chemistry, UCLA"],
    certifications: ["American Board of Orthodontics", "Invisalign Diamond Provider", "Damon System Certified"],
    specialties: ["Traditional Braces", "Clear Aligners", "Invisalign", "Pediatric Orthodontics"],
    languages: ["English", "French"],
    email: "dr.smith@bluewavedental.com",
    phone: "+1 (555) 123-4568",
    availability: "Tue-Sat: 9:00 AM - 5:00 PM",
  },
  {
    id: 3,
    name: "Dr. Priya Patel",
    title: "Oral Surgeon & Implant Specialist",
    specialization: "Oral Surgery & Implantology",
    experience: "15+ years",
    image: "",
    bio: "Dr. Patel is a board-certified oral surgeon with extensive experience in dental implants and complex oral surgeries. She is known for her gentle approach and excellent patient care.",
    education: [
      "DDS, University of Michigan",
      "MS Oral Surgery, Johns Hopkins",
      "BS Biomedical Engineering, Duke University",
    ],
    certifications: [
      "American Board of Oral Surgery",
      "International Congress of Oral Implantologists",
      "Advanced Bone Grafting Certification",
    ],
    specialties: ["Dental Implants", "Bone Grafting", "Wisdom Teeth Removal", "TMJ Treatment"],
    languages: ["English", "Hindi", "Gujarati"],
    email: "dr.patel@bluewavedental.com",
    phone: "+1 (555) 123-4569",
    availability: "Mon-Thu: 7:00 AM - 4:00 PM",
  },
  {
    id: 4,
    name: "Dr. Michael Rodriguez",
    title: "Pediatric Dentist",
    specialization: "Pediatric & Family Dentistry",
    experience: "8+ years",
    image: "",
    bio: "Dr. Rodriguez specializes in pediatric dentistry and has a special talent for making children feel comfortable during dental visits. He believes in preventive care and education.",
    education: [
      "DDS, University of California San Francisco",
      "Pediatric Dentistry Residency, Children's Hospital",
      "BS Psychology, UC Berkeley",
    ],
    certifications: [
      "American Board of Pediatric Dentistry",
      "Sedation Dentistry Certified",
      "Special Needs Dentistry",
    ],
    specialties: ["Children's Dentistry", "Preventive Care", "Sedation Dentistry", "Special Needs Patients"],
    languages: ["English", "Spanish", "Portuguese"],
    email: "dr.rodriguez@bluewavedental.com",
    phone: "+1 (555) 123-4570",
    availability: "Mon-Fri: 8:00 AM - 5:00 PM",
  },
  {
    id: 5,
    name: "Dr. Sarah Kim",
    title: "Endodontist",
    specialization: "Root Canal & Endodontic Therapy",
    experience: "9+ years",
    image: "",
    bio: "Dr. Kim is an endodontic specialist who focuses on saving natural teeth through advanced root canal therapy. She uses the latest technology to ensure comfortable, successful treatments.",
    education: ["DDS, Columbia University", "MS Endodontics, University of Washington", "BS Biochemistry, MIT"],
    certifications: ["American Board of Endodontics", "Microscopic Endodontics Certified", "Regenerative Endodontics"],
    specialties: ["Root Canal Therapy", "Endodontic Retreatment", "Apicoectomy", "Trauma Management"],
    languages: ["English", "Korean", "Mandarin"],
    email: "dr.kim@bluewavedental.com",
    phone: "+1 (555) 123-4571",
    availability: "Tue-Fri: 9:00 AM - 6:00 PM",
  },
  {
    id: 6,
    name: "Dr. James Wilson",
    title: "Periodontist",
    specialization: "Gum Disease & Periodontal Therapy",
    experience: "11+ years",
    image: "",
    bio: "Dr. Wilson specializes in the prevention, diagnosis, and treatment of gum disease. He is committed to helping patients maintain healthy gums and supporting structures of the teeth.",
    education: ["DDS, University of Southern California", "MS Periodontics, UCLA", "BS Biology, UC San Diego"],
    certifications: ["American Board of Periodontology", "Laser Therapy Certified", "Implant Placement Certification"],
    specialties: ["Gum Disease Treatment", "Laser Therapy", "Gum Grafting", "Periodontal Maintenance"],
    languages: ["English", "German"],
    email: "dr.wilson@bluewavedental.com",
    phone: "+1 (555) 123-4572",
    availability: "Mon-Wed-Fri: 8:00 AM - 5:00 PM",
  },
]

export function TeamSection() {
  const [selectedMember, setSelectedMember] = useState<(typeof teamMembers)[0] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const router = useRouter();

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, teamMembers.length - itemsPerView);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  const handlePrev = () => {
    if (canPrev) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (canNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section id="team" className="py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 text-[#0077B6] border-[#0077B6] px-4 py-2 text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="m22 21-3-3m0 0a2 2 0 0 0 0-4 2 2 0 0 0 0 4" />
            </svg>
            OUR TEAM
          </Badge>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Meet Our{" "}
              <span className="text-[#0077B6] relative">
                Expert Team
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#0077B6]/20 to-[#0077B6]/40 rounded-full" />
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
              Our experienced team of dental professionals is dedicated to providing you with the highest quality care
              in a comfortable and welcoming environment.
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Professional Team</h3>
            <p className="text-gray-600 text-sm">
              Showing {currentIndex + 1}-{Math.min(currentIndex + itemsPerView, teamMembers.length)} of{" "}
              {teamMembers.length} specialists
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={!canPrev}
              className="w-10 h-10 p-0 border-gray-300 hover:border-[#0077B6] hover:text-[#0077B6] disabled:opacity-50 disabled:cursor-not-allowed bg-white"
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
              className="w-10 h-10 p-0 border-gray-300 hover:border-[#0077B6] hover:text-[#0077B6] disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Team Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {teamMembers.map((member) => (
              <div key={member.id} className="flex-shrink-0 px-3" style={{ width: `${100 / itemsPerView}%` }}>
                <Card className="h-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-[#0077B6]/30 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="text-center pb-4">
                    {/* Profile Photo */}
                    <div className="relative mx-auto mb-6">
                      <Avatar className="w-24 h-24 mx-auto border-4 border-gray-200">
                        <AvatarImage src={member.image || undefined} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#0077B6] to-[#005f8e] text-white text-xl font-bold">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Name and Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-[#0077B6] font-semibold text-sm mb-2">{member.title}</p>
                    <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 mb-4">
                      {member.specialization}
                    </Badge>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Experience and Quick Info */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-semibold text-gray-900">{member.experience}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Languages:</span>
                        <span className="font-medium text-gray-700">{member.languages.join(", ")}</span>
                      </div>
                    </div>

                    <Separator className="mb-6" />

                    {/* Top Specialties */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600">
                            {specialty}
                          </Badge>
                        ))}
                        {member.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                            +{member.specialties.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-[#0077B6] text-[#0077B6] bg-transparent hover:bg-blue-50"
                            onClick={() => setSelectedMember(member)}
                          >
                            View Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader className="text-left pb-6">
                            <div className="flex items-start gap-6 mb-6">
                              <Avatar className="w-20 h-20 border-4 border-gray-200">
                                <AvatarImage src={member.image || undefined} alt={member.name} />
                                <AvatarFallback className="bg-gradient-to-br from-[#0077B6] to-[#005f8e] text-white text-lg font-bold">
                                  {getInitials(member.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                                  {member.name}
                                </DialogTitle>
                                <p className="text-[#0077B6] font-semibold mb-2">{member.title}</p>
                                <div className="flex items-center gap-2 mb-4">
                                  <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200">
                                    {member.experience}
                                  </Badge>
                                  <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                                    Available
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <DialogDescription className="text-base text-gray-600 leading-relaxed">
                              {member.bio}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* Education */}
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-[#0077B6]"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                                Education
                              </h4>
                              <div className="space-y-2">
                                {member.education.map((edu, index) => (
                                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-[#0077B6] rounded-full flex-shrink-0 mt-2" />
                                    <span className="text-sm text-gray-700 font-medium">{edu}</span>
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
                                Certifications
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {member.certifications.map((cert, index) => (
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

                            <Separator />

                            {/* All Specialties */}
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
                                Specialties & Services
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                {member.specialties.map((specialty, index) => (
                                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                                    <span className="text-sm text-gray-700 font-medium">{specialty}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Contact Information */}
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-[#0077B6]"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Contact & Availability
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <svg
                                      className="w-4 h-4 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm text-gray-700">{member.email}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <svg
                                      className="w-4 h-4 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-sm text-gray-700">{member.phone}</span>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-3">
                                    <svg
                                      className="w-4 h-4 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-gray-700">{member.availability}</span>
                                  </div>
                                </div>
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
                                  Book with {member.name.split(" ")[1]}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="flex-1 border-[#0077B6] text-[#0077B6] bg-transparent"
                                >
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  Send Message
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        className="flex-1 bg-[#0077B6] hover:bg-[#005f8e] text-white"
                        onClick={() => router.push('/dentists')}
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                        </svg>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-[#0077B6] w-6" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-[#0077B6] to-[#005f8e] border-0 text-white shadow-2xl">
            <CardContent className="p-8 lg:p-12">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="m22 21-3-3m0 0a2 2 0 0 0 0-4 2 2 0 0 0 0 4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">Ready to Meet Your Perfect Dentist?</h3>
                <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                  Our experienced team is here to provide you with personalized, professional dental care. Schedule a
                  consultation with the specialist that's right for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-[#0077B6] hover:bg-gray-100 px-8 py-3 font-semibold shadow-lg"
                    onClick={() => {
                      window.location.href = '/dentists';
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                    </svg>
                    Schedule Consultation
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
