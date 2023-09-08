import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {
	constructor (private readonly prismaService: PrismaService) {}

	async updatePp(id: number, file: any) {
		try
		{
			await this.prismaService.user.update({
				where: {
					id: id,
				},
				data: {
					avatar: file.path,
				},
			});
		} catch (error) {

		}
	}
	/*	real Update User	*/
}
