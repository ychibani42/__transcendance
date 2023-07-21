import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable({})

export class AuthService {
	constructor (
		private userService: UserService,
		private jwtService: JwtService) {
	}

	async signIn(userName : string, password: string): Promise<any> {
		const user = await this.userService.findOne(userName);

		console.log(user);
		if (user === undefined)
			throw new NotFoundException;
		if (user?.password !== password)
			throw new UnauthorizedException;
		const payload = {sub: user.userId, username: user.userName}
		return {
			access_token: await this.jwtService.signAsync(payload),
		}
	}
}
