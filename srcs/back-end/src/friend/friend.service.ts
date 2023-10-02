import { BadRequestException, Injectable } from '@nestjs/common';
import { find } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class FriendService {
	constructor(private prismaService: PrismaService) {}

	async friendlist(id: number) {
		try {
			const friend = this.prismaService.friends.findMany({
				where: { userFriend: id },
				include: { user: true },
			});
			return friend;
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

	async blockfriend(id: number, idadd: number) {
		try {
			if (await this.findfriend(id, idadd)) {
				await this.deletefriend(id, idadd);
			}
			await this.prismaService.blockedU.create({
				data: {
					userBloqued: idadd,
					userId: id,
				},
			});
		} catch (error) {
			console.log(error);
		}
	}
}
