"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex justify-center mt-8 px-4">
        <Card className="w-full max-w-5xl shadow-sm border border-gray-200">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 px-4 py-2">
                Bookings
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-blue-600">Loading bookings...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No bookings found.</div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <div>
                        <div className="font-semibold text-lg text-gray-900">{booking.fullName}</div>
                        <div className="text-sm text-gray-600">{booking.email} | {booking.phone}</div>
                        <div className="text-sm text-gray-600">Doctor: <span className="font-medium">{booking.doctor}</span></div>
                        <div className="text-sm text-gray-600">Service: {booking.service}</div>
                        <div className="text-sm text-gray-600">Consultation: {booking.consultationType}</div>
                        <div className="text-sm text-gray-600">Date: {booking.preferredDate} | Time: {booking.preferredTime}</div>
                        {booking.message && (
                          <div className="text-sm text-gray-500 mt-1">Note: {booking.message}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">Booked: {new Date(booking.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant={booking.consent ? "secondary" : "destructive"}>
                          {booking.consent ? "Consented" : "No Consent"}
                        </Badge>
                        {/* Future: Add delete/edit/view actions here */}
                      </div>
                    </div>
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
