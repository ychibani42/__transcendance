import { Injectable } from "@nestjs/common";
import { CreateDMDto } from './create-DM.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Exclude } from 'class-transformer';
import { Socket } from 'socket.io';

@Injectable()
export class DMservice{
    constructor(private prismaService: PrismaService) {}

    async createMessage( createMessageDto: CreateMessageDto) {
		try {
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
				},
			});
			return message;
		} catch (error) {
			console.log(error);
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