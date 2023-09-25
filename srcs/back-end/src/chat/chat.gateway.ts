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
		return chan
	}

	@SubscribeMessage('findAllChats')
	async findAllUsersChan(@Body() data: any) {
		const chats = await this.chatService.findAllUsersChan(data.userid);
		return chats
	}

	@SubscribeMessage('findAll')
	async findAll(@Body() data: any) {
		const chats = await this.chatService.findAll(data.userid);
		return chats
	}

	@SubscribeMessage('findOneChat')
	async findOneChat(@Body() data: any)
	{
		return await this.chatService.findOneChan(data.chanid)
	}

	@SubscribeMessage('findAllMessages')
	findAllMessages(@Body() chanid: number) {
		return this.chatService.findAllMessages(chanid);
	}

	@SubscribeMessage('joinRoom')
	async join(client: Socket, data: any) 
	{
		if (data.oldChatId != 0)
			await this.chatService.leaveRoom(client, data.oldChatId)
		let user: any = await this.chatService.findUser(data.userid, data.chanid)
		let chan: any = await this.chatService.findOneChan(data.chanid)
		chan = await this.chatService.joinRoom(client, data.userid, data.chanid)
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
	async leaveChannel(client: Socket, data: any) 
	{
		const chan = await this.chatService.findOneChan(data.chanid)
		if (chan)
		{
			let user: any = await this.chatService.unadmin(data.userid, data.chanid)
			this.server.to(chan.channelName).emit('unadmin', user)
			user = await this.chatService.unmute(data.userid, data.chanid)
			this.server.to(chan.channelName).emit('unmuted', user)
			user = await this.chatService.findUser1(data.userid, data.chanid)
			this.server.to(chan.channelName).emit('leaveChannel', user)
			user = await this.chatService.leaveChannel(chan, data.userid)
			client.leave(chan.channelName)
			return user
		}
			
	}

	@SubscribeMessage('kicked')
	async kicked(client: Socket, data: any) 
	{
		this.unadmin(data)
		this.unmuted(data)
		const chan = await this.chatService.findOneChan(data.chanid)
		if (chan)
		{
			let i:number = 0
			while (i < data.userid.length)
			{			
				
				let user: any = await this.chatService.kickChan(data.userid[i], data.chanid)
				this.server.to(chan.channelName).emit('kicked', user)
				client.leave(chan.channelName)
				i++;
			}
		}
			
	}

	@SubscribeMessage('unadmin')
	async unadmin(@Body() data: any) 
	{
		const chan = await this.chatService.findOneChan(data.chanid)
		if (chan)
		{
			let i:number = 0
			while (i < data.userid.length)
			{
				let user: any = await this.chatService.unadmin(data.userid[i].userId, data.chanid)
				this.server.to(chan.channelName).emit('unadmin', user)
				i++;
			}
		}
	}

	@SubscribeMessage('unbanned')
	async unbanned(@Body() data: any) 
	{
		const chan = await this.chatService.findOneChan(data.chanid)
		if (chan)
		{
			let i:number = 0
			while (i < data.userid.length)
			{
				let user: any = await this.chatService.unban(data.userid[i].userId, data.chanid)
				this.server.to(chan.channelName).emit('unbanned', user)
				i++;
			}
		}
	}

	@SubscribeMessage('unmuted')
	async unmuted(@Body() data: any) 
	{
		const chan = await this.chatService.findOneChan(data.chanid)
		if (chan)
		{
			let i:number = 0
			while (i < data.userid.length)
			{
				let user: any = await this.chatService.unmute(data.userid[i].userId, data.chanid)
				this.server.to(chan.channelName).emit('unmuted', user)
				i++;
			}
		}
	}

	@SubscribeMessage('deleteChannel')
	async deleteChannel(@Body() data: any) 
	{
		const chan = await this.chatService.findOneChan(data.chanid)
		if (chan)
		{
			await this.chatService.deleteChannel(data.chanid)
			this.server.emit('deleteChannel', chan)
		}
			
	}

	@SubscribeMessage('password')
	async password(client: Socket, data: any) 
	{
		const joined = await this.chatService.verifyPassword(data.pass, data.userid, data.chanid)
		
		let oldChatId: number = data.oldChatId
		let userid: number = data.userid
		let chanid: number = data.chanid
		if (joined == true)
			return this.join(client, { userid, oldChatId, chanid})
		return null
	}

	@SubscribeMessage('updatePassword')
	async updatePassword(@Body() data: any){
		await this.chatService.updatePassword(data.pass, data.chanid)
		const chan = await this.chatService.findOneChan(data.chanid)
		if (chan)
		{
			this.server.emit('updatePassword', chan) 
		}
	}

	@SubscribeMessage('updateStatus')
	async updateStatus(@Body() data: any){
		const chan = await this.chatService.findOneChan(data.chanid)
		const status = await this.chatService.updateStatus(data.status, data.chanid)
		if (chan)
			this.server.emit('updateStatus', status) 
		return status
	}



	@SubscribeMessage('admin')
	async admin(@Body() data: any) 
	{
		const chan = await this.chatService.findOneChan(data.chanid)
		let user: any
		if (chan)
		{
			let i:number = 0
			while (i < data.userid.length)
			{
				user = await this.chatService.pushAdminChan(data.userid[i], data.chanid)
				this.server.to(chan.channelName).emit('admin', user)
				i++;
			}
		}
		return user
	}

	@SubscribeMessage('banned')
	async banned(@Body() data: any) 
	{
		this.unadmin(data)
		this.unmuted(data)
		const chan = await this.chatService.findOneChan(data.chanid)
		let user: any
		if (chan)
		{
			let i:number = 0
			while (i < data.userid.length)
			{
				user = await this.chatService.pushBannedChan(data.userid[i], data.chanid)
				this.server.to(chan.channelName).emit('banned', user)
				i++;
			}
		}
		return user

	}

	@SubscribeMessage('muted')
	async muted(@Body() data: any) 
	{
		const chan = await this.chatService.findOneChan(data.chanid)
		let user: any
		if (chan)
		{
			let i:number = 0
			while (i < data.userid.length)
			{
				user = await this.chatService.pushMutedChan(data.userid[i], data.chanid)
				this.server.to(chan.channelName).emit('muted', user)
				i++;

				setTimeout(() => {
					console.log('unmute')
					this.unmuted(data)
				}, data.duration * 60000)
			}
		}
		return user
		
	}
}
