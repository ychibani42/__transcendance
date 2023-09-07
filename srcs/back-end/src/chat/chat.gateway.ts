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
		@MessageBody() createMessageDto: CreateMessageDto,data : number,@ConnectedSocket() client: Socket) {
		const message = await this.chatService.createMessage(
			createMessageDto,
		);
		if (message == null)
			return null
		this.server.to(message.channel.channelName).emit('message', message);
		return message;
	}

	@SubscribeMessage('createRoom')
	createRoom(@Body() body :any): Promise<Chat> {
		return this.chatService.createChat(body);
	}

	@SubscribeMessage('findAllChats')
	findAll() {
		return this.chatService.findAllChats();
	}

	@SubscribeMessage('findAllMessages')
	findAllMessages(@Body() chanid: number) {
		return this.chatService.findAllMessages(chanid);
	}

	@SubscribeMessage('joinRoom')
	async join(client: Socket, chan: any) 
	{
		this.server.to(chan.channelName).emit('join', chan.user);
		client.join(chan.channelName)
	}

	@SubscribeMessage('pushUserChan')
	async pushUserChan(client: Socket, user: any) 
	{
		return this.chatService.pushUserChan(user)
	}


	@SubscribeMessage('leaveRoom')
	leave(client: Socket, channelName: string) 
	{
		client.leave(channelName)
	}

	// @SubscribeMessage('typing')
	// async typing(
	// 	@MessageBody('isTyping') isTyping: boolean,
	// 	@ConnectedSocket() client: Socket,
	// ) {
	// 	const name = await this.chatService.getClientbyId(client.id);
	// 	client.broadcast.emit('typing', { name, isTyping });
	// }

}
