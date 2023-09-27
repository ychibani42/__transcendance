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
				user: {
					connect: {
						   id: createChatDto.ownerId
					   },
				   },
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
					locked: false,
					user: {
						 connect: {
								id: createChatDto.ownerId
							}
						},
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

	async findUser1(userid: number, chanid: number) {
		try {
			const user = await this.prismaService.channel.findUniqueOrThrow({
				where: {
					id: chanid,
				},
				select: {
					user: {
						where: {
							id: userid,
						}
					}
				}
			});
			if (user.user[0])
				return user.user[0]
		}
		
		catch (error){
			console.log(error)
		}	
	}

	async findUser(userid: number, chanid: number) {
		try {
			let newuser: any;
			const user = await this.prismaService.channel.findUniqueOrThrow({
				where: {
					id: chanid,
				},
				select: {
					user: {
						where: {
							id: userid,
						}
					}
				}
			});
			if (!user.user[0])
			{
				newuser = await this.prismaService.user.findUniqueOrThrow({
					where: {
						id: userid
					}
				})
				return (newuser)
			}
		
		} catch (error) {
			console.log(error)
		}
	}

	async findAll(userid: number) {
		try {
			const chan = await this.prismaService.channel.findMany({
				where : {
					NOT : [{
						user : {
							some: {
								id : userid
							}
						},
					},
					{is_private : true}
					]
				},
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

	async createMessage( createMessageDto: CreateMessageDto) {
		try {
			const muted = await this.findMuted(createMessageDto.user, createMessageDto.id)
			if (muted)
				return null
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
				},
				include: { 
					adminUsers:true,
					bannedUsers:true,
					mutedUsers :true,
					messages: true,
					user: true
				},
			});
			return channels;
		} catch (error) {
			console.log(error)
		}
	}

	

	async findMuted(userid: number, chanid: number) {
		try {
			const user = await this.prismaService.muted.findFirst({
				where: {
					userId: userid,
					channelId: chanid
				},
			})
			return user
		} catch (error) {
			console.log(error)
		}
			
	}

	async findBanned(userid: number, chanid: number) {
		try {
			const user = await this.prismaService.banned.findFirst({
				where: {
					userId: userid,
					channelId: chanid
				},
			})
			return user
		} catch (error) {
			console.log(error)
		}
			
	}

	async findAdmin(userid: number, chanid: number) {
		try {
			const user = await this.prismaService.admin.findFirst({
				where: {
					userId: userid,
					channelId: chanid
				},
			})
			return user
		} catch (error) {
			console.log(error)
		}
			
	}

	async pushAdminChan(userid: number, chanid: number) {
		try {
			let admin: any = await this.prismaService.admin.create({
				data: {
					channelId: chanid,
					userId: userid,
				},
				include: {
					user: true,
				}
			});
			return admin
		} catch (error) {
			console.log(error)
			return null
		}
	}

	async pushBannedChan(userid: number, chanid: number) {
		try {

		let banned: any = await this.prismaService.banned.create({
			data: {
					channelId: chanid,
					userId: userid,
				},
			include: {
				user: true,
			}
		});

		await this.prismaService.channel.update({
			where: {
				id: chanid,
			},
			data: {
				user: { disconnect: { id: userid }, },
			},
		});
		this.unadmin(userid, chanid)
		this.unmute(userid, chanid)
		
		return banned
		} catch (error) {
			console.log(error)
		}
	}

	async pushMutedChan(userid: number, chanid: number) {
		try {
			let muted: any = await this.prismaService.muted.create({
				data: {
						channelId: chanid,
						userId: userid,
						duration: 0
					},
				include: {
					user: true,
				}
			});
		return muted;
		} catch (error) {
			console.log(error)
		}
	}

	async unadmin(userid: number, chanid: number) {
		try {
			let user: any
			let chan: any
			
				user = await this.findAdmin(userid, chanid)
				if (user)
				{
					chan = await this.prismaService.admin.delete({
						where: {
							id: user.id,
						},
					});
		}

		return user;
		} catch (error) {
			console.log(error)
		}
	}

	async unban(userid: number, chanid: number) {
		try {
			let user: any
			let chan: any
			
				user = await this.findBanned(userid, chanid)
				if (user)
				{
					chan = await this.prismaService.banned.delete({
						where: { id: user.id, },
					});
				
		}
		return user;
		} catch (error) {
			console.log(error)
		}
	}

	async unmute(userid: number, chanid: number) {
		try {
	
			let user: any
			let chan: any
			
				user = await this.findMuted(userid, chanid)
				if (user)
				{
					chan = await this.prismaService.muted.delete({
						where: {
							id: user.id,
						},
						
					});
				}
				
			
		return user;
		} catch (error) {
			console.log(error)
		}
	}
	async kickChan(userid: number, chanid: number) {
		try {
	
			let user: any
	

				user = await this.findUser1(userid, chanid)
				if (user)
				{
					await this.prismaService.channel.update({
						where: {
							id: chanid,
						},
					
						data: {
							user: { disconnect: { id: userid},},
						}
					});
				this.unadmin(userid, chanid)
				this.unmute(userid, chanid)
				
		}
		return user;
		} catch (error) {
			console.log(error)
		}
	}

	async joinRoom(client: Socket, userid: number, chanid: number)
	{
		try {
			const chan = await this.findOneChan(chanid)
			const banned = await this.findBanned(userid, chanid)
			if (banned)
			{
				client.emit('error', 'banned')
				return null
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
						adminUsers: { include: { user: true,}},
						bannedUsers:{ include: { user: true,}},
						mutedUsers: { include: { user: true,}},
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
					userInChan = await this.prismaService.channel.update({
						where: {
							id: chan.id,
						},
						data: {
							user: {
								disconnect: { id: userid }, },
						},
						include: { 
							adminUsers:true,
							bannedUsers:true,
							mutedUsers :true,
							messages: true,
							user: true
						},
					});
					
					this.unadmin(userid, chan.id)
					this.unmute(userid, chan.id)
					if (userInChan)
						return (userInChan)

		} catch (error) {
			console.log(error)
		}
	}

	async deleteChannel(chanid: number) {
		try {
			let chan = await this.prismaService.channel.update({
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
			chan = await this.prismaService.channel.delete({
				where: {
					id: chanid
				}
			})
			return 'ok'
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
				})
			}
			return updateChan
		} catch (error) {
			console.log(error, 'updateStatus')
		}
	}

	
}
