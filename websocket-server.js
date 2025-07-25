const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3002 });

// Map of chatId to set of sockets
const chatRooms = new Map();

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      if (data.type === 'join' && data.chatId) {
        if (!chatRooms.has(data.chatId)) chatRooms.set(data.chatId, new Set());
        chatRooms.get(data.chatId).add(ws);
        ws.chatId = data.chatId;
      }
      if (data.type === 'message' && data.chatId && data.message) {
        // Broadcast to all in the room
        if (chatRooms.has(data.chatId)) {
          for (const client of chatRooms.get(data.chatId)) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'message', message: data.message }));
            }
          }
        }
      }
    } catch (e) { console.error(e); }
  });
  ws.on('close', function() {
    if (ws.chatId && chatRooms.has(ws.chatId)) {
      chatRooms.get(ws.chatId).delete(ws);
      if (chatRooms.get(ws.chatId).size === 0) chatRooms.delete(ws.chatId);
    }
  });
});

console.log('WebSocket server running on ws://localhost:3002');
