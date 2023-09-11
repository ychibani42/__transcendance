import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatDto } from './dto/chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Exclude } from 'class-transformer';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
	constructor(private prismaService: PrismaService) {}
	async createChat(createChatDto: CreateChatDto) {
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
					adminUsers:true,
					ownerId:true,
					user: true,
					messages: true,
					bannedUsers:true,
					mutedUsers :true,
					is_private: true,
					dm:true
				}
			});
			return chan;
		} catch (error) {
			console.log(error)
		}
	}

	async findOneChat(chanId: number) {
		try {
			const chan = await this.prismaService.channel.findUniqueOrThrow({
				where: {
					id: chanId,
				},
			});
			// const test: string | undefined = chan?.channelName;
			return chan;
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

	async createMessage( createMessageDto: CreateMessageDto) {
		try {
			const message = await this.prismaService.message.create({
				data: {
					userId: createMessageDto.user,
					channelId: createMessageDto.id,
					name: createMessageDto.name,
					text: createMessageDto.text,
				},
				select: {
					userId: true,
					channelId: true,
					name: true,
					text: true,
					channel: {
						select: {
							channelName: true,
						}
					},
				},
			});
			return message;
		} catch (error) {

			console.log(error);
		}
		// return this.prismaService.message.findAll();
	}

	async findAllMessages(chanId: number) {
		try {
			const message = await this.prismaService.message.findMany({
				where: {
					channelId: chanId,
				},
			});
			return message;
		} catch (error) {
			console.log(error)
		}
	}

	// identifyUser(name: string, clientId: string) {
	// 	this.clientToUser[clientId] = name;
	// 	return Object.values(this.clientToUser);
	// }

	async findAllUsersChan(chanId: number) {
		try {
			const user = await this.prismaService.user.findMany({
				where: {
					id : chanId,
				},
			});
			return user;
		} catch (error) {
			console.log(error)
		}
	}

	async pushAdminChan(userid: Array<number>, chanid: number) {
		try {
			let i:number = 0
			while (i < userid.length)
			{
				const admin = await this.findAdmin(userid[i])
				console.log('admin',admin)
				if (!admin)
				{
					await this.prismaService.admin.create({
						data: {
							id: userid[i],
							channelId: chanid,
						},
						select: {
							id: true,
							channelId: true,
							channel: true,
						}
					});
				}
				console.log(userid[i])
				const adminperson = await this.prismaService.channel.update({
					where: {
						id: chanid,
					},
				
					data: {
						adminUsers: {
							connect: {
								id: userid[i]
							},
						},
					},
					select: {
						password: false,
						id: true,
						channelName: true,   
						adminUsers:true,
						ownerId:true,
						user: true,
						messages: true,
						bannedUsers:true,
						mutedUsers :true,
						is_private: true,
						dm:true
					}
				});
			i++
			}
		} catch (error) {
			console.log(error)
		}
	}
// 	id        Int      @id @unique @default(autoincrement())
//   createdAt DateTime @default(now())
//   duration  Int
//   userId    Int
//   channel    Channel  @relation(fields: [channelId], references: [id])
//   channelId Int

	async findMuted(userid: number) {
		try {
			const user = await this.prismaService.muted.findUniqueOrThrow({
				where: {
					id: userid
				}
			})
			return user
		} catch (error) {
			console.log(error)
		}
			
	}

	async findBanned(userid: number) {
		try {
			const user = await this.prismaService.banned.findUniqueOrThrow({
				where: {
					id: userid
				}
			})
			return user
		} catch (error) {
			console.log(error)
		}
			
	}

	async findAdmin(userid: number) {
		try {
			const user = await this.prismaService.admin.findUniqueOrThrow({
				where: {
					id: userid
				}
			})
			return user
		} catch (error) {
			console.log(error)
		}
			
	}

	async pushBannedChan(userid: Array<number>, chanid: number) {
		try {
			let i:number = 0
			while (i < userid.length)
			{
				const banned = await this.findBanned(userid[i])
				console.log('banned',banned)
				if (!banned)
				{
					await this.prismaService.banned.create({
						data: {
							id: userid[i],
							channelId: chanid,
						},
						select: {
							id: true,
							channelId: true,
							channel: true,
						}
					});
				}
				console.log(userid[i])
				const bannedperson = await this.prismaService.channel.update({
					where: {
						id: chanid,
					},
				
					data: {
						bannedUsers: {
							connect: {
								id: userid[i]
							},
						},
					},
					select: {
						password: false,
						id: true,
						channelName: true,   
						adminUsers:true,
						ownerId:true,
						user: true,
						messages: true,
						bannedUsers:true,
						mutedUsers :true,
						is_private: true,
						dm:true
					}
				});
			i++
		}
		} catch (error) {
			console.log(error)
		}
	}

	async pushMutedChan(userid: Array<number>, chanid: number) {
		try {
			let i:number = 0
			while (i < userid.length)
			{
				const muted = await this.findMuted(userid[i])
				console.log(muted)
				if (!muted)
				{
					await this.prismaService.muted.create({
						data: {
							id: userid[i],
							// duration: 8,
							channelId: chanid
						},
						select: {
							id: true,
							// duration: true,
							channelId: true,
							channel: true,
						}
					});
				}
				console.log(userid[i])
				const mutedperson = await this.prismaService.channel.update({
					where: {
						id: chanid,
					},
				
					data: {
						mutedUsers: {
							connect: {
								id: userid[i]
							},
						},
					},
					select: {
						password: false,
						id: true,
						channelName: true,   
						adminUsers:true,
						ownerId:true,
						user: true,
						messages: true,
						bannedUsers:true,
						mutedUsers :true,
						is_private: true,
						dm:true
					}
				});
			i++
		}
		// return mutedperson;
		} catch (error) {
			console.log(error)
		}
	}

	async findOneChan(chanid: number) {
		try {
			const chan = await this.prismaService.channel.findUniqueOrThrow({
				where: {
					id: chanid,
				},
				select: {
					password: false,
					id: true,
					channelName: true,   
					adminUsers:true,
					ownerId:true,
					user: true,
					messages: true,
					bannedUsers:true,
					mutedUsers :true,
					is_private: true,
					dm:true
				}
				
			});
			return chan
		} catch (error) {
			console.log(error)
		}
	}

	async joinRoom(client: Socket, userid: number, chanid: number)
	{
		try {
			const chan = await this.findOneChan(chanid)
			const user = await this.prismaService.channel.findUnique({
				where: {
					user: {
						id: userid
					}
				}.user,
			}) // for banned
			if (chan)
			{
				const userInChan = await this.prismaService.channel.update({
					where: {
						id: chan.id,
					},
					data: {
						user: {
							connect: {
								id: userid
							},
						},
					},
					select: {
						password: false,
						id: true,
						channelName: true,   
						adminUsers:true,
						ownerId:true,
						user: true,
						messages: true,
						bannedUsers:true,
						mutedUsers :true,
						is_private: true,
						dm:true
					}
				});
				client.join(chan.channelName)
				return (userInChan)
			}

		} catch (error) {
			console.log(error)
		}
	}

	async leaveRoom(client: Socket, oldChatId: number) {
		const oldChan = await this.findOneChan(oldChatId)
		
		if (oldChan)
			client.leave(oldChan.channelName)
	}
}



