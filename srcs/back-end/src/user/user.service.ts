import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { FindUserOptions } from './interfaces/findUserInterface';
import { UpdateUserOptions } from './interfaces/updateUserInterface';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async updatePp(id: number, file: any) {
		try {
			await this.prismaService.user.update({
				where: {
					id: id,
				},
				data: {
					avatar: file.path,
				},
			});
		} catch (error) {}
	}

	async changename(idto: number, nameto: string) {
		try {
			await this.prismaService.user.update({
				where: { id: idto },
				data: { name: nameto, profilefinish: true },
			});
			return true;
		} catch (error) {
			return false;
		}
	}

	async findAll(ids: number) {
		try {
			const users = await this.prismaService.user.findMany({
				where: {
					NOT: {
						OR: [
							{ id: ids },
							{
								friends: {
									some: {
										userFriend: ids,
									},
								},
							},
							{
								blockedUsers: {
									some: {
										userBloqued: ids,
									},
								},
							},
						],
					},
				},
			});
			return users;
		} catch (error) {
			return null;
		}
	}

	async updateUser(opt: FindUserOptions, data: UpdateUserOptions) {
		await this.prismaService.user.update({
			where: {
				name: opt.name,
				id: opt.id,
				id42: opt.id42,
			},
			data: {
				avatar: data.avatar,
				name: data.name,
			},
		});
	}

	async updatePP(id: number, file: any) {
		await this.updateUser(
			{
				id: id,
			},
			{
				avatar: file.path,
			},
		);
	}

	async findUniqueUser(opt: FindUserOptions): Promise<User | undefined> {
		if (opt.name || opt.id) {
			const found = await this.prismaService.user.findUnique({
				where: {
					name: opt.name,
					id: opt.id,
				},
			});
			return found ? found : undefined;
		}
		return undefined;
	}
	async findUser(id: number) {
		try {
			const found = await this.prismaService.user.findUniqueOrThrow({
				where: {
					id: id,
				},
			});
			console.log('console log si found [' + found.avatar + ']');
			return found.avatar;
		} catch (error) {
			return undefined;
		}
	}
	async findPP(username: string) {
		return (
			await this.findUniqueUser({
				name: username,
			})
		)?.avatar;
	}
}
