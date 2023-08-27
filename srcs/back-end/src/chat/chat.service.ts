import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
	constructor(private prismaService: PrismaService) {}
	async create(createChatDto: CreateChatDto) {
		return this.prismaService.user.create({
			data: {
				channels: {
					create: {
						channelName: createChatDto.channelName,
						is_private: createChatDto.is_private,
						
					},
				},
			},
		});
		return 2;
	}

	findAll() {
		return `This action returns all chat`;
	}

	findOne(id: number) {
		return `This action returns a #${id} chat`;
	}

	update(id: number, updateChatDto: UpdateChatDto) {
		return `This action updates a #${id} chat`;
	}

	remove(id: number) {
		return;
	}
}
