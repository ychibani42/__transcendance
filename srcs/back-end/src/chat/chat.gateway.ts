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
import { channel } from 'diagnostics_channel';

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
	async createRoom(@Body() body :any){
		const chan = await this.chatService.createChat(body);
		this.server.emit('createRoom', chan)
	}

	@SubscribeMessage('findAllChats')
	async findAll() {
		const chats = await this.chatService.findAllChats();
		console.log('display',chats)
		return chats
	}

	@SubscribeMessage('findAllMessages')
	findAllMessages(@Body() chanid: number) {
		return this.chatService.findAllMessages(chanid);
	}

	@SubscribeMessage('joinRoom')
	async join(client: Socket, data: any) 
	{
		console.log(data)
		
		if (data.oldChatId != 0)
			await this.chatService.leaveRoom(client, data.oldChatId)
		return await this.chatService.joinRoom(client, data.userid, data.chanid)
	}

	@SubscribeMessage('leaveRoom')
	leave(client: Socket, channelName: string) 
	{
		client.leave(channelName)
	}

	@SubscribeMessage('password')
	password(client: Socket, data: any) 
	{
		this.chatService.joinRoomWithPassword(client, data.pasword, data.userid, data.chanid)
		client.emit('joinRoom')
	}

	@SubscribeMessage('admin')
	async admin(@Body() data: any) 
	{
		const chan = await this.chatService.findOneChan(data.chanid)
		const admin = await this.chatService.pushAdminChan(data.userid, data.chanid)
		if (chan)
		{
			if (admin)
			{
				this.server.to(chan.channelName).emit('admin', admin)
			}
		}
		return admin
	}

	@SubscribeMessage('banned')
	async banned(@Body() data: any) 
	{
		const chan = await this.chatService.findOneChan(data.chanid)
		const banned = await this.chatService.pushBannedChan(data.userid, data.chanid)
		if (chan)
		{
			if (banned)
			{
				this.server.to(chan.channelName).emit('banned', banned)
			}
		}
		return banned

	}

	@SubscribeMessage('muted')
	async muted(@Body() data: any) 
	{
		const chan = await this.chatService.findOneChan(data.chanid)
		const muted = await this.chatService.pushMutedChan(data.userid, data.chanid)
		if (chan)
		{
			if (muted)
			{
				this.server.to(chan.channelName).emit('muted', muted)
			}
		}
		return muted
		
	}
}
