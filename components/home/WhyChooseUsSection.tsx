import { Card, CardContent } from "@/components/ui/card"
import { FaShieldAlt, FaUserMd, FaGlobe, FaUsers, FaChartBar, FaDatabase } from "react-icons/fa"
import React from "react"

export function WhyChooseUsSection() {
  return (
    <section id="why" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our comprehensive approach to dental care
          </p>
        </div>
        <Card className="border border-gray-200">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaShieldAlt className="w-6 h-6 text-[#0077B6]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Hygiene & Safety</h3>
                <p className="text-gray-600 text-sm">Strict sterilization and safety protocols for your peace of mind.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaUserMd className="w-6 h-6 text-[#0077B6]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Expertise</h3>
                <p className="text-gray-600 text-sm">Experienced dentists and specialists dedicated to your care.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaChartBar className="w-6 h-6 text-[#0077B6]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Modern Technology</h3>
                <p className="text-gray-600 text-sm">State-of-the-art equipment and digital solutions for best results.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaGlobe className="w-6 h-6 text-[#0077B6]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Global Standards</h3>
                <p className="text-gray-600 text-sm">Internationally recognized care and protocols for every patient.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="w-6 h-6 text-[#0077B6]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Collaboration</h3>
                <p className="text-gray-600 text-sm">Teamwork and communication for a seamless patient experience.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FaDatabase className="w-6 h-6 text-[#0077B6]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Data-Driven Care</h3>
                <p className="text-gray-600 text-sm">Smart insights and digital records for informed decisions and better outcomes.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
