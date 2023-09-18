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
			Connected : User.state
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
		try {
			const users = await this.prismaService.user.findUniqueOrThrow({where : {id: id}});
			let user : any;
			if (users.otpenable == true)
				user = await this.prismaService.user.update({where : {id : id},data : {otpenable : false , otpvalider : true}})
			else
				user = await this.prismaService.user.update({where : {id : id},data : {otpenable : true , otpvalider : true}})
			return users.otpenable
		} 
		catch (error) {
			throw new BadRequestException
		}
	}

	async loginInfo(token : any){
		try {
			const user = await this.prismaService.user.findUniqueOrThrow({
				where : {id: token.id},
				select : {
					id : true,
					profilefinish : true,
					otpenable : true,
					otpvalider : true,
				}
			});
			return user
		} catch (error) {
			throw new BadRequestException
		}
	}

	async generateCode(token : string)
	{
		try {
			const decode = this.jwtService.verify(token)
			const user = await this.prismaService.user.findFirstOrThrow({where :{ id : decode.id}})
			if(user.name == null)
				return false
			const secret = authenticator.generateSecret()
			await this.prismaService.user.update({where :{ id : decode.id}, data :{optcode : secret}})
			const uri = authenticator.keyuri(user.name,"test",secret)
			const code = await QRCode.toDataURL(uri)
			return code
		} catch (error) {
			return null
		}
	}

	async verify(code : number, token : string){
		
		const decode = this.jwtService.verify(token)
		try {
			const user = await this.prismaService.user.findFirstOrThrow({where :{ id : decode.id}})

		} catch (error) {
			return false
		}
	}
}
