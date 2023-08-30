import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Chat } from './entities/chat.entity';
import { Param } from '@nestjs/common';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
@Controller('chat')
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('ChatGateway');

	constructor(private readonly chatService: ChatService) {}

	@SubscribeMessage('createMessage')
	async create(
		@MessageBody() createMessageDto: CreateMessageDto,
		@ConnectedSocket() client: Socket,
	) {
		const message = await this.chatService.createMessage(
			createMessageDto,
			'coucou',
		);
		this.server.emit('message', message);
		return message;
	}

	@SubscribeMessage('createRoom')
	createRoom(@Body() body :any): Promise<Chat> {
		return this.chatService.createChat(body);
	}

	@SubscribeMessage('findAllchat')
	findAll() {
		return this.chatService.findAllMessages();
	}

	@SubscribeMessage('findOneChat')
	findOneChat(id: number): Promise<string> {
		return this.chatService.findOneChat(id);
	}

	@SubscribeMessage('join')
	joinRoom(
		@MessageBody('name') name: string,
		@ConnectedSocket() client: Socket,
	) {
		return this.chatService.identifyUser(name, client.id);
	}

	@SubscribeMessage('typing')
	async typing(
		@MessageBody('isTyping') isTyping: boolean,
		@ConnectedSocket() client: Socket,
	) {
		const name = await this.chatService.getClientbyId(client.id);
		client.broadcast.emit('typing', { name, isTyping });
	}

	/* Controller Operations */

	@Get('getAllRooms')
	async getRooms(): Promise<any> {
		return this.chatService.findAllChat();
	}

	@Post('createRooms')
	async createRooms(@Body() body :any): Promise<number> {
		console.log('COFADSJADSAJKDHASDJAHD');
		// const user = this.userService.findOne({
		// 	where: {
		// 		id: 1
		// 	},
		// });
		console.log(body);
		// const chatId = this.chatService.createChat(body);
		return 1;
	}

	@Post('DeleteRooms')
	async deleteRooms(): Promise<void> {
		return this.chatService.removeChat(1);
	}
}
