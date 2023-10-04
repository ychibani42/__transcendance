import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
} from '@nestjs/websockets';
import { DMservice } from './DM.service';
import { ChatService } from 'src/chat/chat.service';
// import { CreateDMDto } from './dto/create-DM.dto';
import { CreateMessageDto } from '../chat/dto/create-message.dto';
import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Param } from '@nestjs/common';
import { channel } from 'diagnostics_channel';
import { UserService } from '../user/user.service';
import { DMDto } from './dto/DM.dto';

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


    @SubscribeMessage('createMessageDM')
	async create( @MessageBody() createMessageDto: CreateMessageDto ) {
		const message = await this.dmService.createMessage(
			createMessageDto,
		);
		if (message == null)
			return null
		if (message && message.dm)
			this.server.to(message.dm.name).emit('messageDM', message);
		return message;
	}

	@SubscribeMessage('joinDM')
	async joinDM(client: Socket, data: DMDto)
	{
		if (data.oldRoom != 0)
			await this.dmService.leaveRoom(client, data.oldRoom)
		let dm: any = await this.dmService.findDM(data.user1, data.user2)
		if (dm)
		{
			client.join(dm.name)
			return dm
		}
	}

	@SubscribeMessage('createDM')
	async createDM(@Body() body :DMDto){
		const chan = await this.dmService.createChat(body);
		this.server.emit('createDM', chan)
		return chan
	}

	@SubscribeMessage('findAllDM')
	async findAllDM(@Body() data :DMDto){
		const dms = await this.dmService.findAllDM(data.user1, data.name);
		return dms
	}
}