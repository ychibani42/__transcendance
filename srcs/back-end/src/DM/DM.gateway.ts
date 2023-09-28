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
	async joinDM(client: Socket, data: any)
	{
		if (data.oldRoomId != 0)
			await this.dmService.leaveRoom(client, data.oldRoomId)
		let dm: any = await this.dmService.findDM(data.user1Id, data.user2Id)
		if (dm)
		{
			client.join(dm.name)
			this.server.emit('joinDM', data.user)
			return dm
		}
	}

	@SubscribeMessage('createDM')
	async createDM(@Body() body :any){
		const chan = await this.dmService.createChat(body);
		this.server.emit('createDM', chan)
		return chan
	}

	@SubscribeMessage('findAllDM')
	async findAllDM(@Body() data :any){
		const dms = await this.dmService.findAllDM(data.userid, data.name);
		return dms
	}
}