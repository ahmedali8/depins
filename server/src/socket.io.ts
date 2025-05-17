import { Server, Socket } from 'socket.io';

let io: Server;
const userSocketMap = new Map<string, string>(); // userId -> socket.id

export function setSocketServer(server: Server) {
  io = server;
}

export function getSocketServer(): Server {
  if (!io) throw new Error('Socket.IO server not initialized');
  return io;
}

export function registerUserSocket(userId: string, socket: Socket) {
  userSocketMap.set(userId, socket.id);
}

export function removeUserSocket(userId: string) {
  userSocketMap.delete(userId);
}

export function getSocketIdByUser(userId: string): string | undefined {
  return userSocketMap.get(userId);
}

export function getAllUsers() {
  return userSocketMap;
}

export function emitToUser(userId: string, event: string, data: any) {
  const socketId = userSocketMap.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
}
