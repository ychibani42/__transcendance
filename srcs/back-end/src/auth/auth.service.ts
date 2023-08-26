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
		private userService: UserService,
		private jwtService: JwtService,
		private prismaService: PrismaService,
	) {}

	async login(id : number , link : string) {
		console.log(id);
		try {
			const users = await this.prismaService.user.findUniqueOrThrow({where : {id: id}});
			console.log("USER find",users);
			return users;
		} 
		catch (error) {
			const user = await this.prismaService.user.create({
				data: {
					name: 'Yassine',
					hash_passwd: '1112',
					id42: 123,
				}
			});
			console.log("USER created",user);
			return user;
		}
	}

	async tokenreturn(User : any) {
		console.log(User.id,User.createAt)
		const payload = {id : User.id, createdAt : User.createdAt};
		const jwt = await this.jwtService.signAsync(payload);
		const decode = await this.jwtService.decode(jwt);
		console.log("Decode",decode)
		return(jwt);
	}
}
