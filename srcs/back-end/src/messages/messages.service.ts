import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService {
	constructor(private prismaService: PrismaService) {}

	messages: Message[] = [{ name: 'Marius', text: 'lol' }]; // a recuperer dans la db
	/* name --> qui a ecrit le message | text --> le message */

	clientToUser: { [key: string]: string } = { clientId: 'ID' }; // meme chose
	async create(createMessageDto: CreateMessageDto, clientId: string) {
		try {
			console.log('in the server: ' + 'client id : ', clientId);
			this.prismaService.message.update({
				where 
			});
		} catch (error) {
			throw error;
		}
		// return this.prismaService.message.findAll();
	}

	findAll() {
		return this.messages;
	}

	identify(name: string, clientId: string) {
		this.clientToUser[clientId] = name;
		return Object.values(this.clientToUser);
	}

	getClientbyId(clientId: string) {
		return this.clientToUser[clientId];
	}
}
