"use client"

import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/nextjs"
import React, { useState } from "react"
import { FaShieldAlt, FaUserMd, FaGlobe, FaUsers, FaChartBar, FaDatabase } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"



import { Navigation } from "@/components/home/Navigation"
import { HeroSection } from "@/components/home/HeroSection"
import { ServicesSection } from "@/components/home/ServicesSection"
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { TeamSection } from "@/components/home/TeamSection"
import { CTASection } from "@/components/home/CTASection"
import { FooterSection } from "@/components/home/FooterSection"

export default function Home() {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <TeamSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}
