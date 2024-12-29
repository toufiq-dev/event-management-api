import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust the origin as per your requirements
  },
})
export class LiveUpdateService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);

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
}
