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
	
	async changename(idto : number , nameto :string){
		try {
			const user = await this.prismaService.user.update({where :{id : idto},data :{name: nameto}})
			console.log("USER",user)
			await this.prismaService.user.update({where : {id : idto},data:{profilefinish : true}})
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	}
	/*	real Update User	*/
}
