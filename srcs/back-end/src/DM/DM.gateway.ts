import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
} from '@nestjs/websockets';
import { DMservice } from './DM.service';
// import { CreateDMDto } from './dto/create-DM.dto';
import { CreateMessageDto } from '../chat/dto/create-message.dto';
import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Param } from '@nestjs/common';
import { channel } from 'diagnostics_channel';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:5173',
	},
	namespace: 'chat',
})
export class DMGateway {
    @WebSocketServer()
	server: Server;

	constructor(private readonly dmService: DMservice) {}

	@SubscribeMessage('test')
	test() {
		console.log('test')
	}

    @SubscribeMessage('createMessageDM')
	async create( @MessageBody() createMessageDto: CreateMessageDto ) {
		console.log('ici')
		const message = await this.dmService.createMessage(
			createMessageDto,
		);
		if (message == null)
			return null
		console.log('ici')
		if (message.dm && message.dm.user1.name)
		{
			this.server.to(message.dm.user1.name).emit('message', message);
			console.log('name of receiver', message.dm.user1.name)
			console.log('message', message)
		}
			
		return message;
	}
	@SubscribeMessage('createDM')
	async createDM(@Body() body :any){
		console.log(body)
		const chan = await this.dmService.createChat(body);
		console.log(chan)
		this.server.emit('createDM', chan)
		return chan
	}
}