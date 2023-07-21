import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable({})

export class AuthService {
	constructor (
		private userService: UserService,
		private jwtService: JwtService) {
	}

	async signIn(username : string, password: string): Promise<any> {
		const user = await this.userService.findOne(username);
		if (user === undefined)
			throw new NotFoundException('User not found');
		if (user?.password !== password)
			throw new UnauthorizedException('Wrong Password');
		const payload = {sub: user.userId, username: user.username}
		return {
			access_token: await this.jwtService.signAsync(payload),
		}
	}
}
