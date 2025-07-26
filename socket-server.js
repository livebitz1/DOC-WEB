const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Map of chatId to Set of socket ids
const chatRooms = new Map();

io.on('connection', (socket) => {
  console.log('[Socket.io] Client connected:', socket.id);

  socket.on('join', (chatId) => {
    socket.join(String(chatId));
    if (!chatRooms.has(chatId)) chatRooms.set(chatId, new Set());
    chatRooms.get(chatId).add(socket.id);
    socket.chatId = chatId;
    console.log(`[Socket.io] Socket ${socket.id} joined chat ${chatId}`);
  });

  socket.on('message', ({ chatId, message, doctorId, patientEmail }) => {
    if (!chatId || !message) return;
    // Broadcast to all in the room
    io.to(String(chatId)).emit('message', { chatId, message });
    // Also emit chatListUpdate to both doctor and patient
    if (doctorId) {
      io.to(`doctor_${doctorId}`).emit('chatListUpdate', { chatId });
    }
    if (patientEmail) {
      io.to(`patient_${patientEmail}`).emit('chatListUpdate', { chatId });
    }
    console.log(`[Socket.io] Message in chat ${chatId}:`, message);
  });
  // Video call event: broadcast to all in the chat room (except sender)
  socket.on('video-call', ({ chatId, url }) => {
    if (!chatId || !url) return;
    // Broadcast to all in the room except sender
    socket.to(String(chatId)).emit('video-call', { chatId, url });
    console.log(`[Socket.io] Video call initiated in chat ${chatId}:`, url);
  });
  // Allow users to join their own chatList room for real-time updates
  socket.on('joinChatList', ({ userType, userId }) => {
    if (userType && userId) {
      socket.join(`${userType}_${userId}`);
      console.log(`[Socket.io] Socket ${socket.id} joined chatList room ${userType}_${userId}`);
    }
  });

  socket.on('disconnect', () => {
    if (socket.chatId && chatRooms.has(socket.chatId)) {
      chatRooms.get(socket.chatId).delete(socket.id);
      if (chatRooms.get(socket.chatId).size === 0) chatRooms.delete(socket.chatId);
    }
    console.log('[Socket.io] Client disconnected:', socket.id);
  });
});

server.listen(3002, () => {
  console.log('Socket.io server running on ws://localhost:3002');
});
