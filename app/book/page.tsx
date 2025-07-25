"use client"

import React from "react"
import { Navigation } from "@/components/home/Navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"


export default function BookPage() {
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState("")
  const [doctors, setDoctors] = React.useState<any[]>([])
  const [formData, setFormData] = React.useState({
    doctor: "",
    service: "",
    consultationType: "",
    consent: false,
    preferredDate: "",
    preferredTime: "",
  })
  // Store available dates for selected doctor
  const [availableDates, setAvailableDates] = React.useState<string[]>([])
  const [doctorSelected, setDoctorSelected] = React.useState(false)
  const [availability, setAvailability] = React.useState<{ [key: string]: string[] }>({})
  const [bookedSlots, setBookedSlots] = React.useState<string[]>([])

  // On mount, fetch doctors and check for doctor param in URL
  React.useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/dentists")
        const data = await res.json()
        if (Array.isArray(data)) {
          setDoctors(data)
        }
      } catch {}
    }
    fetchDoctors()

    // Check for ?doctor= param in URL
    const params = new URLSearchParams(window.location.search)
    const doctorParam = params.get("doctor")
    if (doctorParam) {
      setFormData((prev) => ({ ...prev, doctor: doctorParam }))
      setDoctorSelected(true)
    }
  }, [])

  // When doctor changes, update available dates
  React.useEffect(() => {
    const selectedDoctor = doctors.find((d) => d.name === formData.doctor)
    if (selectedDoctor && selectedDoctor.availability) {
      // Only use date keys in YYYY-MM-DD format
      const dateKeys = Object.keys(selectedDoctor.availability).filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key) && Array.isArray(selectedDoctor.availability[key]) && selectedDoctor.availability[key].length > 0)
      setAvailableDates(dateKeys)
      // If current preferredDate is not in availableDates, reset it
      if (!dateKeys.includes(formData.preferredDate)) {
        setFormData(prev => ({ ...prev, preferredDate: "", preferredTime: "" }))
      }
    } else {
      setAvailableDates([])
      setFormData(prev => ({ ...prev, preferredDate: "", preferredTime: "" }))
    }
  }, [formData.doctor, doctors])

  // When doctor or date changes, update availability and fetch booked slots
  React.useEffect(() => {
    const selectedDoctor = doctors.find((d) => d.name === formData.doctor)
    if (selectedDoctor && formData.preferredDate) {
      // Use slots for the selected date
      setAvailability(selectedDoctor.availability?.[formData.preferredDate] || [])
      // Fetch booked slots for this doctor/date
      fetch(`/api/bookings?doctorEmail=${encodeURIComponent(selectedDoctor.email)}`)
        .then(res => res.json())
        .then(bookings => {
          const booked = bookings
            .filter((b: any) => b.preferredDate && new Date(b.preferredDate).toISOString().slice(0, 10) === formData.preferredDate)
            .map((b: any) => b.preferredTime)
          setBookedSlots(booked)
        })
    } else {
      setAvailability({})
      setBookedSlots([])
    }
  }, [formData.doctor, formData.preferredDate, doctors])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const form = e.currentTarget
    const data = {
      fullName: form.fullName.value,
      email: form.email.value,
      phone: form.phone.value,
      doctor: formData.doctor,
      service: formData.service,
      preferredDate: form.preferredDate.value,
      preferredTime: form.preferredTime.value,
      consultationType: formData.consultationType,
      message: form.message.value,
      consent: formData.consent,
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        // Try to parse error message from backend
        let errMsg = "Failed to submit booking"
        try {
          const errData = await res.json()
          if (errData && errData.error) errMsg = errData.error
        } catch {}
        throw new Error(errMsg)
      }
      setSuccess(true)
      form.reset()
      setFormData({
        doctor: "",
        service: "",
        consultationType: "",
        consent: false,
        preferredDate: "",
        preferredTime: "",
      })
    } catch (err: any) {
      setError(err.message || "Unknown error")
    }
    setLoading(false)
  }

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
        <Card className="w-full max-w-5xl shadow-sm border border-gray-200">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 px-4 py-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                </svg>
                Book Appointment
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Schedule Your Visit</CardTitle>
            <p className="text-gray-600 mt-2">Fill out the form below to book your dental appointment</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700 font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      required
                      className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6]"
                    />
                  </div>
                </div>
              </div>
              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Doctor Selection *</Label>
                    {formData.doctor ? (
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-[#0077B6] text-base">{formData.doctor}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-[#0077B6] text-[#0077B6] bg-transparent px-3 py-1"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, doctor: "" }))
                            setDoctorSelected(false)
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        className="bg-[#0077B6] text-white w-full"
                        onClick={() => {
                          sessionStorage.setItem("bookFormData", JSON.stringify(formData))
                          window.location.href = "/dentists?from=book"
                        }}
                      >
                        Select Doctor
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Service Selection *</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                      disabled={!formData.doctor}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6]">
                        <SelectValue placeholder={formData.doctor ? "Select a service" : "Select doctor first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {(() => {
                          const selectedDoctor = doctors.find((d) => d.name === formData.doctor);
                          if (!selectedDoctor || !selectedDoctor.services || selectedDoctor.services.length === 0) {
                            return <div className="px-4 py-2 text-gray-500">No services available</div>;
                          }
                          return selectedDoctor.services.map((service: string) => (
                            <SelectItem key={service} value={service}>{service}</SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate" className="text-gray-700 font-medium">
                      Preferred Date *
                    </Label>
                    <select
                      id="preferredDate"
                      name="preferredDate"
                      required
                      value={formData.preferredDate}
                      onChange={e => setFormData({ ...formData, preferredDate: e.target.value, preferredTime: "" })}
                      className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6] rounded-md w-full px-3 py-2"
                      disabled={!formData.doctor || availableDates.length === 0}
                    >
                      <option value="" disabled>
                        {formData.doctor ? (availableDates.length === 0 ? "No available dates" : "Select a date") : "Select doctor first"}
                      </option>
                      {availableDates.map(date => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime" className="text-gray-700 font-medium">
                      Preferred Time *
                    </Label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      required
                      value={formData.preferredTime}
                      onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6] rounded-md w-full px-3 py-2"
                      disabled={!formData.doctor || !formData.preferredDate || Object.values(availability).length === 0}
                    >
                      <option value="" disabled>
                        {(!formData.doctor || !formData.preferredDate) ? "Select doctor and date first" : Object.values(availability).length === 0 ? "No slots available" : "Select a time slot"}
                      </option>
                      {Array.isArray(availability)
                        ? availability.map((slot: string) => {
                            // Try to display the slot as-is, or prettify if possible
                            let display = slot;
                            // If slot is like "09:00-12:00 AM", format as "09:00 AM - 12:00 PM"
                            const rangeMatch = slot.match(/^(\d{1,2}:\d{2})\s?(AM|PM|am|pm)?\s?-\s?(\d{1,2}:\d{2})\s?(AM|PM|am|pm)?$/i);
                            if (rangeMatch) {
                              const [, start, startAmPm, end, endAmPm] = rangeMatch;
                              display = `${start}${startAmPm ? ' ' + startAmPm.toUpperCase() : ''} - ${end}${endAmPm ? ' ' + endAmPm.toUpperCase() : ''}`;
                            } else if (/^(\d{1,2}:\d{2})\s?(AM|PM|am|pm)?$/.test(slot)) {
                              // Single time with AM/PM
                              const [, t, ap] = slot.match(/^(\d{1,2}:\d{2})\s?(AM|PM|am|pm)?$/i) || [];
                              display = `${t}${ap ? ' ' + ap.toUpperCase() : ''}`;
                            }
                            return (
                              <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                                {display} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                              </option>
                            );
                          })
                        : Object.values(availability).flat().map((slot: string) => {
                            let display = slot;
                            const rangeMatch = slot.match(/^(\d{1,2}:\d{2})\s?(AM|PM|am|pm)?\s?-\s?(\d{1,2}:\d{2})\s?(AM|PM|am|pm)?$/i);
                            if (rangeMatch) {
                              const [, start, startAmPm, end, endAmPm] = rangeMatch;
                              display = `${start}${startAmPm ? ' ' + startAmPm.toUpperCase() : ''} - ${end}${endAmPm ? ' ' + endAmPm.toUpperCase() : ''}`;
                            } else if (/^(\d{1,2}:\d{2})\s?(AM|PM|am|pm)?$/.test(slot)) {
                              const [, t, ap] = slot.match(/^(\d{1,2}:\d{2})\s?(AM|PM|am|pm)?$/i) || [];
                              display = `${t}${ap ? ' ' + ap.toUpperCase() : ''}`;
                            }
                            return (
                              <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                                {display} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                              </option>
                            );
                          })}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Consultation Type *</Label>
                  <Select
                    value={formData.consultationType}
                    onValueChange={(value) => setFormData({ ...formData, consultationType: value })}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6]">
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In-Clinic">In-Clinic Visit</SelectItem>
                      <SelectItem value="Video">Video Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Additional Information
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium">
                    Message or Notes (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Any additional information or special requests..."
                    rows={4}
                    className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6] resize-none"
                  />
                </div>
              </div>
              {/* Consent */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                  required
                  className="mt-1 border-gray-300 data-[state=checked]:bg-[#0077B6] data-[state=checked]:border-[#0077B6]"
                />
                <Label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                  I consent to the clinic's privacy policy and terms of service. I understand that my personal information
                  will be used to process my appointment request.
                </Label>
              </div>
              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.doctor ||
                    !formData.preferredDate ||
                    !formData.preferredTime ||
                    Object.values(availability).length === 0 ||
                    (Array.isArray(availability)
                      ? availability.length === 0
                      : Object.values(availability).flat().length === 0)
                  }
                  className="w-full bg-[#0077B6] hover:bg-[#005f8e] text-white font-semibold py-3 text-base transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting Appointment...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                      </svg>
                      Submit Booking Request
                    </div>
                  )}
                </Button>
              </div>
              {/* Success/Error Messages */}
              {success && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-700 font-medium">
                    Booking submitted successfully! We'll contact you soon.
                  </span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
