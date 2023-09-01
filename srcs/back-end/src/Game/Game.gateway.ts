import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './Game.service';
import { Interval } from '@nestjs/schedule';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:5173',
	},
	namespace: 'game',
})
export class GameGateway {
	constructor(private GameService: GameService) {}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('message')
	sendmsg(client: Socket) {
		console.log('reach');
		let any = this.GameService.findall();
		console.log(any);
		this.GameService.lunchloop(client);
	}

	handleConnection(client: Socket) {
		console.log('Connection');
		this.GameService.created(client);
		// Mettre User status en GAME
	}

	handleDisconnect(client: Socket) {
		console.log('Disconnection');
		// Gerer Deco non voulu
		// Fin de game
		this.GameService.remove(client);
		this.GameService.stoploop();
	}
}
