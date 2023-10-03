import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/Guard/jwt-guard';
import { CreateChatDto } from './dto/create-chat.dto';

// @UseGuards
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
	constructor(private readonly chatService: ChatService,
		private readonly userService: UserService) {}

}
