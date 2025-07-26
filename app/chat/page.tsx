// Add custom property to window for debug
declare global {
  interface Window {
    __lastSocketMessage?: any;
  }
}
"use client";
import { useState, useEffect, Suspense } from "react";
import { fetchProfile } from "./fetchProfile";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import styled from "styled-components";
import RefreshButton from "@/components/ui/RefreshButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// --- ChatPage: WhatsApp-like UI, fullscreen, as per image ---
import ImageUpload from "./ImageUpload";
import { FiPhone, FiMoreVertical, FiArrowLeft, FiImage, FiVideo, FiList } from "react-icons/fi";
import { MdSend } from "react-icons/md";
// import NotificationBell from "./NotificationBell";
import Link from "next/link";
import { useRef } from "react";
import { io, Socket } from "socket.io-client";

function ChatPageContent() {
  // Clean, single declarations for all state and variables
  const [searchEmail, setSearchEmail] = useState("");
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : undefined;
  const { user, isLoaded } = useUser();
  // Video call modal state (single source of truth)
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoRoomUrl, setVideoRoomUrl] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  // ...existing code...
  // Doctor/patient detection using dentist DB (same as Navigation)
  const [userType, setUserType] = useState<"doctor" | "patient">("patient");
  const [userId, setUserId] = useState<string | number | undefined>(undefined);
  const [doctorId, setDoctorId] = useState<number | undefined>(undefined);
  useEffect(() => {
    async function detectUserType() {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      const email = user.primaryEmailAddress.emailAddress;
      try {
        const res = await fetch("/api/dentists");
        const dentists = await res.json();
        const match = dentists.find((d: any) => d.email === email);
        if (match) {
          setUserType("doctor");
          setUserId(match.id); // Use dentist id as userId
          setDoctorId(match.id);
        } else {
          setUserType("patient");
          setUserId(email);
          setDoctorId(undefined);
        }
      } catch {
        setUserType("patient");
        setUserId(email);
        setDoctorId(undefined);
      }
    }
    if (user) detectUserType();
  }, [user]);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  // Removed debug state for profile fetch
  const [showFirstMessageNotice, setShowFirstMessageNotice] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  // Notification logic removed
  // --- SOCKET.IO ---
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isLoaded || !userId) return;
    setPageLoading(true);
    fetchChatSessions().finally(() => setPageLoading(false));
  }, [isLoaded, userId]);
  useEffect(() => {
    async function ensureSelectedChat() {
      const searchPatientEmail = searchParams?.get("patientEmail");
      const searchChatId = searchParams?.get("chatId");
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
        // For doctors, create chat with selected patient
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
      } else if (searchPatientEmail && userType === "patient") {
        // For patients, need to select chat with doctor (from search param)
        // Try to find doctorId from chatSessions
        const found = chatSessions.find((c: any) => c.patientEmail === userId) as any;
        if (found) {
          // Always add doctorEmail to selectedChat for patient
          if (!found.doctorEmail && found.doctorId) {
            // Fetch doctor profile by doctorId to get email
            try {
              const res = await fetch(`/api/dentists?doctorId=${found.doctorId}`);
              if (res.ok) {
                const doc = await res.json();
                setSelectedChat({ ...(found as object), doctorEmail: doc.email });
                return;
              }
            } catch {}
          }
          setSelectedChat(found);
        }
      } else if (chatSessions && chatSessions.length > 0 && !selectedChat) {
        // Always add doctorEmail to selectedChat for patient
        const first = chatSessions[0] as any;
        if (userType === "patient" && !first.doctorEmail && first.doctorId) {
          try {
            const res = await fetch(`/api/dentists?doctorId=${first.doctorId}`);
            if (res.ok) {
              const doc = await res.json();
              setSelectedChat({ ...(first as object), doctorEmail: doc.email });
              return;
            }
          } catch {}
        }
        setSelectedChat(first);
      }
    }
    ensureSelectedChat();
  }, [chatSessions]);
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.chatId);
      let chatForProfile = { ...selectedChat };
      const urlPatientEmail = searchParams?.get("patientEmail");
      const urlDoctorEmail = searchParams?.get("doctorEmail");
      if (userType === "doctor" && !chatForProfile.patientEmail && urlPatientEmail) {
        chatForProfile.patientEmail = urlPatientEmail;
      }
      if (userType === "patient" && !chatForProfile.doctorEmail && urlDoctorEmail) {
        chatForProfile.doctorEmail = urlDoctorEmail;
      }
      if (userType === "doctor") {
        const patientEmail = chatForProfile.patientEmail || searchParams?.get("patientEmail");
        if (patientEmail) {
          fetchProfile({ userType: "doctor", chat: { patientEmail } })
            .then((profile) => {
              setProfile(profile);
              if (!profile || !profile.name) {
                console.error(`[ChatPage] Patient profile not found for email: ${patientEmail}`);
              }
            })
            .catch((err) => {
              setProfile(null);
              console.error(`[ChatPage] Error fetching patient profile for email: ${patientEmail}`, err);
            });
        } else {
          setProfile(null);
          console.error(`[ChatPage] No patientEmail found for chat.`);
        }
      } else if (userType === "patient") {
        // Only fetch profile if doctorEmail is present
        const doctorEmail = chatForProfile.doctorEmail || searchParams?.get("doctorEmail");
        if (doctorEmail) {
          fetchProfile({ userType: "patient", chat: { doctorEmail } })
            .then((profile) => {
              setProfile(profile);
              if (!profile || !profile.name) {
                console.error(`[ChatPage] Doctor profile not found for email: ${doctorEmail}`);
              }
            })
            .catch((err) => {
              setProfile(null);
              console.error(`[ChatPage] Error fetching doctor profile for email: ${doctorEmail}`, err);
            });
        } else if (chatForProfile.doctorId) {
          // Fetch doctor email by doctorId, then update selectedChat and retry
          (async () => {
            try {
              const res = await fetch(`/api/dentists?doctorId=${chatForProfile.doctorId}`);
              if (res.ok) {
                const doc = await res.json();
                setSelectedChat({ ...chatForProfile, doctorEmail: doc.email });
              }
            } catch {}
          })();
        } else {
          setProfile(null);
          console.error(`[ChatPage] No doctorEmail found for chat.`);
        }
      }
    }
  }, [selectedChat]);
  useEffect(() => {
    if (!selectedChat || !messages || messages.length === 0) return;
    const unread = messages.some((msg: any) => msg.sender !== userType && !msg.isRead);
    if (unread) markMessagesAsRead(selectedChat.chatId);
  }, [messages, selectedChat]);
  // Connect to Socket.IO and join chat room
  useEffect(() => {
    if (!selectedChat?.chatId) return;
    // Clean up previous connection
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    const socket = io("http://localhost:3002", {
      transports: ["websocket"],
      withCredentials: true,
    });
    socketRef.current = socket;
    socket.on("connect", () => {
      console.log(`[Socket.IO] Connected. Joining chatId: ${selectedChat.chatId}`);
      socket.emit("join", selectedChat.chatId);
    });
    socket.on("message", (data: any) => {
      if (data && data.message) {
        console.log("[Socket.IO] Received message event:", data.message);
        setMessages((prev: any[]) => {
          // Prevent duplicate messages (by id)
          if (prev.some((msg) => msg.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
        // If the message is a video_call_end, close the modal and force fetch latest messages
        if (data.message.type === "video_call_end") {
          setVideoModalOpen(false);
          // Force full page reload for all users
          window.location.reload();
        }
        // Mark as read if the message is from the other user
        if (data.message.sender !== userType) {
          markMessagesAsRead(selectedChat.chatId);
        }
        console.log(`[Socket.IO] Received message in chatId ${selectedChat.chatId}:`, data.message);
      }
    });
    // --- Listen for video-call event (patient side) ---
    socket.on("video-call", (data: any) => {
      if (userType === "patient" && data && data.url) {
        setVideoRoomUrl(data.url);
        setVideoModalOpen(true);
        setVideoLoading(false);
      }
    });
    socket.on("disconnect", (reason: any) => {
      console.log(`[Socket.IO] Disconnected from chatId: ${selectedChat.chatId}`, reason);
    });
    socket.on("connect_error", (err: any) => {
      console.error("[Socket.IO] Connection error:", err);
    });
    return () => {
      socket.disconnect();
      console.log(`[Socket.IO] Closed connection for chatId: ${selectedChat?.chatId}`);
    };
  }, [selectedChat?.chatId, userType]);
  async function fetchChatSessions() {
    if (!userId) {
      console.log('[fetchChatSessions] No userId, skipping fetch. userType:', userType, 'userId:', userId);
      return;
    }
    const url = `/api/chat/notifications?userType=${userType}&userId=${encodeURIComponent(String(userId))}`;
    console.log('[fetchChatSessions] Fetching:', url);
    const res = await fetch(url);
    const data = await res.json();
    console.log('[fetchChatSessions] Response:', data);
    setChatSessions(data);
    if (data.length > 0 && !selectedChat) setSelectedChat(data[0]);
  }
  async function fetchMessages(chatId: number) {
    const res = await fetch(`/api/chat?chatId=${chatId}`);
    const data = await res.json();
    setMessages(data);
  }
  // Removed fetchPatient and setPatient, now using fetchProfile and setProfile
  async function markMessagesAsRead(chatId: number) {
    await fetch(`/api/message`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, userType }),
    });
    fetchChatSessions();
  }
  async function sendMessage() {
    if (!selectedChat || !input.trim()) return;
    setLoading(true);
    // Optimistically add message to UI
    const optimisticMsg = {
      id: `optimistic-${Date.now()}`,
      chatId: selectedChat.chatId,
      sender: userType,
      content: input,
      createdAt: new Date().toISOString(),
      isRead: false,
      imageUrl: null,
      imagePublicId: null
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");
    try {
      // Save to backend
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: selectedChat.chatId, sender: userType, content: optimisticMsg.content }),
      });
      const savedMsg = await res.json();
      // Broadcast via Socket.IO
      if (socketRef.current && socketRef.current.connected) {
        // Always emit doctorId and patientEmail for robust delivery
        socketRef.current.emit("message", {
          chatId: selectedChat.chatId,
          message: savedMsg,
          doctorId: selectedChat.doctorId || (userType === "doctor" ? userId : undefined),
          patientEmail: selectedChat.patientEmail || (userType === "patient" ? userId : undefined)
        });
        console.log(`[Socket.IO] Sent message in chatId ${selectedChat.chatId}:`, savedMsg);
      }
      // Replace optimistic message with saved message
      setMessages((prev) => prev.map((msg) => msg.id === optimisticMsg.id ? savedMsg : msg));
    } catch (err) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMsg.id));
      console.error("[Chat] Error sending message:", err);
    }
    setLoading(false);
    if (messages.length === 0) {
      setShowFirstMessageNotice(true);
      setTimeout(() => setShowFirstMessageNotice(false), 4000);
    }
  }

  // --- WhatsApp-like UI ---
  if (pageLoading || !isLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#F8FAF8]">
        <span className="text-gray-700 text-lg font-semibold">Loading</span>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#F8FAF8] flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-white shadow-sm" style={{ minHeight: 70 }}>
        <button className="mr-2 text-gray-500 hover:text-black md:hidden" aria-label="Back" onClick={() => router.push('/chat/list')}>
          <FiArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden">
            {/* Avatar - robust image rendering */}
            {profile?.imageUrl && profile.imageUrl !== "" ? (
              // If imageUrl is a data URL or valid URL, render it
              <img
                src={profile.imageUrl}
                alt={profile.name || "Doctor"}
                className="w-full h-full object-cover"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-600 bg-gray-200">
                {profile?.name?.[0]?.toUpperCase() || "W"}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-semibold text-base text-gray-900 truncate">{profile?.name || "Wade Warren"}</span>
            <span className="text-xs text-green-500 font-medium">Online</span>
          </div>
        </div>
        {/* List page link button */}
        <Link href="/chat/list" className="mx-2 text-gray-500 hover:text-[#5EC16D] flex items-center justify-center" aria-label="Chat List">
          <FiList size={22} />
        </Link>
        {userType === "doctor" && (
          <button
            className="mx-2 text-gray-500 hover:text-black"
            aria-label="Video Call"
            onClick={async () => {
              if (!selectedChat?.chatId) return;
              // 1. Save a 'video_call_start' message
              const resMsg = await fetch("/api/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chatId: selectedChat.chatId,
                  sender: userType,
                  type: "video_call_start",
                  content: "Video call started"
                })
              });
              const savedMsg = await resMsg.json();
              // Broadcast via Socket.IO for real-time update
              if (socketRef.current && socketRef.current.connected) {
                let patientEmail: string | undefined = undefined;
                if (selectedChat.patientEmail) {
                  patientEmail = selectedChat.patientEmail;
                } else if ((userType as string) === "patient" && typeof userId === "string") {
                  patientEmail = userId;
                }
                socketRef.current.emit("message", {
                  chatId: selectedChat.chatId,
                  message: savedMsg,
                  doctorId: selectedChat.doctorId || (userType === "doctor" ? userId : undefined),
                  patientEmail
                });
              }
              setVideoModalOpen(true);
              setVideoLoading(true);
              // Call backend to create/get Daily.co room
              const res = await fetch("/api/video/room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatId: selectedChat.chatId }),
              });
              const data = await res.json();
              setVideoRoomUrl(data.url);
              setVideoLoading(false);
              // Optionally: emit socket event to notify patient
              if (socketRef.current && socketRef.current.connected) {
                socketRef.current.emit("video-call", { chatId: selectedChat.chatId, url: data.url });
              }
            }}
          >
            <FiVideo size={22} />
          </button>
        )}
        {/* Notification Bell removed */}
      </div>

      {/* Video Call Modal & Bouncy Icon Notification */}
      {/* Bouncy Video Icon for Patient when doctor is calling */}
      {userType === "patient" && videoModalOpen && (
        <div className="fixed top-8 right-8 z-[100] flex flex-col items-center animate-bounce-custom">
          <div className="bg-white rounded-full shadow-lg p-4 flex items-center justify-center border-2 border-[#5EC16D]">
            <FiVideo size={36} className="text-[#5EC16D]" />
          </div>
          <span className="mt-2 text-[#5EC16D] font-semibold text-sm">Doctor is calling...</span>
        </div>
      )}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl p-4 max-w-2xl w-full relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
              onClick={async () => {
                setVideoModalOpen(false);
                // 2. Save a 'video_call_end' message
                if (selectedChat?.chatId) {
                  const resMsg = await fetch("/api/message", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      chatId: selectedChat.chatId,
                      sender: userType,
                      type: "video_call_end",
                      content: "Video call ended"
                    })
                  });
                  const savedMsg = await resMsg.json();
                  // Broadcast via Socket.IO for real-time update
                  if (socketRef.current && socketRef.current.connected) {
                    socketRef.current.emit("message", {
                      chatId: selectedChat.chatId,
                      message: savedMsg,
                      doctorId: selectedChat.doctorId || (userType === "doctor" ? userId : undefined),
                      patientEmail: selectedChat.patientEmail || (userType === "patient" ? userId : undefined)
                    });
                  }
                }
              }}
              aria-label="Close Video Call"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-2 text-gray-900">Video Call</h2>
            {videoLoading ? (
              <div className="py-12 text-center text-gray-500">Starting video call...</div>
            ) : videoRoomUrl ? (
              <iframe
                src={videoRoomUrl}
                allow="camera; microphone; fullscreen; speaker; display-capture"
                style={{ width: "100%", height: "70vh", border: "none", borderRadius: 12 }}
                title="Video Call"
              />
            ) : (
              <div className="py-12 text-center text-gray-500">Unable to start video call.</div>
            )}
          </div>
        </div>
      )}

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-2 relative" style={{ background: '#F8FAF8' }}>
        {/* Date separator */}
        <div className="flex justify-center my-2">
          <span className="bg-white px-4 py-1 rounded-full text-xs text-gray-400 shadow border border-gray-100">Today</span>
        </div>
        {/* Messages */}
        {messages && messages.length > 0 ? (
          messages.map((msg: any, idx: number) => {
            if (msg.type === "video_call_start" || msg.type === "video_call_end") {
              return (
                <div key={msg.id || idx} className="flex justify-center w-full">
                  <div className="flex items-center gap-2 bg-[#e6f7ee] border border-[#5EC16D] rounded-xl px-4 py-2 my-2 shadow-sm">
                    <FiVideo className={msg.type === "video_call_end" ? "text-gray-400" : "text-[#5EC16D]"} size={20} />
                    <span className={`font-medium text-sm ${msg.type === "video_call_end" ? "text-gray-500" : "text-[#5EC16D]"}`}>
                      {msg.type === "video_call_start" ? "Video call started" : "Video call ended"}
                    </span>
                    <span className="text-[11px] text-gray-400 ml-2">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                  </div>
                </div>
              );
            }
            return (
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
            );
          })
        ) : (
          <div className="text-gray-300 text-center py-8">No messages yet.</div>
        )}
      </div>

      {/* Input Bar */}
      <form
        className="flex items-center px-2 sm:px-4 py-2 sm:py-3 bg-white border-t border-gray-100"
        style={{ minHeight: 56 }}
        onSubmit={e => { e.preventDefault(); sendMessage(); }}
      >
        <div className="flex items-center w-full">
          <div className="flex-shrink-0">
            <Avatar className="w-9 h-9 sm:w-11 sm:h-11 mr-2">
              <AvatarFallback>{profile?.name?.[0]?.toUpperCase() || "N"}</AvatarFallback>
            </Avatar>
          </div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 rounded-full px-3 sm:px-5 py-2 sm:py-3 text-[15px] sm:text-base bg-[#F8FAF8] border border-gray-200 focus:outline-none focus:border-green-400 placeholder-gray-400 transition-all"
            placeholder="Message..."
            disabled={userType === "doctor" && (!profile || !profile.name)}
            style={{ minWidth: 0 }}
            aria-label="Type your message"
          />
          {selectedChat && (
            <ImageUpload
              chatId={selectedChat.chatId}
              sender={userType}
              triggerButton={
                <button
                  type="button"
                  className="ml-2 bg-[#222] hover:bg-[#333] text-white rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shadow transition-all"
                  aria-label="Upload image"
                  disabled={userType === "doctor" && (!profile || !profile.name)}
                >
                  <FiImage size={18} className="sm:w-[22px] sm:h-[22px] w-[18px] h-[18px]" />
                </button>
              }
              onUpload={async (url: string) => {
                await fetchMessages(selectedChat.chatId);
              }}
            />
          )}
          <button
            type="submit"
            disabled={loading || !input || !selectedChat || (userType === "doctor" && (!profile || !profile.name))}
            className="ml-2 bg-[#5EC16D] hover:bg-[#4ea65a] text-white rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shadow transition-all disabled:opacity-60"
            aria-label="Send message"
          >
            <MdSend className="sm:w-[22px] sm:h-[22px] w-[20px] h-[20px]" color="#fff" />
          </button>
        </div>
      </form>
    </div>
  );
}

// Custom bounce animation for video call icon
const style = `
@keyframes bounce-custom {
  0%, 100% { transform: translateY(0); }
  20% { transform: translateY(-10px); }
  40% { transform: translateY(-18px); }
  60% { transform: translateY(-10px); }
  80% { transform: translateY(-4px); }
}
.animate-bounce-custom {
  animation: bounce-custom 1.1s infinite;
}
`;

export default function ChatPage() {
  return (
    <>
      <style>{style}</style>
      {/* DEBUG: Show last received Socket.IO message */}
      {typeof window !== 'undefined' && window.__lastSocketMessage && (
        <div style={{position:'fixed',bottom:0,right:0,background:'#222',color:'#fff',padding:8,zIndex:9999,fontSize:12}}>
          <b>Last Socket.IO msg:</b> {JSON.stringify(window.__lastSocketMessage)}
        </div>
      )}
      <Suspense fallback={
        <div className="w-full h-screen flex items-center justify-center bg-[#F8FAF8]">
          <span className="text-gray-700 text-lg font-semibold">Loading</span>
        </div>
      }>
        <ChatPageContent />
      </Suspense>
    </>
  );
}
