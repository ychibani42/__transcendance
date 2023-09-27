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
						include: { user1: { select: { name: true } } } }
				},
			});
			return message;
		} catch (error) {
			console.log(error);
		}
	}

	async createChat(data: any) {
		try {
			let dm: any = await this.findDM(data.user1Id, data.user2Id)
			if (!dm){
				dm = await this.prismaService.dM.create({
				data: {
					blocked: false,
					dm1: data.user1Id,
					dm2: data.user2Id,
					name: ''
				},
				include: {
					user1: true,
					user2: true,
					messages: true
				}
			}); 
			let id: string = String(dm.id)
			dm = await this.prismaService.dM.update({
				where: {
					id: dm.id
				},
				data: {
					name: id
				},
				include: {
					user1: true,
					user2: true,
					messages: true
				}
			})
			return dm
		}
		
	}
	catch (error) {
		console.log(error)
	}
}

async leaveRoom(client: Socket, oldRoomId: number) {
	try {
		const dm = await this.prismaService.dM.findUniqueOrThrow({
			where: {
				id: oldRoomId
			}
		})
		if (dm)
			client.leave(dm.name)

	} catch (error) {
		console.log(error)
	}
}

	async findDM(userId1: number, userId2: number) {
		try {
			const dm = await this.prismaService.dM.findFirst({
				where: {
					OR: [
						{ dm1: userId1, dm2: userId2,},
						{ dm1: userId2, dm2: userId1 }
					]
				},
				include: { messages: true}
			})
			if (dm)
				return dm
		} catch (error) {
			console.log(error)
			return null
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