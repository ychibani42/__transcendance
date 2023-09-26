import { Injectable } from "@nestjs/common";
// import { CreateDMDto } from './create-DM.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from '../chat/dto/create-message.dto';
import { Message } from '../chat/entities/message.entity';
import { Exclude } from 'class-transformer';
import { Socket } from 'socket.io';

@Injectable()
export class DMservice{
    constructor(private prismaService: PrismaService) {}

    async createMessage( createMessageDto: CreateMessageDto) {
		try {
			console.log(createMessageDto.id)
			const message = await this.prismaService.message.create({
				data: {
					userId: createMessageDto.user,
					dmId: createMessageDto.id,
					name: createMessageDto.name,
					text: createMessageDto.text,
				},
				select: {
					userId: true,
					dmId: true,
					name: true,
					text: true,
					dm: {
						select: { user1: { select: { name: true } } } }
				},
			});
			return message;
		} catch (error) {
			console.log(error);
		}
	}

	async createChat(data: any) {
		try {
			console.log('data', data)
			let dm: any
			dm = await this.prismaService.dM.create({
			data: {
				blocked: false,
				dm1: data.user1Id,
				dm2: data.user2Id,
			},
			include: {
				user1: true,
				user2: true,
				messages: true
			}
		});
		console.log('ici')
		return dm
	}
	catch (error) {
		console.log(error)
	}
}

    async findAllMessages(dmId: number) {
		try {
			const message = await this.prismaService.message.findMany({
				where: {
					dmId: dmId,
				},
			});
			return message;
		} catch (error) {
			console.log(error)
		}
	}
}