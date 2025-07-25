"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { FiEdit2, FiSearch } from "react-icons/fi";
import Image from "next/image";

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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
      .then(data => setChats(data))
      .finally(() => setLoading(false));
  }, [isLoaded, userId, userType]);

  const filtered = chats.filter((c: any) => {
    const name = userType === "doctor" ? c.patientEmail : c.doctorId;
    return name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg mt-6 overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 className="text-xl font-bold text-gray-900">Chats</h2>
          <button className="text-gray-400 hover:text-black p-2 rounded-full">
            <FiEdit2 size={20} />
          </button>
        </div>
        <div className="px-5 pb-2">
          <div className="relative">
            <input
              className="w-full rounded-lg bg-[#F8FAF8] py-2 pl-10 pr-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5EC16D]"
              placeholder="Search here..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No chats found.</div>
          ) : (
            filtered.map((chat, idx) => {
              const lastMsg = chat.lastMessage;
              const isUnread = chat.unreadCount > 0 && lastMsg?.sender !== userType;
              const displayName = userType === "doctor" ? chat.patientEmail : `Dr. ${chat.doctorId}`;
              const avatarUrl = lastMsg?.sender === "doctor" ? "/globe.svg" : "/file.svg";
              return (
                <button
                  key={chat.chatId}
                  className="w-full flex items-center px-5 py-4 bg-white hover:bg-[#F8FAF8] transition group relative"
                  onClick={() => router.push(`/chat?chatId=${chat.chatId}`)}
                >
                  <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {/* Avatar: replace with real user image if available */}
                    <Image src={avatarUrl} alt="avatar" width={44} height={44} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0 ml-4 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 truncate text-base">{displayName}</span>
                      <span className="text-xs text-gray-400 ml-2">{lastMsg ? formatTime(lastMsg.createdAt || lastMsg.time) : ""}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`truncate text-sm ${isUnread ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                        {lastMsg?.content ? lastMsg.content.slice(0, 32) : "No messages yet."}
                        {lastMsg?.isTyping && <span className="text-green-500 ml-1">Typing...</span>}
                      </span>
                      {isUnread && (
                        <span className="ml-2 bg-[#5EC16D] text-white text-xs font-bold rounded-full px-2 py-0.5">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
