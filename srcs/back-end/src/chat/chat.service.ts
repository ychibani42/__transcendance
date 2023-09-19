import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatDto } from './dto/chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Exclude } from 'class-transformer';
import { Socket } from 'socket.io';
import * as argon2 from "argon2";

@Injectable()
export class ChatService {
	constructor(private prismaService: PrismaService) {}
	async createChat(createChatDto: CreateChatDto) {
		try {
			let channel: any
		if (createChatDto.password != '') {
			const hash = await argon2.hash(createChatDto.password)
			channel = await this.prismaService.channel.create({
			data: {
				channelName: createChatDto.channelName,
				is_private: createChatDto.is_private,
				ownerId: createChatDto.ownerId,
				dm: createChatDto.dm,
				password: hash,
				locked: true,
			},
			include: {
				adminUsers: true,
				user: true,
				messages: true,
				bannedUsers: true,
				mutedUsers: true,
			}
		});
		}
		else
		{
			channel = await this.prismaService.channel.create({
				data: {
					channelName: createChatDto.channelName,
					is_private: createChatDto.is_private,
					ownerId: createChatDto.ownerId,
					dm: createChatDto.dm,
					password: '',
					locked: false
				},
				include: {
					adminUsers: true,
					user: true,
					messages: true,
					bannedUsers: true,
					mutedUsers: true,
				}
			});
		}
		return this.exclude(channel, ['password'])
		} catch (error) {
			console.log('error')
		}
		
	}

	async findAll() {
		try {
			const chan = await this.prismaService.channel.findMany({
				include: { 
					adminUsers:true,
					bannedUsers:true,
					mutedUsers :true,
					messages: true,
					user: true
				},
			});
			return (chan)
		} catch (error) {
			console.log(error)
		}
	}


	// 	try {
	// 		console.log('chanid', chanId)
	// 		const chan = await this.prismaService.channel.findUniqueOrThrow({
	// 			where: {
	// 				id: chanId,
	// 			},
	// 		});
	// 		return chan;
	// 	} catch (error) {
	// 		console.log(error);
	// 		return null
	// 	}
	// }

	async findOneChan(chanid: number) {
		try {
			const chan = await this.prismaService.channel.findUniqueOrThrow({
				where: {
					id: chanid,
				},
				include: { 
					adminUsers:true,
					bannedUsers:true,
					mutedUsers :true,
					messages: true,
					user: true
				},
				
			});
			return chan
		} catch (error) {
			console.log(error)
			return null
			
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

	async findAllUsersChan(userid: number) {
		try {
			const channels = await this.prismaService.channel.findMany({
				where: {
					user: {
						some: {
							id: userid
						}
					}
				}
			});
			return channels;
		} catch (error) {
			console.log(error)
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
				},
				select: {
					channel: true
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

	async pushAdminChan(userid: Array<number>, chanid: number) {
		try {
			let i:number = 0
			let admin: any;
			while (i < userid.length)
			{
				admin = await this.findAdmin(userid[i])
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
				else {
					await this.prismaService.channel.update({
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
						include: { 
							adminUsers:true,
							bannedUsers:true,
							mutedUsers :true,
							messages: true,
							user: true
						},
					});
				}
				
			i++
			}
			return admin
		} catch (error) {
			console.log(error)
			return null
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
					else {
						await this.prismaService.channel.update({
							where: {
								id: chanid,
							},
							data: {
								bannedUsers: {
									connect: {
										id: userid[i]
									},
								},
								user: {
									disconnect: {
										id: userid[i]
									},
								},
								adminUsers: {
									disconnect: {
										id: userid[i]
									},
								},
								mutedUsers: {
									disconnect: {
										id: userid[i]
									}
								}
							},
							include: { 
								adminUsers:true,
								bannedUsers:true,
								mutedUsers :true,
								messages: true,
								user: true
							},
						});
					}
					
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
				else {
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
						include: { 
							adminUsers:true,
							bannedUsers:true,
							mutedUsers :true,
							messages: true,
							user: true
						},
					});
				}
				
			i++
		}
		return muted;
		} catch (error) {
			console.log(error)
		}
	}

	async joinRoom(client: Socket, userid: number, chanid: number)
	{
		try {
			console.log('et la ?')
			const chan = await this.findOneChan(chanid)
			const banned = await this.findBanned(userid)
			if (banned)
			{
				for (let i = 0; i < banned.channel.length; i++)
				{
					if (banned.channel[i].id == chanid)
					{
						client.emit('error', 'banned')
						return null
					}
					
				}
			}
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
						adminUsers:true,
						bannedUsers:true,
						mutedUsers :true,
						messages: true,
						user: true
					},

				});
				client.join(chan.channelName)
				return (this.exclude(userInChan, ['password']))
			}

		} catch (error) {
			console.log(error)
		}
	}


	async leaveRoom(client: Socket, oldChatId: number) {
		try {
			const oldChan = await this.findOneChan(oldChatId)
			
			if (oldChan)
				client.leave(oldChan.channelName)
		}
		catch (error) {
			console.log(error)
		}
		
	}

	async leaveChannel(chan: any, userid: number){
		try {
			
				let userInChan: any
				if (chan.ownerId != userid) {
					const admin = await this.findAdmin(userid)
					userInChan = await this.prismaService.channel.update({
						where: {
							id: chan.id,
						},
						data: {
							user: {
								disconnect: {
									id: userid
								},
							},
						},
						include: { 
							adminUsers:true,
							bannedUsers:true,
							mutedUsers :true,
							messages: true,
							user: true
						},
					});
					if (admin)
					{
						userInChan = await this.prismaService.channel.update({
							where: {
								id: chan.id,
							},
							data: {
								adminUsers: {
									disconnect: {
										id: userid
									}
								}
							},
							include: { 
								adminUsers:true,
								bannedUsers:true,
								mutedUsers :true,
								messages: true,
								user: true
							},
	
						});
						
					}
					if (userInChan)
						return (userInChan)
				}

		} catch (error) {
			console.log(error)
		}
	}

	async deleteChannel(chanid: number) {
		try {
			console.log('chan', chanid)
			await this.prismaService.channel.update({
				where: {
					id: chanid
				},
				data: {
					adminUsers: {
						deleteMany: {},
					},
					messages: {
						deleteMany: {},
					},
					bannedUsers: {
						deleteMany: {}
					},
					mutedUsers: {
						deleteMany: {},
					},
				}
			})
			await this.prismaService.channel.delete({
				where: {
					id: chanid
				}
			})
			return 'oui'
		} catch (error) {
			console.log(error)
			return 'non'
		}
	}

	exclude(user: any, keys: any) {
        return Object.fromEntries(
          Object.entries(user).filter(([key]) => !keys.includes(key))
        );
    }

	async verifyPassword(password: string, userid: number, chanid: number) {
		try {
			const chan = await this.findOneChan(chanid)
			if (chan?.password)
			{
				if (await argon2.verify(chan.password, password))
				{
					console.log('bon mdp')
					return (true)
				}
				else
				{
					console.log('mauvais mdp')
					return false
				}
			}
			
		} catch (error) {
			console.log(error)
		}
	}

	async updatePassword(pass: string, chanid: number) {
		try {
			let updateChan: any
			if (pass != '')
			{
				const hash = await argon2.hash(pass)
				const chan = await this.findOneChan(chanid)
				
				if (chan)
				{
					updateChan = await this.prismaService.channel.update({
						where: {
							id: chan.id,
						},
						data: {
							password: hash,
							locked: true,
						},
						include: {
							messages: true,
							adminUsers: true,
							bannedUsers: true,
							mutedUsers: true,
							user: true
						}
					});
				}
			}
			else
			{
				const chan = await this.findOneChan(chanid)
				if (chan)
				{
					updateChan = await this.prismaService.channel.update({
						where: {
							id: chan.id,
						},
						data: {
							password: '',
							locked: false,
						},
						include: {
							messages: true,
							adminUsers: true,
							bannedUsers: true,
							mutedUsers: true,
							user: true
						}
					});
				}
			}
			if (updateChan)
				return (this.exclude(updateChan, ['password']))
			} catch (error) {
			console.log(error, 'updatePassword')
		}
	}

	async updateStatus(status: boolean, chanid: number) {
		try {
			console.log('update status', chanid)
			const chan = await this.findOneChan(chanid)
			let updateChan: any
			if (chan)
			{
				updateChan = await this.prismaService.channel.update({
					where: {
						id: chan.id,
					},
					data: {
						is_private: status,
					},
				});
			}
			return updateChan
		} catch (error) {
			console.log(error, 'updateStatus')
		}
	}
}
