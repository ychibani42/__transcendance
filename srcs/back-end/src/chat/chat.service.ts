import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
	constructor(private prismaService: PrismaService) {}
	async createChat(createChatDto: CreateChatDto) {
		console.log(createChatDto);
		await this.prismaService.channel.create({
			data: {
				channelName: createChatDto.channelName,
				is_private: createChatDto.is_private,
				ownerId: createChatDto.ownerId,
				dm: createChatDto.dm,
				password: createChatDto.password,
			},
		});
		return createChatDto;
	}

	async findAllChats() {
		const chan = await this.prismaService.channel.findMany({include : {
			messages : true
		}})
		return chan;
	}
	
	findOneChat(id: number) {
		return `This action returns a #${id} chat`;
	}

	updateChat(id: number, updateChatDto: UpdateChatDto) {
		return `This action updates a #${id} chat`;
	}

	removeChat(id: number) {
		return;
	}

	async createMessage(createMessageDto: CreateMessageDto, clientId: string) {
		console.log(createMessageDto);
		try {
		} catch (error) {
			throw error;
		}
		// return this.prismaService.message.findAll();
	}

	findAllMessages() {
		return this.prismaService.message.findMany();
	}

	identifyUser(name: string, clientId: string) {
		// this.clientToUser[clientId] = name;
		// return Object.values(this.clientToUser);
	}

	getClientbyId(clientId: string) {
		// return this.clientToUser[clientId];
	}
}
