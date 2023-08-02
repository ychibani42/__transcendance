import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private prismaService: PrismaService,
	) {}

	async signIn(username: string, password: string): Promise<any> {
		const user = await this.userService.findOne(username);
		if (user === undefined) throw new NotFoundException('User not found');
		if (user?.password !== password)
			throw new UnauthorizedException('Wrong Password');
		const payload = { sub: user.userId, username: user.username };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
	async signUp(dto: AuthDto) {
		/* Create hash password */
		const hash = await argon.hash(dto.password);
		/* Save user into prisma */
		const user = await this.prismaService.user.create({
			data: {
				name: dto.username,
				hash_passwd: hash,
			},
		});
		/* return user */
		return user;
	}
}
