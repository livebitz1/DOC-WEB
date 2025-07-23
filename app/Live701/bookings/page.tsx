"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Booking type matches Prisma schema
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
  createdAt: string
  status: "pending" | "completed"
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/bookings")
      if (!res.ok) throw new Error("Failed to fetch bookings")
      const data = await res.json()
      setBookings(data)
    } catch (err: any) {
      setError(err.message || "Unknown error")
    }
    setLoading(false)
  }

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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
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
                  <CardTitle className="text-2xl font-bold text-gray-900">All Bookings</CardTitle>
                </div>
                <p className="text-gray-600">Manage and view all appointment bookings</p>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 px-4 py-2">
                {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
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
                  Loading bookings...
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
                  <Button
                    onClick={fetchBookings}
                    variant="outline"
                    className="mt-4 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    Try Again
                  </Button>
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
                  <p className="text-gray-500 font-medium">No bookings found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Bookings will appear here when patients make appointments
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <div key={booking.id}>
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12 border-2 border-gray-200">
                            <AvatarFallback className="bg-[#0077B6] text-white font-semibold">
                              {getInitials(booking.fullName)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.fullName}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
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
                              <div className="flex flex-col items-end gap-2">
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
                                <Badge
                                  variant={booking.status === "completed" ? "secondary" : "outline"}
                                  className={
                                    booking.status === "completed"
                                      ? "bg-green-100 text-green-700 border-green-300 flex items-center gap-1"
                                      : "bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
                                  }
                                >
                                  {booking.status === "completed" ? (
                                    <span className="inline-flex items-center">
                                      <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center">
                                      <svg className="w-4 h-4 mr-1 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                                      Pending
                                    </span>
                                  )}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Doctor</p>
                                <p className="text-sm font-medium text-gray-900">{booking.doctor}</p>
                              </div>
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

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-300 text-gray-600 bg-transparent"
                                >
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-300 text-gray-600 bg-transparent"
                                >
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
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
    </main>
  )
}
