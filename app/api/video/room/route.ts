import { NextResponse } from "next/server";

// You should store this securely, e.g. in an environment variable
const DAILY_API_KEY = process.env.DAILY_API_KEY;

export async function POST(request: Request) {
  if (!DAILY_API_KEY) {
    return NextResponse.json({ error: "Missing Daily.co API key" }, { status: 500 });
  }
  const { chatId } = await request.json();
  if (!chatId) {
    return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
  }
  // Create a unique room name per chat
  const roomName = `chat-${chatId}`;
  // Create the room via Daily.co REST API
  const resp = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      name: roomName,
      properties: {
        enable_chat: true,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiry
        eject_at_room_exp: true,
        start_video_off: false,
        start_audio_off: false,
      },
    }),
  });
  if (!resp.ok) {
    const error = await resp.text();
    return NextResponse.json({ error }, { status: 500 });
  }
  const data = await resp.json();
  return NextResponse.json({ url: data.url });
}
