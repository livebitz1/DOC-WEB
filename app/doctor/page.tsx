"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Dentist {
  id: number
  name: string
  email: string
  specialty?: string
  imageUrl?: string
  bio?: string
  qualifications?: string[]
  availability?: {
    [key: string]: string[]
  }
}

interface Booking {
  id: number
  fullName: string
  email: string
  phone: string
  doctor: string
  service: string
  preferredDate: string
  preferredTime: string
  consultationType: string
  message?: string
  consent: boolean
  status: string
  createdAt: string
}

export default function DoctorDashboard() {
  // --- Profile Customization State ---
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [availability, setAvailability] = useState<any>({
    mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: []
  })
  const [availableDays, setAvailableDays] = useState<{[key: string]: boolean}>({
    mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // When dentist is loaded, update profileImage, availability, availableDays
  // Move dentist state above so it's available for useEffect
  const [dentist, setDentist] = useState<Dentist | null>(null)

  useEffect(() => {
    if (dentist) {
      setProfileImage(dentist.imageUrl || null)
      setAvailability(dentist.availability || {
        mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: []
      })
      const days = ["mon","tue","wed","thu","fri","sat","sun"]
      const avail: any = {}
      days.forEach(day => { avail[day] = dentist.availability && dentist.availability[day]?.length > 0 })
      setAvailableDays(avail)
    }
  }, [dentist])

  // Handle image upload (base64 preview, real upload API to be added)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle day toggle
  const handleDayToggle = (day: string) => {
    setAvailableDays(prev => ({ ...prev, [day]: !prev[day] }))
    if (!availableDays[day]) setAvailability((prev: any) => ({ ...prev, [day]: prev[day] || ["09:00-12:00"] }))
    else setAvailability((prev: any) => ({ ...prev, [day]: [] }))
  }

  // Handle slot add/remove
  const handleAddSlot = (day: string) => {
    setAvailability((prev: any) => ({ ...prev, [day]: [...(prev[day] || []), "09:00-12:00"] }))
  }
  const handleRemoveSlot = (day: string, idx: number) => {
    setAvailability((prev: any) => ({ ...prev, [day]: prev[day].filter((_: any, i: number) => i !== idx) }))
  }
  const handleSlotChange = (day: string, idx: number, value: string) => {
    setAvailability((prev: any) => {
      const arr = [...prev[day]]
      arr[idx] = value
      return { ...prev, [day]: arr }
    })
  }

  // Save profile customization
  const handleSaveProfile = async () => {
    setSavingProfile(true)
    setProfileSaved(false)
    // Save image and availability to backend
    await fetch("/api/dentists/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: profileImage,
        availability,
      }),
    })
    // Refetch dentist data to ensure UI is in sync with DB
    if (user?.emailAddresses?.[0]?.emailAddress) {
      const dentistRes = await fetch("/api/dentists")
      const dentists: Dentist[] = await dentistRes.json()
      const matchedDentist = dentists.find((d) => d.email === user.emailAddresses[0].emailAddress)
      setDentist(matchedDentist || null)
    }
    setSavingProfile(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }
  // --- End Profile Customization State ---
  const { user, isLoaded } = useUser()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  // (moved above)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    bookingId: number | null
    patientName: string
  }>({
    isOpen: false,
    bookingId: null,
    patientName: "",
  })

  useEffect(() => {
    async function fetchDentistAndBookings() {
      if (isLoaded && user?.emailAddresses?.[0]?.emailAddress) {
        try {
          // Fetch all dentists
          const dentistRes = await fetch("/api/dentists")
          const dentists: Dentist[] = await dentistRes.json()

          // Find dentist profile by email
          const matchedDentist = dentists.find((d) => d.email === user.emailAddresses[0].emailAddress)
          setDentist(matchedDentist || null)

          if (matchedDentist) {
            setLoading(true)
            setError("")

            // Fetch all bookings
            const bookingsRes = await fetch("/api/bookings")
            const allBookings: Booking[] = await bookingsRes.json()

            // Filter bookings by both doctor name and email
            const filtered = allBookings.filter(
              (b) => b.doctor === matchedDentist.name && matchedDentist.email === user.emailAddresses[0].emailAddress,
            )
            setBookings(filtered)
            setLoading(false)
          } else {
            setBookings([])
          }
        } catch (err: any) {
          setError(err.message || "Unknown error")
          setBookings([])
        }
      }
    }
    fetchDentistAndBookings()
  }, [isLoaded, user])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleCheckboxChange = (checked: boolean, bookingId: number, patientName: string) => {
    if (checked) {
      // Open confirmation dialog
      setConfirmDialog({
        isOpen: true,
        bookingId,
        patientName,
      })
    }
  }

  const handleConfirmTreatment = async () => {
    if (!confirmDialog.bookingId) return

    setLoading(true)
    try {
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: confirmDialog.bookingId }),
      })

      // Refresh bookings after marking complete
      const bookingsRes = await fetch("/api/bookings")
      const allBookings: Booking[] = await bookingsRes.json()
      const filtered = allBookings.filter(
        (b) => b.doctor === dentist!.name && dentist!.email === user!.emailAddresses[0].emailAddress,
      )
      setBookings(filtered)

      // Close dialog
      setConfirmDialog({
        isOpen: false,
        bookingId: null,
        patientName: "",
      })
    } catch (err) {
      alert("Failed to mark as completed")
    }
    setLoading(false)
  }

  const handleCancelConfirmation = () => {
    setConfirmDialog({
      isOpen: false,
      bookingId: null,
      patientName: "",
    })
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading dashboard...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md shadow-sm border border-gray-200">
          <CardContent className="p-8 text-center">
            <svg
              className="w-12 h-12 text-red-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-red-600 font-medium">Access Denied</p>
            <p className="text-gray-500 text-sm mt-2">You must be signed in as a doctor to view this dashboard.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dentist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md shadow-sm border border-gray-200">
          <CardContent className="p-8 text-center">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-gray-600 font-medium">Profile Not Found</p>
            <p className="text-gray-500 text-sm mt-2">No doctor profile found for your account.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Profile Customization Card */}
        <Card className="shadow-sm border border-blue-200 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#0077B6]">Profile Customization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                <Avatar className="w-24 h-24 border-4 border-blue-200">
                  <AvatarImage src={profileImage || dentist.imageUrl || undefined} alt={dentist.name} />
                  <AvatarFallback className="bg-[#0077B6] text-white font-bold text-2xl">
                    {getInitials(dentist.name)}
                  </AvatarFallback>
                </Avatar>
                <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
                <span className="text-xs text-gray-500">Change profile image</span>
              </div>
              {/* Availability Editor */}
              <div className="flex-1 w-full">
                <h3 className="font-semibold text-gray-900 mb-2">Weekly Availability</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(availability).map((day) => (
                    <div key={day} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <Checkbox id={`day-${day}`} checked={availableDays[day]} onCheckedChange={() => handleDayToggle(day)} />
                        <Label htmlFor={`day-${day}`} className="capitalize font-medium text-gray-800">{day}</Label>
                        {!availableDays[day] && <span className="ml-2 text-xs text-red-500">Unavailable</span>}
                      </div>
                      {availableDays[day] && (
                        <div className="space-y-2">
                          {availability[day].map((slot: string, idx: number) => (
                            <div key={idx} className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                              <input
                                type="text"
                                value={slot}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSlotChange(day, idx, e.target.value)}
                                className="w-full xs:w-40 border rounded px-2 py-1"
                                placeholder="09:00-12:00"
                              />
                              <Button type="button" size="sm" variant="outline" onClick={() => handleRemoveSlot(day, idx)}>-</Button>
                            </div>
                          ))}
                          <Button type="button" size="sm" variant="secondary" onClick={() => handleAddSlot(day)}>+ Add Slot</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
                  <Button onClick={handleSaveProfile} disabled={savingProfile} className="bg-[#0077B6] text-white px-6 w-full sm:w-auto">
                    {savingProfile ? "Saving..." : "Save Profile"}
                  </Button>
                  {profileSaved && <span className="text-green-600 font-medium">Profile saved!</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Doctor Profile Header */}
        <Card className="shadow-sm border border-gray-200 mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Avatar className="w-20 h-20 border-4 border-gray-200">
                <AvatarImage src={dentist.imageUrl || undefined} alt={dentist.name} />
                <AvatarFallback className="bg-[#0077B6] text-white font-bold text-2xl">
                  {getInitials(dentist.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 text-center sm:text-left">{dentist.name}</h1>
                  <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200">
                    Doctor Dashboard
                  </Badge>
                </div>
                {dentist.specialty && <p className="text-lg text-[#0077B6] font-medium mb-2 text-center sm:text-left">{dentist.specialty}</p>}
                <p className="text-gray-600 mb-3 text-center sm:text-left">{dentist.email}</p>
                {dentist.bio && <p className="text-gray-700 text-sm leading-relaxed text-center sm:text-left">{dentist.bio}</p>}
                {dentist.qualifications && dentist.qualifications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    {dentist.qualifications.map((qualification, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-gray-300 text-gray-600">
                        {qualification}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Section */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
              <div className="w-full sm:w-auto">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0077B6] to-[#005f8e] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">My Appointments</CardTitle>
                </div>
                <p className="text-gray-600">Manage your scheduled patient appointments</p>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 px-4 py-2 mt-2 sm:mt-0">
                {bookings.length} {bookings.length === 1 ? "Appointment" : "Appointments"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading appointments...
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-red-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                  </svg>
                  <p className="text-gray-500 font-medium">No appointments scheduled</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Patient appointments will appear here when they book with you
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <div key={booking.id}>
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          <Avatar className="w-12 h-12 border-2 border-gray-200 mb-2 sm:mb-0">
                            <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                              {getInitials(booking.fullName)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.fullName}</h3>
                                <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {booking.email}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {booking.phone}
                                  </div>
                                </div>
                              </div>
                              <Badge
                                variant={booking.consent ? "secondary" : "destructive"}
                                className={
                                  booking.consent
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }
                              >
                                {booking.consent ? "Consented" : "No Consent"}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Service</p>
                                <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                                  {booking.service}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date & Time</p>
                                <div className="text-sm text-gray-900">
                                  <div>{formatDate(booking.preferredDate)}</div>
                                  <div className="text-xs text-gray-600">{formatTime(booking.preferredTime)}</div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</p>
                                <Badge
                                  variant="outline"
                                  className={
                                    booking.consultationType === "In-Clinic"
                                      ? "border-blue-300 text-blue-700 bg-blue-50"
                                      : "border-purple-300 text-purple-700 bg-purple-50"
                                  }
                                >
                                  {booking.consultationType}
                                </Badge>
                              </div>
                            </div>

                            {booking.message && (
                              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                  Patient Note
                                </p>
                                <p className="text-sm text-gray-700 leading-relaxed">{booking.message}</p>
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-gray-100 gap-2 sm:gap-0">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Booked on{" "}
                                {new Date(booking.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                {/* Mark as Treated Checkbox - Professional & Minimalistic */}
                                {booking.status !== "completed" && (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`mark-treated-${booking.id}`}
                                      disabled={loading}
                                      checked={false} // Always unchecked until confirmed
                                      onCheckedChange={(checked) =>
                                        handleCheckboxChange(checked === true, booking.id, booking.fullName)
                                      }
                                      className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                    />
                                    <Label
                                      htmlFor={`mark-treated-${booking.id}`}
                                      className="text-sm text-gray-700 cursor-pointer select-none"
                                    >
                                      Mark as treated
                                    </Label>
                                  </div>
                                )}

                                {/* Status Badge */}
                                <Badge
                                  variant={booking.status === "completed" ? "secondary" : "outline"}
                                  className={
                                    booking.status === "completed"
                                      ? "bg-green-100 text-green-700 border-green-300"
                                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  }
                                >
                                  {booking.status === "completed" ? "Completed" : "Pending"}
                                </Badge>

                                {/* Message Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 w-full sm:w-auto"
                                  onClick={async () => {
                                    // Create or get chat session
                                    const res = await fetch("/api/chat", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ doctorId: dentist?.id, patientEmail: booking.email }),
                                    })
                                    const chat = await res.json()
                                    // Navigate to chat page with chatId, doctorId, patientEmail
                                    window.location.href = `/chat?chatId=${chat.id}&doctorId=${dentist?.id}&patientEmail=${booking.email}`
                                  }}
                                >
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  Message
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {index < bookings.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Professional Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={handleCancelConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">Confirm Treatment Completion</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to mark the treatment for{" "}
              <span className="font-medium text-gray-900">{confirmDialog.patientName}</span> as completed?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800">Important Notice</p>
                <p className="text-sm text-amber-700 mt-1">
                  This action cannot be undone. The appointment status will be permanently changed to "Completed".
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleCancelConfirmation}
              disabled={loading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmTreatment}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
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
                  Processing...
                </div>
              ) : (
                "Confirm Treatment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
