"use client"

import { useEffect, useState } from "react"
import AdminNavbar from "../../../components/admin/AdminNavbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

type Dentist = {
  id: number
  name: string
  email: string
  specialty?: string
  imageUrl?: string
  bio?: string
  qualifications?: string[]
  createdAt: string
}

export default function DentistListPage() {
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const [deletingId, setDeletingId] = useState<number | null>(null)
  const handleDelete = async (id: number) => {
    setDeletingId(id)
    await fetch(`/api/dentists/${id}`, { method: "DELETE" })
    setDeletingId(null)
    fetchDentists()
  }

  useEffect(() => {
    fetchDentists()
  }, [])

  const fetchDentists = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/dentists")
      if (!res.ok) throw new Error("Failed to fetch dentists")
      const data = await res.json()
      setDentists(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message || "Unknown error")
    }
    setLoading(false)
  }

  const filteredDentists = dentists.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase()),
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-4xl mx-auto mt-8 px-4">
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">All Dentists</CardTitle>
                <p className="text-gray-600 mt-1">Manage your team</p>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200">
                {dentists.length} {dentists.length === 1 ? "Dentist" : "Dentists"}
              </Badge>
            </div>

            <div className="mt-6">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="pl-10 border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6]"
                />
              </div>
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
                  Loading dentists...
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
                    onClick={fetchDentists}
                    variant="outline"
                    className="mt-4 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : filteredDentists.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-gray-500 font-medium">
                    {search ? "No dentists found matching your search" : "No dentists found"}
                  </p>
                  {search && (
                    <Button
                      onClick={() => setSearch("")}
                      variant="outline"
                      className="mt-4 border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDentists.map((dentist, index) => (
                  <div key={dentist.id}>
                    <Card className="border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16 border-2 border-gray-200">
                            <AvatarImage src={dentist.imageUrl || undefined} alt={dentist.name} />
                            <AvatarFallback className="bg-[#0077B6] text-white font-semibold text-lg">
                              {getInitials(dentist.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{dentist.name}</h3>
                                {dentist.specialty && (
                                  <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 mb-2">
                                    {dentist.specialty}
                                  </Badge>
                                )}
                                <p className="text-sm text-gray-600 mb-2">{dentist.email}</p>
                                {dentist.bio && (
                                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{dentist.bio}</p>
                                )}
                                {dentist.qualifications && dentist.qualifications.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {dentist.qualifications.map((qualification: string, i: number) => (
                                      <Badge
                                        key={i}
                                        variant="outline"
                                        className="text-xs border-gray-300 text-gray-600"
                                      >
                                        {qualification}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <Button
                                onClick={() => handleDelete(dentist.id)}
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 min-w-[80px] flex items-center justify-center"
                                disabled={deletingId === dentist.id}
                              >
                                {deletingId === dentist.id ? (
                                  <svg className="animate-spin w-4 h-4 mr-1 text-red-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                                {deletingId === dentist.id ? "Deleting..." : "Delete"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {index < filteredDentists.length - 1 && <Separator className="my-4" />}
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
