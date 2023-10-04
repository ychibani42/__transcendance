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
import { findDto } from './dto/find.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Chat } from './entities/chat.entity';
import { Param } from '@nestjs/common';
import { channel } from 'diagnostics_channel';
import { joinDto } from './dto/join.dto';
import { leaveDto } from './dto/leave.dto';
import { kickDto } from './dto/kicked.dto';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:5173',
	},
	namespace: 'chat',
})
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('ChatGateway');

	constructor(private readonly chatService: ChatService) {}

	@SubscribeMessage('createMessage')
	async create(
		@MessageBody() createMessageDto: CreateMessageDto,data : number,@ConnectedSocket() client: Socket) {
		const message = await this.chatService.createMessage( client,
			createMessageDto,
		);
		if (message == null)
			return null
		if (message.channel)
			this.server.to(message.channel.channelName).emit('message', message);
		return message;
	}

	@SubscribeMessage('createRoom')
	async createRoom(@Body() body :CreateChatDto){
		const chan = await this.chatService.createChat(body);
		this.server.emit('createRoom', chan)
		return chan
	}

	@SubscribeMessage('findAllChats')
	async findAllUsersChan(@Body() data: findDto) {
		const chats = await this.chatService.findAllUsersChan(data.id);
		return chats
	}

	@SubscribeMessage('findAll')
	async findAll(@Body() data: findDto) {
		const chats = await this.chatService.findAll(data.id);
		return chats
	}

	@SubscribeMessage('findOneChat')
	async findOneChat(@Body() data: findDto)
	{
		return await this.chatService.findOneChan(data.id)
	}

	@SubscribeMessage('findAllMessages')
	findAllMessages(@Body() chanid: number) {
		return this.chatService.findAllMessages(chanid);
	}

	@SubscribeMessage('joinRoom')
	async join(client: Socket, data: joinDto) 
	{
		if (data.oldChatId != 0)
			await this.chatService.leaveRoom(client, data.oldChatId)
		let user: any = await this.chatService.findUser(data.userId, data.chatId)
		let chan: any = await this.chatService.findOneChan(data.chatId)
		chan = await this.chatService.joinRoom(client, data.userId, data.chatId)
		if (user && chan)
			this.server.emit('joinRoom', user)
		return chan
	}

	@SubscribeMessage('leaveRoom')
	leave(client: Socket, channelName: string) 
	{
		client.leave(channelName)
	}

	@SubscribeMessage('leaveChannel')
	async leaveChannel(client: Socket, data: leaveDto) 
	{
		const chan = await this.chatService.findOneChan(data.chatId)
		if (chan)
		{
			let user: any = await this.chatService.unadmin(data.userId, data.chatId)
			this.server.to(chan.channelName).emit('unadmin', user)
			user = await this.chatService.unmute(data.userId, data.chatId)
			this.server.to(chan.channelName).emit('unmuted', user)
			user = await this.chatService.findUser1(data.userId, data.chatId)
			this.server.to(chan.channelName).emit('leaveChannel', user)
			user = await this.chatService.leaveChannel(chan, data.userId)
			client.leave(chan.channelName)
			return user
		}
			
	}

	@SubscribeMessage('kicked')
	async kicked(client: Socket, data: kickDto) 
	{
		// console.log('ici', data.chatId)
		this.unadmin(data)
		this.unmuted(data)
		const chan = await this.chatService.findOneChan(data.chatId)
		if (chan)
		{
			let i:number = 0
			while (i < data.userId.length)
			{		
				let user: any = await this.chatService.kickChan(client, data.userId[i], data.chatId)
				this.server.to(chan.channelName).emit('kicked', user)
				i++;
			}
		}
			
	}


	@SubscribeMessage('unadmin')
	async unadmin(@Body() data: kickDto) 
	{
		const chan = await this.chatService.findOneChan(data.chatId)
		if (chan)
		{
			console.log('unadmin', data.userId.length)
			let i:number = 0
			while (i < data.userId.length)
			{
				let user: any = await this.chatService.unadmin(data.userId[i], data.chatId)
				this.server.to(chan.channelName).emit('unadmin', user)
				i++;
			}
		}
		return chan
	}

	@SubscribeMessage('unbanned')
	async unbanned(@Body() data: kickDto) 
	{
		const chan = await this.chatService.findOneChan(data.chatId)
		if (chan)
		{
			let i:number = 0
			while (i < data.userId.length)
			{
				let user = await this.chatService.unban(data.userId[i], data.chatId)
				this.server.to(chan.channelName).emit('unbanned', user)
				i++;
			}
		}
		return chan
	}

	@SubscribeMessage('unmuted')
	async unmuted(@Body() data: kickDto) 
	{
		const chan = await this.chatService.findOneChan(data.chatId)
		if (chan)
		{
			let i:number = 0
			while (i < data.userId.length)
			{
				let user: any = await this.chatService.unmute(data.userId[i], data.chatId)
				this.server.to(chan.channelName).emit('unmuted', user)
				i++;
			}
		}
		return chan
	}

	@SubscribeMessage('deleteChannel')
	async deleteChannel(@Body() data: findDto) 
	{
		const chan = await this.chatService.findOneChan(data.id)
		if (chan)
		{
			await this.chatService.deleteChannel(data.id)
			this.server.emit('deleteChannel', chan)
		}
			
	}

	@SubscribeMessage('password')
	async password(client: Socket, data: joinDto) 
	{
		const joined = await this.chatService.verifyPassword(data.pass, data.userId, data.chatId)
		if (joined == true)
			return this.join(client, data)
		return null
	}

	@SubscribeMessage('updatePassword')
	async updatePassword(@Body() data: joinDto){
		await this.chatService.updatePassword(data.pass, data.chatId)
		const chan = await this.chatService.findOneChan(data.chatId)
		if (chan)
		{
			this.server.emit('updatePassword', chan) 
		}
	}

	@SubscribeMessage('updateStatus')
	async updateStatus(@Body() data: joinDto){
		const chan = await this.chatService.findOneChan(data.chatId)
		const status = await this.chatService.updateStatus(data.status, data.chatId)
		if (chan)
			this.server.emit('updateStatus', status) 
		return status
	}



	@SubscribeMessage('admin')
	async admin(@Body() data: kickDto) 
	{
		const chan = await this.chatService.findOneChan(data.chatId)
		let user: any
		if (chan)
		{
			let i:number = 0
			while (i < data.userId.length)
			{
				user = await this.chatService.pushAdminChan(data.userId[i], data.chatId)
				this.server.to(chan.channelName).emit('admin', user)
				i++;
			}
		}
		return user
	}

	@SubscribeMessage('banned')
	async banned(@Body() data: kickDto) 
	{
		this.unadmin(data)
		this.unmuted(data)
		const chan = await this.chatService.findOneChan(data.chatId)
		let user: any
		if (chan)
		{
			let i:number = 0
			while (i < data.userId.length)
			{
				user = await this.chatService.pushBannedChan(data.userId[i], data.chatId)
				this.server.to(chan.channelName).emit('banned', user)
				i++;
			}
		}
		return user

	}

	@SubscribeMessage('muted')
	async muted(@Body() data: kickDto) 
	{
		const chan = await this.chatService.findOneChan(data.chatId)
		let user: any
		if (chan)
		{
			let i:number = 0
			while (i < data.userId.length)
			{
				user = await this.chatService.pushMutedChan(data.userId[i], data.chatId)
				this.server.to(chan.channelName).emit('muted', user)
				i++;

				setTimeout(() => {
					this.unmuted(data)
				}, data.duration * 60000)
			}
		}
		return user
		
	}
}
