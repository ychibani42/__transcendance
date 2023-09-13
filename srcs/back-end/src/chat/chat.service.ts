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
		let channel: any
		if (createChatDto.password != '') {
			channel = await this.prismaService.channel.create({
			data: {
				channelName: createChatDto.channelName,
				is_private: createChatDto.is_private,
				ownerId: createChatDto.ownerId,
				dm: createChatDto.dm,
				password: createChatDto.password,
				locked: true,
			},
		});
		console.log('if')
		}
		else
		{
			channel = await this.prismaService.channel.create({
				data: {
					channelName: createChatDto.channelName,
					is_private: createChatDto.is_private,
					ownerId: createChatDto.ownerId,
					dm: createChatDto.dm,
				},
			});
			console.log('else')
		}
		return channel
		
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
					dm:true,
					locked: true
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
			let admin: any;
			while (i < userid.length)
			{
				admin = await this.findAdmin(userid[i])
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
			return admin
		} catch (error) {
			console.log(error)
			return null
		}
	}


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
			let banned: any;
			while (i < userid.length)
			{
				banned = await this.findBanned(userid[i])
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
					include: {
						bannedUsers:true,
						mutedUsers :true,
						messages: true,
						user:true,
						adminUsers:true,
					}
				});
			i++
		}
		return banned
		} catch (error) {
			console.log(error)
		}
	}

	async pushMutedChan(userid: Array<number>, chanid: number) {
		try {
			let i:number = 0
			let muted: any
			while (i < userid.length)
			{
				muted = await this.findMuted(userid[i])
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
				await this.prismaService.channel.update({
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
		return muted;
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
			return null
			
		}
	}

	async joinRoom(client: Socket, userid: number, chanid: number)
	{
		try {
			const chan = await this.findOneChan(chanid)
			/*const banned = await this.prismaService.banned.findUniqueOrThrow({
				where: {
					id: userid,
				},
				select: {
					channel: true
				}
			})
			for (let i = 0; i < banned.channel.length; i++)
			{
				if (banned.channel[i].id == chanid)
				{
					client.emit('error', 'banned')
					return null
				}
					
			}*/
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
					include: {
						user: true,
						messages: true,
						bannedUsers:true,
						mutedUsers :true,
					}
				});
				client.join(chan.channelName)
				const user = this.exclude(userInChan,["password"])
				console.log("USER",user)
				console.log("USERINCHAN",userInChan)
				return (userInChan)
			}

		} catch (error) {
			console.log(error)
		}
	}

	exclude(user, keys) {
		return Object.fromEntries(
		  Object.entries(user).filter(([key]) => !keys.includes(key))
		);
	}

	async leaveRoom(client: Socket, oldChatId: number) {
		const oldChan = await this.findOneChan(oldChatId)
		
		if (oldChan)
			client.leave(oldChan.channelName)
	}
}



