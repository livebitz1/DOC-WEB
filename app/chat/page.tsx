"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatId = searchParams.get("chatId")
  const doctorId = searchParams.get("doctorId")
  const patientEmail = searchParams.get("patientEmail")

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [patient, setPatient] = useState<any>(null)
  const [showFirstMessageNotice, setShowFirstMessageNotice] = useState(false)

  useEffect(() => {
    if (chatId) fetchMessages()
    if (patientEmail) fetchPatient()
  }, [chatId, patientEmail])

  async function fetchMessages() {
    const res = await fetch(`/api/chat?chatId=${chatId}`)
    const data = await res.json()
    setMessages(data)
  }

  async function fetchPatient() {
    const res = await fetch(`/api/patient?email=${patientEmail}`)
    if (res.ok) {
      setPatient(await res.json())
    }
  }

  async function sendMessage() {
    setLoading(true)
    await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, sender: "doctor", content: input }),
    })
    setInput("")
    await fetchMessages()
    setLoading(false)
    if (messages.length === 0) {
      setShowFirstMessageNotice(true)
      setTimeout(() => setShowFirstMessageNotice(false), 4000)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle>Chat with Patient</CardTitle>
            {patient && (
              <div className="flex items-center gap-4 mt-2 p-4 bg-white rounded-lg shadow border border-gray-100">
                <Avatar className="w-16 h-16 border-2 border-blue-200">
                  {patient.imageUrl ? (
                    <img src={patient.imageUrl} alt={patient.fullName} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-bold">
                      {patient.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col justify-center">
                  <div className="text-lg font-bold text-gray-900 mb-1">{patient.fullName}</div>
                  <div className="text-sm text-gray-600 mb-1">{patient.email}</div>
                  <div className="text-xs text-gray-500">Patient Profile</div>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs font-medium">Joined: {new Date(patient.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {showFirstMessageNotice && (
              <div className="mb-2 p-2 bg-blue-50 text-blue-700 rounded text-center text-sm">
                First message sent by Doctor! Patient will be notified.
              </div>
            )}
            <div className="mb-4 h-80 overflow-y-auto bg-gray-100 rounded p-4">
              {messages.map((msg: any) => (
                <div key={msg.id} className={`mb-2 flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}>
                  <span className={`px-3 py-2 rounded-lg text-sm ${msg.sender === "doctor" ? "bg-blue-200 text-blue-900" : "bg-gray-300 text-gray-800"}`}>
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                placeholder="Type your message..."
              />
              <Button onClick={sendMessage} disabled={loading || !input}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
