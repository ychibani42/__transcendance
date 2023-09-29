import { BadRequestException, Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

enum State {
    Disconected,
    Online,
    Afk,
    OnGame,
  }

@Injectable({})
export class FriendService {
	constructor(
		private prismaService: PrismaService,
	) {}
    
    async friendlist(id : number){
        try {
            const friend = this.prismaService.friends.findMany(
                {
                    where : { 
                        userFriend : id,
                    },
                include: {user : true}
            })
            return friend
        } catch (error) {
            throw new BadRequestException
        }
    }

    async addfriend(id : number, idadd : number){
        try {
            const friend = this.prismaService.friends.create({
                data :{
                    userFriend : id,
                    userId : idadd
                }
            })
            return friend
        } catch (error) {
            console.log(error)
        }
    }

}