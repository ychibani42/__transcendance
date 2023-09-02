import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatDto } from './dto/chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Exclude } from 'class-transformer';

@Injectable()
export class ChatService {
	constructor(private prismaService: PrismaService) {}
	async createChat(createChatDto: CreateChatDto) {
		// console.log(createChatDto);
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
		try {
			const chan = await this.prismaService.channel.findMany({
				select: {
					password: false,
					id: true,
					channelName: true,   
					adminId:true,
					ownerId:true,
					user :true,
					messages: true,
					blockedUsers:true,
					mutedUsers :true,
					dm:true
				}
			});
			console.log(chan)
			return chan;
		} catch (error) {
			console.log(error)
		}
	}

	async findOneChat(chanId: number) {
		console.log('test', chanId);
		try {
			const chan = await this.prismaService.channel.findUniqueOrThrow({
				where: {
					id: chanId,
				},
			});
			const test: string | undefined = chan?.channelName;
			return test;
		} catch (error) {
			console.log(error);
		}
	}

	updateChat(id: number, updateChatDto: UpdateChatDto) {
		return `This action updates a #${id} chat`;
	}

	removeChat(id: number) {
		return;
	}

	async createMessage( createMessageDto: CreateMessageDto, clientId: number) {
		try {
			let message = await this.prismaService.message.create({
				data: {
					userId: createMessageDto.user,
					channelId: createMessageDto.id,
					name: createMessageDto.name,
					text: createMessageDto.text,
				},
			});
			return message;
		} catch (error) {
			console.log(error);
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
