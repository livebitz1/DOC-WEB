
"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import styled from "styled-components";
import RefreshButton from "@/components/ui/RefreshButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// --- ChatPage: WhatsApp-like UI, fullscreen, as per image ---
import ImageUpload from "./ImageUpload";
import { FiPhone, FiMoreVertical, FiArrowLeft, FiImage, FiVideo } from "react-icons/fi";

function ChatPageContent() {
  // ...existing state and logic...
  const [searchEmail, setSearchEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = 1;
  const userType = "doctor";
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [showFirstMessageNotice, setShowFirstMessageNotice] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setPageLoading(true);
    fetchChatSessions().finally(() => setPageLoading(false));
  }, []);
  useEffect(() => {
    async function ensureSelectedChat() {
      const searchPatientEmail = searchParams.get("patientEmail");
      const searchChatId = searchParams.get("chatId");
      let foundChat = null;
      if (chatSessions && chatSessions.length > 0) {
        if (searchChatId) {
          foundChat = chatSessions.find((c: any) => String(c.chatId) === searchChatId);
        } else if (searchPatientEmail) {
          foundChat = chatSessions.find((c: any) => c.patientEmail === searchPatientEmail);
        }
      }
      if (foundChat) {
        setSelectedChat(foundChat);
      } else if (searchPatientEmail && doctorId) {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doctorId, patientEmail: searchPatientEmail }),
        });
        const chat = await res.json();
        setSelectedChat({
          chatId: chat.id,
          doctorId: chat.doctorId,
          patientEmail: chat.patientEmail,
          unreadCount: 0,
          lastMessage: null,
        });
      } else if (chatSessions && chatSessions.length > 0 && !selectedChat) {
        setSelectedChat(chatSessions[0]);
      }
    }
    ensureSelectedChat();
  }, [chatSessions]);
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.chatId);
      fetchPatient(selectedChat.patientEmail);
    }
  }, [selectedChat]);
  useEffect(() => {
    if (!selectedChat || !messages || messages.length === 0) return;
    const unread = messages.some((msg: any) => msg.sender !== userType && !msg.isRead);
    if (unread) markMessagesAsRead(selectedChat.chatId);
  }, [messages, selectedChat]);
  async function fetchChatSessions() {
    const res = await fetch(`/api/chat/notifications?userType=${userType}&userId=${doctorId}`);
    const data = await res.json();
    setChatSessions(data);
    if (data.length > 0) setSelectedChat(data[0]);
  }
  async function fetchMessages(chatId: number) {
    const res = await fetch(`/api/chat?chatId=${chatId}`);
    const data = await res.json();
    setMessages(data);
  }
  async function fetchPatient(email: string) {
    const res = await fetch(`/api/patient?email=${email}`);
    if (res.ok) setPatient(await res.json());
  }
  async function markMessagesAsRead(chatId: number) {
    await fetch(`/api/message`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, userType }),
    });
    fetchChatSessions();
  }
  async function sendMessage() {
    if (!selectedChat) return;
    setLoading(true);
    await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: selectedChat.chatId, sender: userType, content: input }),
    });
    setInput("");
    await fetchMessages(selectedChat.chatId);
    setLoading(false);
    if (messages.length === 0) {
      setShowFirstMessageNotice(true);
      setTimeout(() => setShowFirstMessageNotice(false), 4000);
    }
  }

  // --- WhatsApp-like UI ---
  if (pageLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#F8FAF8]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-blue-700 font-semibold text-lg">Loading chat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#F8FAF8] flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-white shadow-sm" style={{ minHeight: 70 }}>
        <button className="mr-2 text-gray-500 hover:text-black md:hidden" aria-label="Back">
          <FiArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden">
            {/* Avatar */}
            {patient?.imageUrl ? (
              <img src={patient.imageUrl} alt={patient.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-600 bg-gray-200">
                {patient?.fullName?.[0]?.toUpperCase() || "W"}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-semibold text-base text-gray-900 truncate">{patient?.fullName || "Wade Warren"}</span>
            <span className="text-xs text-green-500 font-medium">Online</span>
          </div>
        </div>
        <button className="mx-2 text-gray-500 hover:text-black" aria-label="Call"><FiPhone size={22} /></button>
        <button className="mx-2 text-gray-500 hover:text-black" aria-label="Video Call"><FiVideo size={22} /></button>
        <button className="text-gray-500 hover:text-black" aria-label="More"><FiMoreVertical size={22} /></button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-2 relative" style={{ background: '#F8FAF8' }}>
        {/* Date separator */}
        <div className="flex justify-center my-2">
          <span className="bg-white px-4 py-1 rounded-full text-xs text-gray-400 shadow border border-gray-100">Today</span>
        </div>
        {/* Messages */}
        {messages && messages.length > 0 ? (
          messages.map((msg: any, idx: number) => (
            <div key={msg.id || idx} className={`flex ${msg.sender === userType ? "justify-end" : "justify-start"} w-full`}>
              <div className={`max-w-[75%] flex flex-col items-${msg.sender === userType ? "end" : "start"}`}>
                {msg.imageUrl ? (
                  <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                    <img src={msg.imageUrl} alt="chat-img" className="rounded-2xl border shadow max-w-[180px] max-h-[180px]" />
                  </a>
                ) : (
                  <div className={`rounded-2xl px-4 py-2 mb-1 ${msg.sender === userType ? "bg-[#5EC16D] text-white" : "bg-white text-gray-900 border border-gray-100"} shadow-sm text-[15px] whitespace-pre-line`}>
                    {msg.content}
                  </div>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[11px] text-gray-400">{msg.time || (msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "9:25 AM")}</span>
                  {msg.sender === userType && (
                    <span className="text-green-400 text-xs ml-1">✔✔</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-300 text-center py-8">No messages yet.</div>
        )}
      </div>

      {/* Input Bar */}
      <form className="flex items-center px-4 py-3 bg-white border-t border-gray-100" style={{ minHeight: 64 }} onSubmit={e => { e.preventDefault(); sendMessage(); }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 rounded-full px-5 py-3 text-[15px] bg-[#F8FAF8] border border-gray-200 focus:outline-none focus:border-green-400 placeholder-gray-400"
          placeholder="Message..."
        />

        {selectedChat && (
          <ImageUpload
            chatId={selectedChat.chatId}
            sender={userType}
            triggerButton={
              <button
                type="button"
                className="ml-2 bg-[#222] hover:bg-[#333] text-white rounded-full w-11 h-11 flex items-center justify-center shadow transition-all"
                aria-label="Upload image"
              >
                <FiImage size={22} />
              </button>
            }
            onUpload={async (url: string) => {
              await fetchMessages(selectedChat.chatId);
            }}
          />
        )}
        <button
          type="submit"
          disabled={loading || !input || !selectedChat}
          className="ml-2 bg-[#5EC16D] hover:bg-[#4ea65a] text-white rounded-full w-11 h-11 flex items-center justify-center shadow transition-all disabled:opacity-60"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-[#F8FAF8]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-blue-700 font-semibold text-lg">Loading chat...</span>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
