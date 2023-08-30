import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private prismaService: PrismaService,
	) {}

	async login(id: number, link: string) {
		console.log(id, link);
		try {
			const users = await this.prismaService.user.findUniqueOrThrow({
				where: { id42: id },
			});
			console.log('USER find', users);
			return users;
		} catch (error) {
			const user = await this.prismaService.user.create({
				data: {
					id42: id,
					name: link,
				},
			});
			console.log('USER created', user);
			return user;
		}
	}

	async tokenreturn(User: any) {
		const payload = {
			id: User.id,
			Profile: User.profilefinish,
			TwoFa: User.otpenable,
		};
		const jwt = await this.jwtService.signAsync(payload);
		const decode = await this.jwtService.decode(jwt);
		console.log('Decode', decode);
		return jwt;
	}

	async decodedtok(token: string) {
		const decode = await this.jwtService.decode(token);
		return decode;
	}

	async loginInviter(id: number) {
		console.log(id);
		try {
			const users = await this.prismaService.user.findUniqueOrThrow({
				where: { id42: id },
			});
			console.log('USER find', users);
			return users;
		} catch (error) {
			const user = await this.prismaService.user.create({
				data: {
					id42: id,
				},
			});
			console.log('USER created', user);
			return user;
		}
	}

	async changeotp(id: number) {
		try {
			const users = await this.prismaService.user.findUniqueOrThrow({
				where: { id: id },
			});
			if (users.otpenable == true) {
				const user = await this.prismaService.user.update({
					where: { id: id },
					data: { otpenable: false },
				});
			} else {
				const user = await this.prismaService.user.update({
					where: { id: id },
					data: { otpenable: true },
				});
			}
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}
