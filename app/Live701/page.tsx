"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

export default function AdminPage() {
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialty: "",
    imageUrl: "",
    bio: "",
    qualifications: "",
  })
  const [loading, setLoading] = useState(false)

  // Fetch dentists
  useEffect(() => {
    fetchDentists()
  }, [])

  const fetchDentists = async () => {
    const res = await fetch("/api/dentists")
    const data = await res.json()
    setDentists(data)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Parse qualifications into array
    const qualificationsArr = form.qualifications
      .split(",")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)

    await fetch("/api/dentists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        qualifications: qualificationsArr,
      }),
    })

    setForm({ name: "", email: "", specialty: "", imageUrl: "", bio: "", qualifications: "" })
    setLoading(false)
    fetchDentists()
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/dentists/${id}`, { method: "DELETE" })
    fetchDentists()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      {require("../../components/admin/AdminNavbar").default()}

      <div className="flex justify-center mt-8 px-4">
        <Card className="w-full max-w-2xl shadow-sm border border-gray-200">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="bg-blue-50 text-[#0077B6] border-blue-200 px-4 py-2">
                Admin Panel
              </Badge>
            </div>
            
            <CardTitle className="text-2xl font-bold text-gray-900">Create Profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Dr. Jane Doe"
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
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    required
                    className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="specialty" className="text-gray-700 font-medium">
                    Specialty
                  </Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={form.specialty}
                    onChange={handleChange}
                    placeholder="Orthodontist"
                    className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-gray-700 font-medium">
                    Profile Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-700 font-medium">
                  Biography
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Write a brief biography about the dentist..."
                  rows={4}
                  className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications" className="text-gray-700 font-medium">
                  Qualifications
                </Label>
                <Input
                  id="qualifications"
                  name="qualifications"
                  value={form.qualifications}
                  onChange={handleChange}
                  placeholder="DDS, MS, PhD"
                  className="border-gray-300 focus:border-[#0077B6] focus:ring-[#0077B6]"
                />
                <p className="text-sm text-gray-500 mt-1">Separate multiple qualifications with commas</p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
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
                      Adding Profile...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Add Dentist Profile
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
