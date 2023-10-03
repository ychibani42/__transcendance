import { BadRequestException, Injectable } from '@nestjs/common';
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

	async ChangeName(idto: number, nameto: string): Promise<string | undefined> {
		try {
			await this.prismaService.user.update({
				where: { id: idto },
				data: { name: nameto, profilefinish: true },
			});
			return nameto;
		} catch (error) {
			throw new BadRequestException('Failed to change name');
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
			console.log(error);
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
			return found.avatar;
		} catch (error) {
			throw new BadRequestException('Failed to find user');
		}
	}

	async findPP(username: string) {
		return (
			await this.findUniqueUser({
				name: username,
			})
		)?.avatar;
	}

	async findUserById(id: number) {
		try {
			const user = await this.prismaService.user.findUniqueOrThrow({
				where: { id: id },
				select: {
					id: true,
					name: true,
					avatar: true,
					profilefinish: true,
				},
			});
			return user;
		} catch (error) {
			throw new BadRequestException('Failed to find user');
		}
	}
}
