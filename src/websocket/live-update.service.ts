import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class LiveUpdateService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(LiveUpdateService.name);

  constructor() {
    this.logger.log('WebSocket Gateway initialized');
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  notifyNewEvent(eventDetails: any) {
    this.logger.log(`Notifying clients about new event: ${eventDetails.name}`);
    this.server.emit('newEvent', eventDetails);
  }

  notifySpotsFillingUp(eventDetails: any) {
    this.logger.log(
      `Notifying clients about limited spots for event: ${eventDetails.name}`,
    );
    this.server.emit('spotsFillingUp', eventDetails);
  }

  testBroadcast(message: string) {
    this.server.emit('testEvent', {
      name: 'Test Event',
      message: message,
      timestamp: new Date(),
    });
  }
}
