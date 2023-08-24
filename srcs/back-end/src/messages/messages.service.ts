import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
	constructor(private prismaService: PrismaService) {}

	clientToUser: { [key: string]: string } = { clientId: 'ID' }; // meme chose

	async create(createMessageDto: CreateMessageDto, clientId: string) {
		console.log(createMessageDto);
		try {
			
		} catch (error) {
			throw error;
		}
		// return this.prismaService.message.findAll();
	}

	findAll() {
		return this.prismaService.message.findMany();
	}

	identify(name: string, clientId: string) {
		this.clientToUser[clientId] = name;
		return Object.values(this.clientToUser);
	}

	getClientbyId(clientId: string) {
		return this.clientToUser[clientId];
	}
}
