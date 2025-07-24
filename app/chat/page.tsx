"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import styled from "styled-components"


// Import the working RefreshButton from the correct location
import RefreshButton from "@/components/ui/RefreshButton"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import ImageUpload from "./ImageUpload"

export default function ChatPage() {
  const [searchEmail, setSearchEmail] = useState("");
  // Polling for notifications (sidebar updates)
  // Remove polling: only fetch chat sessions on initial load or refresh
  const router = useRouter()
  const searchParams = useSearchParams()
  // For demo, assume doctor is logged in and doctorId is available
  const doctorId = 1 // Replace with actual doctorId from auth context
  const userType = "doctor" // or "patient" based on logged-in user

  const [chatSessions, setChatSessions] = useState([])
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [patient, setPatient] = useState<any>(null)
  const [showFirstMessageNotice, setShowFirstMessageNotice] = useState(false)

  useEffect(() => {
    fetchChatSessions()
  }, [])

  useEffect(() => {
    // If patientEmail or chatId is present in searchParams, auto-select that chat
    async function ensureSelectedChat() {
      const searchPatientEmail = searchParams.get("patientEmail")
      const searchChatId = searchParams.get("chatId")
      let foundChat = null
      if (chatSessions && chatSessions.length > 0) {
        if (searchChatId) {
          foundChat = chatSessions.find((c: any) => String(c.chatId) === searchChatId)
        } else if (searchPatientEmail) {
          foundChat = chatSessions.find((c: any) => c.patientEmail === searchPatientEmail)
        }
      }
      if (foundChat) {
        setSelectedChat(foundChat)
      } else if (searchPatientEmail && doctorId) {
        // If not found, create or fetch chat session directly
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doctorId, patientEmail: searchPatientEmail }),
        })
        const chat = await res.json()
        setSelectedChat({
          chatId: chat.id,
          doctorId: chat.doctorId,
          patientEmail: chat.patientEmail,
          unreadCount: 0,
          lastMessage: null,
        })
      } else if (chatSessions && chatSessions.length > 0 && !selectedChat) {
        setSelectedChat(chatSessions[0])
      }
    }
    ensureSelectedChat()
  }, [chatSessions])

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.chatId)
      fetchPatient(selectedChat.patientEmail)
    }
  }, [selectedChat])

  // Only mark as read if there are unread messages for this user
  useEffect(() => {
    if (!selectedChat || !messages || messages.length === 0) return;
    // Find unread messages for this user
    const unread = messages.some(
      (msg: any) => msg.sender !== userType && !msg.isRead
    );
    if (unread) {
      markMessagesAsRead(selectedChat.chatId);
    }
  }, [messages, selectedChat]);

  async function fetchChatSessions() {
    const res = await fetch(`/api/chat/notifications?userType=${userType}&userId=${doctorId}`)
    const data = await res.json()
    setChatSessions(data)
    if (data.length > 0) setSelectedChat(data[0])
  }

  async function fetchMessages(chatId: number) {
    const res = await fetch(`/api/chat?chatId=${chatId}`)
    const data = await res.json()
    setMessages(data)
  }

  async function fetchPatient(email: string) {
    const res = await fetch(`/api/patient?email=${email}`)
    if (res.ok) {
      setPatient(await res.json())
    }
  }

  async function markMessagesAsRead(chatId: number) {
    await fetch(`/api/message`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, userType }),
    })
    // Optionally refresh chat sessions to update unread counts
    fetchChatSessions()
  }

  async function sendMessage() {
    if (!selectedChat) return;
    setLoading(true)
    await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: selectedChat.chatId, sender: userType, content: input }),
    })
    setInput("")
    await fetchMessages(selectedChat.chatId)
    setLoading(false)
    if (messages.length === 0) {
      setShowFirstMessageNotice(true)
      setTimeout(() => setShowFirstMessageNotice(false), 4000)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col md:flex-row max-w-5xl mx-auto px-2 md:px-6 py-4 md:py-10 gap-4 md:gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-blue-100 p-2 md:p-6 flex flex-col min-h-[220px] max-h-[90vh] md:max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2 md:mb-6 w-full">
            <span className="font-extrabold text-xl tracking-tight text-blue-900 flex items-center gap-2"><svg className='w-6 h-6 text-blue-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'></path></svg>Chats</span>
            <div className="flex justify-end md:justify-start">
              <RefreshButton onClick={fetchChatSessions} />
            </div>
          </div>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={e => setSearchEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-blue-200 focus:outline-none focus:border-blue-400 text-sm shadow"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1 md:pr-0">
            {chatSessions && chatSessions.length > 0 ? (
              chatSessions
                .filter((chat: any) =>
                  !searchEmail || chat.patientEmail.toLowerCase().includes(searchEmail.toLowerCase())
                )
                .map((chat: any) => (
                  <div
                    key={chat.chatId}
                    className={`flex items-center gap-2 md:gap-3 p-2 rounded-xl cursor-pointer transition-all duration-150 hover:bg-blue-100/60 ${selectedChat?.chatId === chat.chatId ? "bg-blue-200/70 border border-blue-400" : ""}`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <Avatar className="w-9 h-9 md:w-12 md:h-12 border shadow">
                      {/* Optionally fetch and show patient avatar here */}
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">{chat.patientEmail[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-blue-900 truncate text-xs md:text-base">{chat.patientEmail}</div>
                      {chat.lastMessage && (
                        <div className="text-xs text-blue-500 truncate italic">{chat.lastMessage.content}</div>
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-bold shadow">{chat.unreadCount}</span>
                    )}
                  </div>
                ))
            ) : (
              <div className="text-blue-400 text-sm p-4">No chat sessions found.</div>
            )}
          </div>
        </aside>
        {/* Main Chat Area */}
        <div className="flex-1 w-full">
          <Card className="shadow-xl border border-blue-100 rounded-2xl bg-white/95">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-lg md:text-2xl font-extrabold text-blue-900 flex items-center gap-2"><svg className='w-7 h-7 text-blue-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2h2'></path><path strokeLinecap='round' strokeLinejoin='round' d='M15 3h-6a2 2 0 00-2 2v2a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2z'></path></svg>Chat with Patient</CardTitle>
              {patient ? (
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 mt-2 p-2 md:p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl shadow border border-blue-100">
                  <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-blue-300 shadow">
                    {patient.imageUrl ? (
                      <img src={patient.imageUrl} alt={patient.fullName} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xl md:text-2xl font-bold">
                        {patient.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
                    <div className="text-lg md:text-2xl font-extrabold text-blue-900 mb-1">{patient.fullName}</div>
                    <div className="text-xs md:text-base text-blue-700 mb-1">{patient.email}</div>
                    <div className="text-xs text-blue-400">Patient Profile</div>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium shadow">Joined: {new Date(patient.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-blue-400 text-sm p-4">No patient selected or found.</div>
              )}
            </CardHeader>
            <CardContent>
              {showFirstMessageNotice && (
                <div className="mb-2 p-2 bg-blue-100/80 text-blue-700 rounded-xl text-center text-sm font-semibold shadow">
                  First message sent by Doctor! Patient will be notified.
                </div>
              )}
              <div className="mb-4 h-64 md:h-96 overflow-y-auto bg-gradient-to-br from-blue-50 to-white rounded-xl p-2 md:p-6 custom-scrollbar">
                {messages && messages.length > 0 ? (
                  messages.map((msg: any) => (
                    <div key={msg.id} className={`mb-2 flex ${msg.sender === userType ? "justify-end" : "justify-start"}`}>
                      {msg.imageUrl ? (
                        <div className="relative group">
                          <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                            <img src={msg.imageUrl} alt="chat-img" className="max-w-[180px] max-h-[180px] rounded-xl border shadow" />
                          </a>
                          {msg.sender === userType && (
                            <button
                              className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 hover:text-white text-red-500 rounded-full p-1 text-xs shadow transition-opacity opacity-0 group-hover:opacity-100"
                              title="Delete image"
                              onClick={async () => {
                                if (confirm("Delete this image message?")) {
                                  await fetch("/api/message", {
                                    method: "DELETE",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ messageId: msg.id }),
                                  });
                                  await fetchMessages(selectedChat.chatId);
                                }
                              }}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className={`px-3 py-2 rounded-2xl shadow text-sm md:text-base ${msg.sender === userType ? "bg-blue-200 text-blue-900" : "bg-blue-100 text-blue-800"}`}>
                          {msg.content}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-blue-300 text-center py-8">No messages yet.</div>
                )}
              </div>
              <form className="flex gap-2 mt-2" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="flex-1 border-2 border-blue-200 rounded-xl px-3 py-2 text-sm md:text-base focus:outline-none focus:border-blue-400 shadow"
                  placeholder="Type your message..."
                />
                <Button onClick={sendMessage} disabled={loading || !input || !selectedChat} className="text-sm md:text-base px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow transition-all">
                  Send
                </Button>
                {selectedChat && (
                  <ImageUpload
                    chatId={selectedChat.chatId}
                    sender={userType}
                    onUpload={async (url: string) => {
                      // Only create the message via the image-upload API, which already returns the message
                      // After upload, just fetch messages ONCE
                      await fetchMessages(selectedChat.chatId);
                    }}
                  />
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7e0fa;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </main>
  )
}
