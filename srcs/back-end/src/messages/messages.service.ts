import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
	messages: Message[] = [{ name: 'Marius', text: 'lol' }]; // a recuperer dans la db
							/* name --> qui a ecrit le message | text --> le message */
	clientToUser: { [key: string]: string } = { clientId: 'coucou' }; // meme chose
	async create(createMessageDto: CreateMessageDto) {
		const message = { ...createMessageDto };
		this.messages.push(message);
		return message;
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
