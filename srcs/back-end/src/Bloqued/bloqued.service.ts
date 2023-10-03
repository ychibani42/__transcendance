import { BadRequestException, Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class BloquedService {
	constructor(
		private prismaService: PrismaService,
	) {}
    
    async bloquedlist(id : number){
        try {
            const bloqued = this.prismaService.blockedU.findMany(
                {where : { userBloqued : id},
                include: { user : true}
            })
            return bloqued
        } catch (error) {
            throw new BadRequestException
        }
    }

    async addbloqued(id : number, idadd : number){
        try {
            const bloqued = this.prismaService.blockedU.create({
                data :{
                    userBloqued : id,
                    userId : idadd
                }
            })
            return bloqued
        } catch (error) {
            console.log(error)
        }
    }

}