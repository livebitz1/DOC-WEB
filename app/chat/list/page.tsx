"use client";
import { useEffect, useState } from "react";
import { fetchProfile } from "../fetchProfile";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigation } from "@/components/home/Navigation";

const green = "#5EC16D"; // Your site accent
const bg = "#F8FAF8"; // Your site background

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ChatListPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<{ [chatId: string]: { name: string; imageUrl: string } }>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine userType and userId
  let userType = "patient";
  let userId: string | number | undefined = undefined;
  if (user) {
    if (user.publicMetadata?.role === "doctor" && user.publicMetadata?.doctorId) {
      userType = "doctor";
      userId = Number(user.publicMetadata.doctorId);
    } else if (user.primaryEmailAddress?.emailAddress) {
      userType = "patient";
      userId = user.primaryEmailAddress.emailAddress;
    }
  }

  useEffect(() => {
    if (!isLoaded || !userId) return;
    setLoading(true);
    fetch(`/api/chat/notifications?userType=${userType}&userId=${encodeURIComponent(String(userId))}`)
      .then(res => res.json())
      .then(async data => {
        setChats(data);
        // Fetch profile for each chat
        const entries = await Promise.all(
          data.map(async (chat: any) => {
            // Always fetch the profile of the person you are talking to, not yourself
            if (userType === "doctor") {
              // For doctor, always use patientEmail
              const patientEmail = chat.patientEmail;
              const profile = patientEmail ? await fetchProfile({ userType: "doctor", chat: { patientEmail } }) : { name: "Unknown", imageUrl: "/globe.svg" };
              return [chat.chatId, profile];
            } else {
              // For patient, always use doctorId
              const doctorId = chat.doctorId;
              const profile = doctorId ? await fetchProfile({ userType: "patient", chat: { doctorId } }) : { name: "Unknown", imageUrl: "/globe.svg" };
              return [chat.chatId, profile];
            }
          })
        );
        setProfiles(Object.fromEntries(entries));
      })
      .finally(() => setLoading(false));
  }, [isLoaded, userId, userType]);

  const filtered = chats.filter((c: any) => {
    // Prefer fullName/email for patient, and doctorName for doctor if available
    let name = "";
    if (userType === "doctor") {
      name = c.patientFullName || c.patientEmail || "";
    } else {
      name = c.doctorName || (c.doctorId ? `Dr. ${c.doctorId}` : "");
    }
    return name.toString().toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen w-full h-screen flex flex-col bg-gradient-to-br from-[#F8FAF8] via-[#f3f7f3] to-[#eaf6ea]">
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="w-full h-full flex flex-col bg-white shadow-2xl rounded-none md:rounded-2xl overflow-hidden">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur flex flex-col gap-2 px-10 pt-8 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Chats</h2>
          </div>
          <div className="relative mt-2">
            <input
              className="w-full rounded-xl bg-[#F8FAF8] py-3 pl-12 pr-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5EC16D] text-base shadow-sm"
              placeholder="Search here..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
        </div>
        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-16 text-gray-400 text-lg">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-lg">No chats found.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filtered.map((chat, idx) => {
                const lastMsg = chat.lastMessage;
                const isUnread = chat.unreadCount > 0 && lastMsg?.sender !== userType;
                const profile = profiles[chat.chatId] || { name: "Unknown", imageUrl: "/globe.svg" };
                return (
                  <li key={chat.chatId}>
                    <button
                      className={`w-full flex items-center px-10 py-7 bg-white transition group relative hover:bg-[#F8FAF8] focus:bg-[#F0F8F0] focus:outline-none`}
                      onClick={() => router.push(`/chat?chatId=${chat.chatId}`)}
                    >
                      <Avatar className="w-16 h-16 mr-7 shadow border border-gray-200">
                        <AvatarImage src={profile.imageUrl} alt={profile.name} />
                        <AvatarFallback>{(profile.name && profile.name[0]?.toUpperCase()) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 truncate text-lg leading-tight">{profile.name}</span>
                          <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{lastMsg ? formatTime(lastMsg.createdAt || lastMsg.time) : ""}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`truncate text-base ${isUnread ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                            {lastMsg?.content ? lastMsg.content.slice(0, 40) : "No messages yet."}
                            {lastMsg?.isTyping && <span className="text-green-500 ml-1">Typing...</span>}
                          </span>
                          {isUnread && (
                            <span className="ml-2 bg-[#5EC16D] text-white text-xs font-bold rounded-full px-2.5 py-0.5 shadow animate-pulse">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
