import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

// @UseGuards
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get('chan/getAllRooms')
	async getRooms(): Promise<any> {
		return undefined;
	}

	@Post('chan/createRooms')
	async createRooms(/*l'User qui viens de cree le channel, */ @Body() body: CreateChatDto): Promise<number> {

		const chatId = this.chatService.create(body);

		return chatId;
	}

	@Post('chan/DeleteRooms')
	async deleteRooms(): Promise<void> {
		return this.chatService.remove(1);
	}
}
