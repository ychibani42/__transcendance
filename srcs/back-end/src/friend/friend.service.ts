import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class FriendService {
	constructor(private prismaService: PrismaService) {}

	async friendlist(id: number) {
		try {
			const friend = this.prismaService.friends.findMany({
				where: {
					userFriend: id,
				},
				include: { user: true },
			});
			return friend;
		} catch (error) {
			throw new BadRequestException();
		}
	}

	async blockedlist(id: number) {
		try {
			const block = this.prismaService.blockedU.findMany({
				where: { userBloqued: id },
				include: { user: true },
			});
			return block;
		} catch (error) {
			throw new BadRequestException();
		}
	}
	async findfriend(id: number, idadd: number) {
		try {
			const friend = await this.prismaService.friends.findFirstOrThrow({
				where: {
					userId: idadd,
					userFriend: id,
				},
			});
			return friend;
		} catch (error) {
			return null;
		}
	}

	async addfriend(id: number, idadd: number) {
		try {
			if (await this.findfriend(id, idadd)) {
				return;
			}
			await this.prismaService.friends.create({
				data: {
					userFriend: id,
					userId: idadd,
				},
			});
		} catch (error) {
			console.log(error);
		}
	}

	async deletefriend(id: number, idadd: number) {
		try {
			const friend = await this.findfriend(id, idadd);
			if (friend === null) {
				return;
			}
			await this.prismaService.friends.delete({
				where: {
					id: friend.id,
					userId: idadd,
					userFriend: id,
				},
			});
		} catch (error) {
			console.log(error);
		}
	}

	async findblock(id: number, idadd: number) {
		try {
			const block = await this.prismaService.blockedU.findFirstOrThrow({
				where: {
					userId: idadd,
					userBloqued: id,
				},
			});
			return block;
		} catch (error) {
			return null;
		}
	}

	async blockfriend(id: number, idadd: number) {
		try {
			if (await this.findfriend(id, idadd)) {
				await this.deletefriend(id, idadd);
			}
			const blocked = await this.prismaService.blockedU.create({
				data: {
					userId: idadd,
					userBloqued: id,
				},
			});
			return blocked;
		} catch (error) {
			console.log(error);
		}
	}

	async unblockfriend(id: number, idadd: number) {
		try {
			const block = await this.findblock(id, idadd);

			if (block === null) {
				return;
			}
			await this.prismaService.blockedU.delete({
				where: {
					id: block.id,
					userId: idadd,
					userBloqued: id,
				},
			});
		} catch (error) {
			console.log(error);
		}
	}
}
