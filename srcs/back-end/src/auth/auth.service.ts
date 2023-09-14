import { BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import  * as QRCode  from 'qrcode'
import { authenticator } from 'otplib';

@Injectable({})
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private prismaService: PrismaService,
	) {}

	async login(id: number, link: string) {
		console.log(id, link);
		try {
			const users = await this.prismaService.user.findUniqueOrThrow({where : {id42: id}});
			return users;
		} catch (error) {
			const user = await this.prismaService.user.create({
				data: {
					id42: id,
					name: link,
					avatar: './storage/uploads/default.jpg',
				},
			});
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
		return(jwt);
	}


	decodedtok(token : string)
	{
		const decode = this.jwtService.decode(token)
		return decode;
	}

	async loginInviter(id : number) {
		console.log(id);
		try {
			const users = await this.prismaService.user.findUniqueOrThrow({where : {id42: id}});
			return users;
		} catch (error) {
			const user = await this.prismaService.user.create({
				data: {
					avatar: './storage/uploads/default.jpg',
					id42: id,
				},
			});
			return user;
		}
	}

	async changeotp(id: number) {
		console.log(id)
		try {
			const users = await this.prismaService.user.findUniqueOrThrow({where : {id: id}});
			let user ;
			if (users.otpenable == true)
				user = await this.prismaService.user.update({where : {id : id},data : {otpenable : false}})
			else
				user = await this.prismaService.user.update({where : {id : id},data : {otpenable : true}})
			return users.otpenable
		} 
		catch (error) {
			throw new BadRequestException
		}
	}

	async generateCode(int : string)
	{
		const secret = authenticator.generateSecret()
		const uri = authenticator.keyuri(int,"test",secret)
		console.log(secret)
		const code = await QRCode.toDataURL(uri)
		return code
	}
}
