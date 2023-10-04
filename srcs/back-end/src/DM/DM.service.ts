import { Injectable } from '@nestjs/common';
// import { CreateDMDto } from './create-DM.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from '../chat/dto/create-message.dto';
import { Message } from '../chat/entities/message.entity';
import { Exclude } from 'class-transformer';
import { Socket } from 'socket.io';
import { DMDto } from './dto/DM.dto';

@Injectable()
export class DMservice {
	constructor(private prismaService: PrismaService) {}

	async createMessage(createMessageDto: CreateMessageDto) {
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
						include: { user1: { select: { name: true } } },
					},
				},
			});
			return message;
		} catch (error) {
			console.log(error);
		}
	}

	async createChat(data: DMDto) {
		try {
			let dm: any = await this.findDM(data.user1, data.user2);
			if (!dm) {
				dm = await this.prismaService.dM.create({
					data: {
						blocked: false,
						name: '',
						user1: { connect: { id: data.user1 } },
						user2: { connect: { id: data.user2 } },
					},
					include: {
						messages: true,
					},
				});
				let id: string = String(dm.id);
				dm = await this.prismaService.dM.update({
					where: {
						id: dm.id,
					},
					data: {
						name: id,
					},
					include: {
						user1: true,
						user2: true,
						messages: true,
					},
				});
				return dm;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async leaveRoom(client: Socket, oldRoomId: number) {
		try {
			const dm = await this.prismaService.dM.findUniqueOrThrow({
				where: {
					id: oldRoomId,
				},
			});
			if (dm) client.leave(dm.name);
		} catch (error) {
			console.log(error);
		}
	}

	async findDM(userId1: number, userId2: number) {
		try {
			const dm = await this.prismaService.dM.findFirst({
				where: {
					OR: [
						{ dm1: userId1, dm2: userId2 },
						{ dm1: userId2, dm2: userId1 },
					],
				},
				include: { messages: true },
			});
			if (dm) return dm;
		} catch (error) {
			console.log(error);
			return null;
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
			console.log(error);
		}
	}

	async findAllDM(userid: number, name: string) {
		try {
			const dms = await this.prismaService.user.findMany({
				where: {
					NOT: [{ id: userid },
						{ blockedUsers: { some: { userBloqued: userid } } },
					],
					OR: [
						{ dm2: { some: { dm1: userid } } },
						{ dm2: { some: { dm2: userid } } },
						{ dm1: { some: { dm1: userid } } },
						{ dm1: { some: { dm2: userid } } },
					],
				},
				include: { dm1: true, dm2: true },
			});
			return dms;
		} catch (error) {
			console.log(error);
		}
	}

	async findUser(id: number) {
		try {
			const found = await this.prismaService.user.findUniqueOrThrow({
				where: {
					id: id,
				},
			});
			return found;
		} catch (error) {
			console.log(error);
		}
	}
}
