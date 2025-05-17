import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { createServer } from 'http';
import { Server } from 'socket.io';
import {
  registerUserSocket,
  removeUserSocket,
  setSocketServer,
} from './socket.io'; // we'll create this file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Create HTTP server and bind Nest app to it
  const expressApp = app.getHttpAdapter().getInstance();
  const httpServer = createServer(expressApp);

  // Create Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  // Store socket instance globally
  setSocketServer(io);

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId; // or use query param
    if (!userId) {
      socket.disconnect();
      return;
    }

    registerUserSocket(userId, socket);
    console.log(`User ${userId} connected with socket ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
      removeUserSocket(userId);
    });
  });

  await app.init();
  httpServer.listen(3000, () => {
    console.log(`Application is running on: http://localhost:3000`);
  });
}
bootstrap();
