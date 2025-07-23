import React from "react"

export function FooterSection() {
  return (
    <footer id="contact" className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-center lg:text-left">
            <h3 className="font-bold text-xl text-[#0077B6] mb-3">BlueWave Dental Clinic</h3>
            <div className="space-y-1 text-gray-600 text-sm">
              <p>📍 123 Smile Ave, City, Country</p>
              <p>📧 contact@bluewavedental.com</p>
              <p>📞 +1 234 567 8901</p>
              <p>🕒 Mon–Sat: 9am–7pm</p>
            </div>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[#0077B6] font-medium text-sm">Facebook</a>
            <a href="#" className="text-[#0077B6] font-medium text-sm">Instagram</a>
            <a href="#" className="text-[#0077B6] font-medium text-sm">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
