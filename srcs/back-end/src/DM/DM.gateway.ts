import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
} from '@nestjs/websockets';
import { DMService } from './DM.service';
import { CreateDMDto } from './dto/create-DM.dto';
import { CreateMessageDto } from './dto/create-message.dto';
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

	private logger: Logger = new Logger('DMGateway');

	constructor(private readonly dmService: DMService) {}
    @SubscribeMessage('createMessageDM')
	async create(
		@MessageBody() createMessageDto: CreateMessageDto,data : number,@ConnectedSocket() client: Socket) {
		const message = await this.dmService.createMessage(
			createMessageDto,
		);
		if (message == null)
			return null
		this.server.to(message.channel.channelName).emit('message', message);
		return message;
	}
}